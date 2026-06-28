import React, { useState } from 'react';
import { Test, TestQuestion, Language } from '../types';
import { Award, CheckCircle2, XCircle, Info, RefreshCw, Clock, ArrowRight, Play } from 'lucide-react';

interface DynamicTestCenterProps {
  language: Language;
  onSaveScore: (testId: string, score: number) => void;
  completedTests: Record<string, number>;
}

export default function DynamicTestCenter({
  language,
  onSaveScore,
  completedTests,
}: DynamicTestCenterProps) {
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [testResult, setTestResult] = useState<{ score: number; passed: boolean; submitted: boolean } | null>(null);

  const availableTests = [
    {
      id: `${language}_test_ch1`,
      title: 'Chapter 1: Foundations Quiz',
      desc: 'Verify your knowledge on print functions, variables, values, and math operators.',
      type: 'chapter' as const,
      chapterId: `${language === 'python' ? 'py' : language}_ch1`,
      chapterTitle: 'Foundations',
    },
    {
      id: `${language}_test_ch2`,
      title: 'Chapter 2: Decisive Loops Quiz',
      desc: 'Validate your understanding of if/else logic statements, while and for loops.',
      type: 'chapter' as const,
      chapterId: `${language === 'python' ? 'py' : language}_ch2`,
      chapterTitle: 'Control Flow',
    },
    {
      id: `${language}_test_weekly`,
      title: 'Weekly Sprint Challenge',
      desc: 'An adaptive weekly recap test covering multi-topic syntaxes and scope variables.',
      type: 'weekly' as const,
    },
    {
      id: `${language}_test_monthly`,
      title: 'Monthly Milestone Exam',
      desc: 'A comprehensive evaluation including array manipulations and programmatic control paths.',
      type: 'monthly' as const,
    },
    {
      id: `${language}_test_full`,
      title: 'Master Course Qualification Exam',
      desc: 'The ultimate qualification exam. Pass this comprehensive test with >= 80% to unlock your final Capstone project!',
      type: 'full' as const,
    },
  ];

  const handleStartTest = async (testConfig: typeof availableTests[0]) => {
    setIsGenerating(true);
    setActiveTest(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTestResult(null);

    try {
      const response = await fetch('/api/tutor/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          type: testConfig.type,
          chapterId: testConfig.chapterId,
          chapterTitle: testConfig.chapterTitle,
        }),
      });

      if (!response.ok) throw new Error('Test generation timeout');

      const data = await response.json();
      setActiveTest({
        id: testConfig.id,
        title: data.title || testConfig.title,
        type: testConfig.type,
        questions: data.questions,
      });
    } catch (error) {
      console.error('Failed to generate test:', error);
      // Inline mock fallback in case of connection limits
      setActiveTest({
        id: testConfig.id,
        title: testConfig.title,
        type: testConfig.type,
        questions: [
          {
            id: 'q1',
            question: `In ${language.toUpperCase()}, which syntax represents comments?`,
            options: [
              `Using symbol modifiers like '//' or '#'`,
              `Encapsulating inside double braces '{{ }}'`,
              `Ending statements with unique tag formats`,
              `Comments are not supported`
            ],
            correctAnswerIndex: 0,
            explanation: `Comments are written using '#' in Python and '//' in C++/Java.`,
          },
          {
            id: 'q2',
            question: `What represents a logical true or false condition inside ${language.toUpperCase()}?`,
            options: [
              `Integer representations`,
              `Boolean primitive formats (True/False)`,
              `String values`,
              `None of the above`
            ],
            correctAnswerIndex: 1,
            explanation: `Boolean types represent binary logic states.`,
          },
          {
            id: 'q3',
            question: `Which flow statement repeats a block of code as long as a test condition remains true?`,
            options: [
              `An 'if' conditional branch`,
              `A 'while' looping loop`,
              `A 'break' instruction`,
              `A static structure declaration`
            ],
            correctAnswerIndex: 1,
            explanation: `While loops run continuously as long as their condition is true.`,
          },
          {
            id: 'q4',
            question: `Which of the following is most appropriate to describe a function or method?`,
            options: [
              `A reusable block of code that performs specific operations`,
              `A static variable container`,
              `A constant decimal price value`,
              `An output stream connection`
            ],
            correctAnswerIndex: 0,
            explanation: `Functions allow code encapsulation, modularity, and easy reusability.`,
          },
          {
            id: 'q5',
            question: `What is the default index numbering starting offset for array structures inside ${language.toUpperCase()}?`,
            options: [
              `Offset starting at index 1`,
              `Offset starting at index 0`,
              `Offset starting at index -1`,
              `Indices are allocated dynamically`
            ],
            correctAnswerIndex: 1,
            explanation: `Array data indices are zero-based (starting from index 0).`,
          },
        ],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    let correctCount = 0;
    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeTest.questions.length) * 100);
    const passed = score >= 80;

    setTestResult({ score, passed, submitted: true });
    onSaveScore(activeTest.id, score);
  };

  const handleQuitTest = () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
      setActiveTest(null);
      setTestResult(null);
    }
  };

  return (
    <div id="dynamic-test-center" className="space-y-8">
      
      {/* 1. Testing Lobby Panel */}
      {!activeTest && !isGenerating && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-slate-800 flex items-center gap-2">
              <Award className="h-6 w-6 text-indigo-600" />
              Assessment & testing lobby
            </h2>
            <p className="text-sm text-slate-500">
              Test your proficiency in {language.toUpperCase()} with dynamic examinations. Scores are tracked on your master profile scorecard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTests.map((test) => {
              const previousScore = completedTests[test.id];
              const isPassed = previousScore !== undefined && previousScore >= 80;
              return (
                <div
                  key={test.id}
                  id={`test-lobby-card-${test.id}`}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between gap-6 transition-all duration-300 ${
                    isPassed ? 'border-emerald-100 shadow-2xs' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        test.type === 'full' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {test.type === 'chapter' ? 'Chapter Exam' : test.type === 'full' ? 'Capstone Exam' : 'Sprint Exam'}
                      </span>
                      {previousScore !== undefined && (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          Score: {previousScore}% {isPassed ? 'Passed' : 'Retry'}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold font-display text-slate-800 text-base">{test.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{test.desc}</p>
                  </div>

                  <button
                    id={`start-test-btn-${test.id}`}
                    onClick={() => handleStartTest(test)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                      isPassed 
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {previousScore !== undefined ? 'Re-take Assessment' : 'Launch Examination'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Loading State Animation */}
      {isGenerating && (
        <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-12 text-center space-y-4">
          <div className="relative inline-block">
            <span className="text-5xl filter drop-shadow-sm inline-block animate-bounce">📝</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold font-display text-slate-800">Compiling Exam Papers...</h3>
            <p className="text-xs text-slate-500">
              Our AI is consulting your progression and assembling 5 tailored coding questions to stress-test your knowledge. This takes a brief moment!
            </p>
          </div>
        </div>
      )}

      {/* 3. Active Quiz board */}
      {activeTest && (
        <div className="bg-white border border-slate-100 shadow-xs rounded-2xl overflow-hidden">
          
          {/* Header Progress Tracker */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                Active Assessment
              </span>
              <h3 className="font-bold font-display text-slate-800 text-sm">
                {activeTest.title}
              </h3>
            </div>
            
            <button
              id="quit-test-btn"
              onClick={handleQuitTest}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Quit Exam
            </button>
          </div>

          {/* Test Questions Body */}
          <div className="p-6 md:p-8 space-y-8">
            
            {!testResult?.submitted ? (
              // ACTIVE TESTING MODE
              <div className="space-y-8">
                {/* Question Slider Header */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Question {currentQuestionIdx + 1} of {activeTest.questions.length}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    Untimed Exam
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / activeTest.questions.length) * 100}%` }}
                  />
                </div>

                {/* Question Statement */}
                <div className="space-y-6">
                  <h4 className="text-base font-bold text-slate-800 leading-relaxed font-display">
                    {activeTest.questions[currentQuestionIdx].question}
                  </h4>

                  {/* Options Radio Buttons Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {activeTest.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                      const qId = activeTest.questions[currentQuestionIdx].id;
                      const isSelected = selectedAnswers[qId] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          id={`opt-btn-${currentQuestionIdx}-${oIdx}`}
                          onClick={() => handleSelectOption(qId, oIdx)}
                          className={`w-full text-left px-5 py-4 border rounded-xl text-xs font-bold leading-relaxed transition-all duration-200 flex justify-between items-center cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/25 ring-2 ring-indigo-600/10'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`h-4.5 w-4.5 rounded-full border shrink-0 flex items-center justify-center ${
                            isSelected ? 'border-indigo-600 bg-indigo-600 text-white text-[10px]' : 'border-slate-300'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slide controls footer */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(idx => idx - 1)}
                    className="px-4 py-2 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-500 disabled:opacity-40 transition-colors"
                  >
                    Back Question
                  </button>

                  {currentQuestionIdx < activeTest.questions.length - 1 ? (
                    <button
                      disabled={selectedAnswers[activeTest.questions[currentQuestionIdx].id] === undefined}
                      onClick={() => setCurrentQuestionIdx(idx => idx + 1)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                    >
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      disabled={Object.keys(selectedAnswers).length < activeTest.questions.length}
                      onClick={handleSubmitTest}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
                    >
                      Grade Exam Paper
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // SUBMITTED RESULTS REVIEW MODE
              <div className="space-y-10">
                {/* Result header banner */}
                <div className={`p-6 rounded-2xl border text-center space-y-4 ${
                  testResult.passed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
                }`}>
                  <span className="text-4xl">{testResult.passed ? '🎉' : '📚'}</span>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-display text-slate-800">
                      {testResult.passed ? 'You passed the Exam!' : 'Keep learning and study on!'}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Required passing score: 80% • Your grade score is: {testResult.score}%
                    </p>
                  </div>
                  <div className="inline-block px-4 py-2 bg-white border border-slate-100 rounded-xl font-extrabold text-slate-800 font-display shadow-xs text-base">
                    Score Card: {testResult.score}/100
                  </div>
                </div>

                {/* Question-by-question critique board */}
                <div className="space-y-6">
                  <h4 className="font-bold font-display text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 text-base">
                    <Info className="h-5 w-5 text-indigo-500" />
                    Critique & Question explanations
                  </h4>

                  <div className="space-y-6">
                    {activeTest.questions.map((q, qIdx) => {
                      const userChoice = selectedAnswers[q.id];
                      const correctChoice = q.correctAnswerIndex;
                      const isCorrect = userChoice === correctChoice;

                      return (
                        <div key={q.id} className="border-b border-slate-50 pb-6 space-y-4">
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1.5">
                              <h5 className="font-bold text-slate-800 text-sm leading-relaxed">
                                {qIdx + 1}. {q.question}
                              </h5>
                              <p className="text-xs text-slate-400">
                                Your response: <span className="font-bold text-slate-600">"{q.options[userChoice]}"</span>
                              </p>
                            </div>
                          </div>

                          {/* Explanatory notes */}
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 text-xs text-slate-600 leading-relaxed font-medium">
                            <span className="font-bold uppercase tracking-wider block mb-1 text-slate-700">Explanation:</span>
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Complete Finish Buttons */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    id="finish-review-btn"
                    onClick={() => {
                      setActiveTest(null);
                      setTestResult(null);
                    }}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Finish Review
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
