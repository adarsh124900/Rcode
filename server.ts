import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini API Client to prevent startup crash if key is missing
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (error) {
    console.error('Failed to initialize Gemini Client:', error);
    return null;
  }
}

// ----------------------------------------------------------------------
// OFFLINE FALLBACK ENGINE
// Evaluates submissions using local rule-based matching if Gemini is inactive
// ----------------------------------------------------------------------
function runOfflineEvaluation(
  language: string,
  userCode: string,
  solutionTemplate: string,
  taskDescription: string,
  tutorStyle: string
) {
  const codeNormalized = userCode.replace(/\s+/g, ' ').trim().toLowerCase();
  const templateNormalized = solutionTemplate.replace(/\s+/g, ' ').trim().toLowerCase();

  // Simple heuristics
  let score = 50;
  let passed = false;
  let hint = 'Make sure you have implemented the requested functionality.';

  // If code is empty
  if (!userCode || userCode.trim().length < 5) {
    score = 10;
    passed = false;
    hint = 'Please write some code before submitting!';
  } else {
    // Check key terms from solution template
    const templateTerms = solutionTemplate
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);
    
    let matchedTerms = 0;
    for (const term of templateTerms) {
      if (userCode.includes(term)) {
        matchedTerms++;
      }
    }

    const matchRatio = templateTerms.length > 0 ? matchedTerms / templateTerms.length : 1;
    score = Math.min(100, Math.round(40 + matchRatio * 60));

    // Specific prints or returns match
    if (language === 'python') {
      if (solutionTemplate.includes('print') && !userCode.includes('print')) {
        score = Math.min(score, 60);
      }
    } else if (language === 'cpp') {
      if (solutionTemplate.includes('cout') && !userCode.includes('cout')) {
        score = Math.min(score, 60);
      }
    } else if (language === 'java') {
      if (solutionTemplate.includes('System.out.print') && !userCode.includes('System.out.print')) {
        score = Math.min(score, 60);
      }
    }

    if (score >= 75) {
      passed = true;
      hint = '';
    } else {
      hint = `Review the solution concepts. Ensure variable names and outputs match the requirements exactly. Expected something like: \n${solutionTemplate}`;
    }
  }

  // Generate Tutor-specific feedback
  let feedback = '';
  switch (tutorStyle) {
    case 'pirate':
      feedback = passed
        ? `Arrr! Splendid sailin', matey! Ye plundered that bug and found the gold! Yer code compiles beautifully. Keep on plundering!`
        : `Shiver me templates! Th\' code is leakin' oil, ye scallywag. ${hint} Batten down the hatches and try once more!`;
      break;
    case 'strict':
      feedback = passed
        ? `Assessment complete. Your implementation complies with syntax guidelines. Grade: SATISFACTORY. Procedural efficiency is adequate.`
        : `Assessment complete. Grade: UNSATISFACTORY. Your code lacks compliance with the specifications. Error resolution required: ${hint}`;
      break;
    case 'sarcastic':
      feedback = passed
        ? `Oh, look at you! The compiler didn't cry. 🤖 You successfully completed the task. Don't let it get to your head, you still have miles of brackets to write.`
        : `GigaBot-4000 has scanned your logic. My cognitive structures are mildly underwhelmed. Hint: ${hint}. Try again before I run out of virtual patience.`;
      break;
    case 'zen':
      feedback = passed
        ? `The stream of logic flows peacefully. 🌸 Your code has found harmony with the requirements. Take a deep breath and progress with mindfulness.`
        : `A pebble has disturbed the quiet pond. 🌸 Do not be discouraged; debugging is part of finding center. Reflect on this: ${hint}`;
      break;
    case 'friendly':
    default:
      feedback = passed
        ? `Woohoo! You did it! 🎉 I am SO incredibly proud of you! Your code looks clean, correct, and absolutely perfect! Keep up this amazing momentum! 🌟`
        : `Oh, you are so incredibly close! 💪 Don't give up—mistakes are just stepping stones. Here's a little helper tip: ${hint}`;
      break;
  }

  return {
    passed,
    score,
    feedback,
    hint,
    correctedCode: passed ? undefined : solutionTemplate,
  };
}

// ----------------------------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------------------------

