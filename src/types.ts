export type Language = 'python' | 'cpp' | 'java';

export type TutorStyle = 'friendly' | 'pirate' | 'strict' | 'sarcastic' | 'zen';

export interface TutorProfile {
  id: TutorStyle;
  name: string;
  title: string;
  avatarEmoji: string;
  avatarBg: string;
  description: string;
  systemPrompt: string;
  greeting: string;
}

export interface Session {
  id: string;
  title: string;
  estimatedTime: string; // e.g., "45s" or "1m"
  slideContent: string[]; // brief slide blocks readable in <= 1 min
  taskDescription: string;
  starterCode: string;
  solutionTemplate: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  sessions: Session[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  type: 'chapter' | 'weekly' | 'monthly' | 'full';
  targetId?: string; // chapterId, or week number, etc.
  questions: TestQuestion[];
}

export interface LanguageProgress {
  completedSessionIds: string[];
  scores: Record<string, number>; // sessionId -> score (0-100)
  testScores: Record<string, number>; // testId -> score (0-100)
  projectGrade?: string; // e.g., 'A+', 'A', etc.
  projectCode?: string;
  certificateId?: string;
  certificateDate?: string;
  nameOnCertificate?: string;
}

export interface ScoreCard {
  languageProgress: Record<Language, LanguageProgress>;
  currentLanguage: Language;
  currentChapterId: string;
  currentSessionId: string;
  tutorStyle: TutorStyle;
  studentName: string;
}

export interface ChatMessage {
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export interface EvaluationResult {
  passed: boolean;
  score: number;
  feedback: string;
  hint?: string;
  correctedCode?: string;
}

export interface ProjectGradingResult {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  comments: string;
  codeReview: string;
  certificateId?: string;
}