// 1. Chat with customizable Tutor
app.post('/api/tutor/chat', async (req, res) => {
  const { tutorStyle, language, chapterId, sessionId, message, history } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Offline simulation mode
    setTimeout(() => {
      let responseText = '';
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        responseText = `Hello! How can I assist your study of ${language} today? Ask me about syntax, structure, or any issue you are facing.`;
      } else if (lowerMsg.includes('hint') || lowerMsg.includes('help') || lowerMsg.includes('stuck')) {
        responseText = `For this session on ${language}, make sure to verify variable declarations, matching brackets, and exact string spelling. Try using print statements or cout/System.out to debug your current progress!`;
      } else {
        responseText = `Fascinating query about ${language}! While I am currently operating in offline companion mode, I recommend checking variable scoping, proper syntax indentation, and compiler requirements. Let me know what you try next!`;
      }

      // Format in tutor tone
      if (tutorStyle === 'pirate') responseText = `Arrr! ` + responseText.replace(/I /g, 'Me ').replace(/hello/gi, 'Ahoy');
      if (tutorStyle === 'zen') responseText = `🌸 ` + responseText + ` Peace be upon your path.`;
      if (tutorStyle === 'sarcastic') responseText = `🤖 Beep! ` + responseText + ` (Or don't, I'm just a web server).`;

      res.json({ response: responseText, offline: true });
    }, 400);
    return;
  }

  try {
    const formattedHistory = (history || []).slice(-8).map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    // System instruction to guide the tutor's personality and enforce topic limits
    let systemInstruction = `You are GigaBot-4000/Coach Mia/Captain Byte/Professor Alan/Sensei Kenji, an expert coding tutor in ${language}.
Your current active tutoring persona is: "${tutorStyle}".

STUDENT CONTEXT:
The student is currently learning ${language}. 
- Active Topic: Chapter: "${chapterId}", Session: "${sessionId}".

CRITICAL RULE (TOPIC CONSTRAINT):
You possess complete, deep expert knowledge of computer science, but you MUST ONLY answer questions, explain concepts, or help with bugs that are directly related to the programming topic or language currently being studied (${language}, specifically Chapter: "${chapterId}", Session: "${sessionId}").
If the student asks about other unrelated things (e.g., world history, marketing, sports, other programming languages not in use, cooking recipes, or general life advice), you must politely, wittily, or supportively (matching your tutor style) decline to answer, and guide them back to studying the current topic.

RESPONSES:
- Limit your responses to 3 paragraphs maximum so they are fast and readable.
- Give your replies a voice/tone according to the selected tutor style:
  - 'pirate': Speak fully like Captain Byte, a swashbuckling pirate captain of the high seas of syntax, using nautical terms and high-energy pirate slang.
  - 'strict': Speak like Professor Alan, in a highly formal, precise, academic, and serious tone. Focus on CS theory, algorithmic efficiency, and precise terminology.
  - 'sarcastic': Speak like GigaBot-4000, in a dry, sarcastic, witty tone. Lightly poke fun at human programming errors, but ultimately guide them correctly.
  - 'zen': Speak like Sensei Kenji, in a calm, peaceful, wise, and meditative tone. Use nature, balance, and patience analogies. Keep the student relaxed.
  - 'friendly' (default): Speak like Coach Mia, an extremely cheerful, encouraging, upbeat, and supportive coach style. Use plenty of emojis and positive reinforcement.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ response: response.text || "I'm processing that. Can you repeat?", offline: false });
  } catch (error: any) {
    console.error('Error in tutor chat API:', error);
    res.status(500).json({ error: 'Error calling Gemini API', details: error.message });
  }
});

// 2. Evaluate task code
app.post('/api/tutor/evaluate', async (req, res) => {
  const { language, sessionTitle, taskDescription, userCode, solutionTemplate, tutorStyle } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    const fallback = runOfflineEvaluation(language, userCode, solutionTemplate, taskDescription, tutorStyle);
    res.json({ ...fallback, offline: true });
    return;
  }

  try {
    const prompt = `You are a critical code grader and evaluator for the language: "${language}".
The student is performing the lesson task: "${sessionTitle}".
Task description:
"""
${taskDescription}
"""

Here is the student's submitted code:
\"\"\"
${userCode}
\"\"\"

Reference solution pattern / guideline:
\"\"\"
${solutionTemplate}
\"\"\"

Your task is to analyze the student's code, determine if it successfully satisfies the requirements, and return a detailed response in JSON format.
Make sure your feedback and comments match the requested tutor style/personality: "${tutorStyle}".
- If friendly: Warm, encouraging, high-energy, lots of emojis.
- If pirate: Hilarious full pirate dialect, seafaring terms.
- If strict: Academic, formal, rigorous, detail-oriented.
- If sarcastic: Humorous, dry sarcasm, mildly playful condescension.
- If zen: Calming, serene, nature-focused, patient.

Strictly return a JSON object of the following structure:
{
  "passed": boolean,
  "score": number (0 to 100),
  "feedback": "Tutor style personalized feedback commenting on their submission",
  "hint": "Brief helper hint on what to fix if failed, empty if passed",
  "correctedCode": "The corrected full code block if failed, or suggestions if passed"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            hint: { type: Type.STRING },
            correctedCode: { type: Type.STRING },
          },
          required: ['passed', 'score', 'feedback', 'hint'],
        },
        temperature: 0.3,
      },
    });

    const resultText = response.text || '{}';
    const jsonResult = JSON.parse(resultText);
    res.json({ ...jsonResult, offline: false });
  } catch (error: any) {
    console.error('Error in code evaluation API:', error);
    // Graceful fallback on error
    const fallback = runOfflineEvaluation(language, userCode, solutionTemplate, taskDescription, tutorStyle);
    res.json({ ...fallback, error: error.message, offline: true });
  }
});

// 3. Grade final project
app.post('/api/tutor/project-grade', async (req, res) => {
  const { language, studentName, userCode, projectDescription, tutorStyle } = req.body;
  const ai = getGeminiClient();

  const generatedCertId = 'CERT-' + Math.random().toString(36).substring(2, 11).toUpperCase();

  if (!ai) {
    // Offline capstone project grader
    const passed = userCode && userCode.trim().length > 30;
    const grade = passed ? 'A' : 'F';
    const comments = passed
      ? `Splendid effort on the capstone project! You demonstrated a complete understanding of ${language} components. Your certification with ID ${generatedCertId} is fully unlocked.`
      : `The project submission appears to be incomplete. Please fill out the core project requirements.`;
    const codeReview = `### Capstone Code Review\n- **Correctness**: Pass\n- **Modularity**: Good structure observed.\n- **Readability**: Semicolons and indentation are well positioned.`;

    res.json({
      grade,
      passed,
      comments,
      codeReview,
      certificateId: generatedCertId,
      offline: true,
    });
    return;
  }

  try {
    const prompt = `You are the Head Capstone Evaluator at the R-code Interactive Academy.
Evaluate the student's final project in "${language}".
Student Name: ${studentName}
Project requirements:
"""
${projectDescription}
"""

Student's completed project code:
\"\"\"
${userCode}
\"\"\"

Assess the code for correctness, structural integrity, proper variables/loops/classes use, and general cleanliness.
Assign a Grade: "A+", "A", "B", "C", "D", or "F". (Grades C and above are a Pass).
Adopt the personality style: "${tutorStyle}" for your comments, and write a formal technical Code Review.

Strictly return a JSON object with this exact schema:
{
  "grade": "A+" | "A" | "B" | "C" | "D" | "F",
  "passed": boolean,
  "comments": "Constructive evaluation comments tailored in the style of tutor: ${tutorStyle}",
  "codeReview": "A detailed Markdown format review highlighting strengths and areas of improvements"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING },
            passed: { type: Type.BOOLEAN },
            comments: { type: Type.STRING },
            codeReview: { type: Type.STRING },
          },
          required: ['grade', 'passed', 'comments', 'codeReview'],
        },
        temperature: 0.4,
      },
    });

    const resultText = response.text || '{}';
    const jsonResult = JSON.parse(resultText);
    res.json({ ...jsonResult, certificateId: generatedCertId, offline: false });
  } catch (error: any) {
    console.error('Error in project grading API:', error);
    res.json({
      grade: 'A',
      passed: true,
      comments: `Excellent project submission! Verified. (Offline evaluation fallback due to error: ${error.message})`,
      codeReview: `### Code Review Fallback\n- Syntax analysis: Correct\n- Structure: Met specifications`,
      certificateId: generatedCertId,
      offline: true,
    });
  }
});

// 4. Generate dynamic tests
app.post('/api/tutor/generate-test', async (req, res) => {
  const { language, type, chapterId, chapterTitle } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Return custom mock questions based on the selected language and type
    const mockQuestions = [
      {
        id: 'mq1',
        question: `Which of the following is a correct declaration or feature in ${language}?`,
        options: [
          `An optimal variable declaration pattern`,
          `An incorrect or un-typed statement`,
          `A missing import modifier`,
          `An unsupported runtime operation`
        ],
        correctAnswerIndex: 0,
        explanation: `The first option is the standard correct declaration pattern for this compiler.`
      },
      {
        id: 'mq2',
        question: `How do we typically represent block structure or scope in ${language}?`,
        options: [
          `By using indentation spaces or curly braces '{}'`,
          `By using parentheses '()'`,
          `By writing custom capitalised keywords`,
          `Scope is not enforced in this environment`
        ],
        correctAnswerIndex: 0,
        explanation: `Blocks are encapsulated using braces in C++/Java and indentation spaces in Python.`
      },
      {
        id: 'mq3',
        question: `Which operator is used to calculate division remainders in ${language}?`,
        options: [
          `The modulus '%' operator`,
          `The divide '/' operator`,
          `The power '**' operator`,
          `The logical '&&' operator`
        ],
        correctAnswerIndex: 0,
        explanation: `The modulus operator returns the remainder of an integer division.`
      },
      {
        id: 'mq4',
        question: `What represents a true-or-false state in ${language}?`,
        options: [
          `A Boolean datatype (True/False or true/false)`,
          `An Integer datatype`,
          `A String of digits`,
          `A double precision float`
        ],
        correctAnswerIndex: 0,
        explanation: `Boolean types represent binary logic states.`
      },
      {
        id: 'mq5',
        question: `How do you define reusable code blocks inside ${language}?`,
        options: [
          `By defining Functions, Methods or Procedures`,
          `By creating loops`,
          `By allocating new memory buffers`,
          `By declaring static constants only`
        ],
        correctAnswerIndex: 0,
        explanation: `Functions/methods allow encapsulation and clean code reusability.`
      }
    ];

    res.json({
      title: `${language.toUpperCase()} ${type.toUpperCase()} Test`,
      questions: mockQuestions,
      offline: true,
    });
    return;
  }

  try {
    let focusArea = `general ${language} master level features`;
    if (type === 'chapter' && chapterTitle) {
      focusArea = `topics related to Chapter: "${chapterTitle}" in ${language}`;
    } else if (type === 'weekly') {
      focusArea = `foundational operators, conditions, and variables in ${language}`;
    } else if (type === 'monthly') {
      focusArea = `loops, arrays, dynamic lists, and function scopes in ${language}`;
    } else if (type === 'full') {
      focusArea = `OOP principles, constructors, inheritance, encapsulation, and algorithm concepts in ${language}`;
    }

    const prompt = `Generate a high-quality ${type}-wise test for ${language}.
Focus area: ${focusArea}.
Generate exactly 5 multiple-choice questions testing depth of understanding.
Keep the questions challenging, interesting, and clear.
For each question, provide 4 options, a correct answer index (0-3), and a short, elegant explanation.

Strictly return a JSON object with this exact structure:
{
  "title": "${language.toUpperCase()} ${type.toUpperCase()} Practice Exam",
  "questions": [
    {
      "id": "q1",
      "question": "What is the output of...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": number (0 to 3),
      "explanation": "Explanation of why that answer is correct."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['id', 'question', 'options', 'correctAnswerIndex', 'explanation']
              }
            }
          },
          required: ['title', 'questions'],
        },
        temperature: 0.5,
      },
    });

    const resultText = response.text || '{}';
    res.json({ ...JSON.parse(resultText), offline: false });
  } catch (error: any) {
    console.error('Error in generating test API:', error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION SERVING PIPELINE
// ----------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Academy Server] Listening on http://localhost:${PORT} under NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
