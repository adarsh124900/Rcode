import React, { useState, useEffect, useRef } from 'react';
import { CURRICULUM, TUTOR_PROFILES } from './data';
import { Language, TutorStyle, ScoreCard, LanguageProgress } from './types';
import TutorConfigurator from './components/TutorConfigurator';
import CurriculumViewer from './components/CurriculumViewer';
import InteractiveEditor from './components/InteractiveEditor';
import TutorAgentChat from './components/TutorAgentChat';
import DynamicTestCenter from './components/DynamicTestCenter';
import CapstoneProject from './components/CapstoneProject';
import AuthScreen from './components/AuthScreen';
import LeaderboardAndBadges from './components/LeaderboardAndBadges';
import CodingChallenges from './components/CodingChallenges';
import { auth, onAuthStateChanged, signOut } from './firebase';
import { saveUserProfile, getUserProfile } from './dbService';
import { BookOpen, Award, GraduationCap, Settings, Code, Trophy, Sparkles, MessageCircle, User, Medal, Target, LogOut, Cpu, Sun, Moon, AlertCircle, X, Bot, GripVertical, Menu } from 'lucide-react';

const initialProgress = (): LanguageProgress => ({
  completedSessionIds: [],
  scores: {},
  testScores: {},
});

const defaultScoreCard = (): ScoreCard => ({
  languageProgress: {
    python: initialProgress(),
    cpp: initialProgress(),
    java: initialProgress(),
  },
  currentLanguage: 'python',
  currentChapterId: 'py_ch1',
  currentSessionId: 'py_s1',
  tutorStyle: 'friendly',
  studentName: 'Future Developer',
});

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [scoreCard, setScoreCard] = useState<ScoreCard>(defaultScoreCard);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'learn' | 'syllabus' | 'challenges' | 'tests' | 'leaderboard' | 'capstone' | 'tutors'>('learn');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dbOfflineError, setDbOfflineError] = useState<boolean>(false);
  const [showOfflineWarning, setShowOfflineWarning] = useState<boolean>(true);
  const [certAlert, setCertAlert] = useState<string | null>(null);

  // Floating AI Tutor Ball & Chat states
  const [tutorChatOpen, setTutorChatOpen] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: typeof window !== 'undefined' ? window.innerWidth - 90 : 800, y: typeof window !== 'undefined' ? window.innerHeight - 150 : 600 });
  const [chatPosition, setChatPosition] = useState({ x: typeof window !== 'undefined' ? window.innerWidth - 410 : 500, y: typeof window !== 'undefined' ? window.innerHeight - 660 : 200 });
  const [isDraggingBall, setIsDraggingBall] = useState(false);
  const [isDraggingChat, setIsDraggingChat] = useState(false);

  const ballDragStart = useRef({ x: 0, y: 0 });
  const ballStart = useRef({ x: 0, y: 0 });
  const chatDragStart = useRef({ x: 0, y: 0 });
  const chatStart = useRef({ x: 0, y: 0 });
  const ballHasDragged = useRef(false);

  // Auto-resize listener to keep floating coordinates within viewable window safely
  useEffect(() => {
    const handleResize = () => {
      setBallPosition((prev) => {
        const newX = Math.max(10, Math.min(window.innerWidth - 80, prev.x));
        const newY = Math.max(10, Math.min(window.innerHeight - 80, prev.y));
        return { x: newX, y: newY };
      });
      setChatPosition((prev) => {
        const newX = Math.max(10, Math.min(window.innerWidth - 390, prev.x));
        const newY = Math.max(10, Math.min(window.innerHeight - 530, prev.y));
        return { x: newX, y: newY };
      });
    };
    
    // Set initial custom positions based on live size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ball mouse dragging handlers
  const handleBallMouseDown = (e: React.MouseEvent) => {
    setIsDraggingBall(true);
    ballDragStart.current = { x: e.clientX, y: e.clientY };
    ballStart.current = { x: ballPosition.x, y: ballPosition.y };
    ballHasDragged.current = false;
    e.preventDefault();
  };

  const handleBallTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDraggingBall(true);
      ballDragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      ballStart.current = { x: ballPosition.x, y: ballPosition.y };
      ballHasDragged.current = false;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingBall) return;
      const dx = e.clientX - ballDragStart.current.x;
      const dy = e.clientY - ballDragStart.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        ballHasDragged.current = true;
      }
      const newX = Math.max(10, Math.min(window.innerWidth - 80, ballStart.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, ballStart.current.y + dy));
      setBallPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingBall || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - ballDragStart.current.x;
      const dy = e.touches[0].clientY - ballDragStart.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        ballHasDragged.current = true;
      }
      const newX = Math.max(10, Math.min(window.innerWidth - 80, ballStart.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, ballStart.current.y + dy));
      setBallPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDraggingBall(false);
    };

    if (isDraggingBall) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingBall]);

  // Chat panel mouse dragging handlers
  const handleChatHeaderMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle') && !target.closest('button')) {
      setIsDraggingChat(true);
      chatDragStart.current = { x: e.clientX, y: e.clientY };
      chatStart.current = { x: chatPosition.x, y: chatPosition.y };
      e.preventDefault();
    }
  };

  const handleChatHeaderTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle') && !target.closest('button') && e.touches.length === 1) {
      setIsDraggingChat(true);
      chatDragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      chatStart.current = { x: chatPosition.x, y: chatPosition.y };
    }
  };

  useEffect(() => {
    const handleChatMouseMove = (e: MouseEvent) => {
      if (!isDraggingChat) return;
      const dx = e.clientX - chatDragStart.current.x;
      const dy = e.clientY - chatDragStart.current.y;
      const newX = Math.max(10, Math.min(window.innerWidth - 380, chatStart.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 520, chatStart.current.y + dy));
      setChatPosition({ x: newX, y: newY });
    };

    const handleChatTouchMove = (e: TouchEvent) => {
      if (!isDraggingChat || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - chatDragStart.current.x;
      const dy = e.touches[0].clientY - chatDragStart.current.y;
      const newX = Math.max(10, Math.min(window.innerWidth - 380, chatStart.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 520, chatStart.current.y + dy));
      setChatPosition({ x: newX, y: newY });
    };

    const handleChatMouseUp = () => {
      setIsDraggingChat(false);
    };

    if (isDraggingChat) {
      window.addEventListener('mousemove', handleChatMouseMove);
      window.addEventListener('mouseup', handleChatMouseUp);
      window.addEventListener('touchmove', handleChatTouchMove);
      window.addEventListener('touchend', handleChatMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleChatMouseMove);
      window.removeEventListener('mouseup', handleChatMouseUp);
      window.removeEventListener('touchmove', handleChatTouchMove);
      window.removeEventListener('touchend', handleChatMouseUp);
    };
  }, [isDraggingChat]);

  // Listen for custom Firestore connection errors to handle gracefully
  useEffect(() => {
    const handleConnError = () => {
      setDbOfflineError(true);
    };
    window.addEventListener('firestore-connection-error', handleConnError);
    return () => {
      window.removeEventListener('firestore-connection-error', handleConnError);
    };
  }, []);

  // Theme states
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (window.localStorage.getItem('app_theme') as 'light' | 'dark') || 'dark'; // default to dark
  });

  // Sync theme with HTML elements
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        window.localStorage.setItem('user_email_session', user.email || '');
        
        // Fetch saved user data from Firestore
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setScoreCard({
            languageProgress: profile.languageProgress || defaultScoreCard().languageProgress,
            currentLanguage: (profile.currentLanguage || 'python') as Language,
            currentChapterId: profile.currentChapterId || 'py_ch1',
            currentSessionId: profile.currentSessionId || 'py_s1',
            tutorStyle: (profile.tutorStyle || 'friendly') as TutorStyle,
            studentName: profile.studentName || 'Academy Student',
          });
          setCompletedChallenges(profile.completedChallenges || []);
        } else {
          // If profile does not exist yet (first sign-up), write initial document
          const tempName = window.localStorage.getItem('signup_name_temp') || 'Academy Student';
          const newProfile = {
            uid: user.uid,
            email: user.email || '',
            studentName: tempName,
            points: 100, // starting XP for first_step badge
            badges: ['first_step'],
            languageProgress: defaultScoreCard().languageProgress,
            currentLanguage: 'python',
            currentChapterId: 'py_ch1',
            currentSessionId: 'py_s1',
            tutorStyle: 'friendly',
            completedChallenges: []
          };
          await saveUserProfile(user.uid, newProfile);
          setScoreCard({
            ...defaultScoreCard(),
            studentName: tempName
          });
          setCompletedChallenges([]);
        }
      } else {
        setCurrentUser(null);
        window.localStorage.removeItem('user_email_session');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Dynamically calculate Points and Badges
  const calculatePointsAndBadges = () => {
    let points = 100; // Starting base for registration
    const badges: string[] = ['first_step'];

    let pyLessons = 0;
    let cppLessons = 0;
    let javaLessons = 0;

    Object.keys(scoreCard.languageProgress).forEach((lang) => {
      const prog = scoreCard.languageProgress[lang as Language];
      const count = prog?.completedSessionIds?.length || 0;
      points += count * 100; // +100 XP per lesson

      if (lang === 'python') pyLessons = count;
      if (lang === 'cpp') cppLessons = count;
      if (lang === 'java') javaLessons = count;

      // Sprints Master badge
      const totalSess = CURRICULUM[lang as Language].reduce((sum, ch) => sum + ch.sessions.length, 0);
      if (count > 0 && count >= totalSess) {
        badges.push('track_master');
      }
    });

    if (pyLessons >= 3) badges.push('py_exp');
    if (cppLessons >= 3) badges.push('cpp_exp');
    if (javaLessons >= 3) badges.push('java_exp');

    // Quizzes passed
    let perfectScore = false;
    Object.keys(scoreCard.languageProgress).forEach((lang) => {
      const prog = scoreCard.languageProgress[lang as Language];
      const testScores = prog?.testScores || {};
      Object.keys(testScores).forEach((testId) => {
        const score = testScores[testId];
        points += score * 5; // +5 XP per test percent point
        if (score === 100) {
          perfectScore = true;
        }
      });
    });

    if (perfectScore) {
      badges.push('quiz_whiz');
    }

    // Capstone Graduate
    Object.keys(scoreCard.languageProgress).forEach((lang) => {
      const prog = scoreCard.languageProgress[lang as Language];
      if (prog?.projectGrade && prog.projectGrade !== 'F') {
        points += 500; // +500 XP
        badges.push('grad');
      }
    });

    // Interactive Coding Challenges
    completedChallenges.forEach((chalId) => {
      if (chalId.includes('chal1')) points += 150;
      else if (chalId.includes('chal2')) points += 250;
      else if (chalId.includes('chal3')) points += 400;
    });

    if (completedChallenges.length >= 3) {
      badges.push('chal_master');
    }

    const uniqueBadges = Array.from(new Set(badges));
    return { points, badges: uniqueBadges };
  };

  const { points: totalXP, badges: userBadges } = calculatePointsAndBadges();

  // Debounced Sync with Firestore on ScoreCard / Challenges changes
  useEffect(() => {
    if (currentUser && !authLoading) {
      const delayTimer = setTimeout(async () => {
        const { points, badges } = calculatePointsAndBadges();
        await saveUserProfile(currentUser.uid, {
          studentName: scoreCard.studentName,
          currentLanguage: scoreCard.currentLanguage,
          currentChapterId: scoreCard.currentChapterId,
          currentSessionId: scoreCard.currentSessionId,
          tutorStyle: scoreCard.tutorStyle,
          languageProgress: scoreCard.languageProgress,
          completedChallenges: completedChallenges,
          points: points,
          badges: badges
        });
      }, 500);
      return () => clearTimeout(delayTimer);
    }
  }, [scoreCard, completedChallenges, currentUser, authLoading]);

  // Auth callback
  const handleAuthSuccess = async (user: any, name: string) => {
    if (name) {
      window.localStorage.setItem('signup_name_temp', name);
    }
    setCurrentUser(user);
  };

  const handleSignOut = async () => {
    if (confirm('Sign out of your student account?')) {
      await signOut(auth);
      window.localStorage.removeItem('guest_user_session');
      setScoreCard(defaultScoreCard());
      setCompletedChallenges([]);
      setActiveTab('learn');
    }
  };

  // Calculate completed chapters count across all languages (there are 12 chapters total, 4 per language)
  const completedChaptersCount = Object.keys(CURRICULUM).reduce((count, langKey) => {
    const lang = langKey as Language;
    const chapters = CURRICULUM[lang];
    const progress = scoreCard.languageProgress[lang] || initialProgress();
    const chCount = chapters.filter((chapter) => {
      // Check if all sessions in this chapter are completed
      return chapter.sessions.every((session) =>
        progress.completedSessionIds.includes(session.id)
      );
    }).length;
    return count + chCount;
  }, 0);

  // Gate Certification Tab based on progress
  useEffect(() => {
    if (activeTab === 'capstone' && completedChaptersCount < 12) {
      setCertAlert("Complete all 12 chapters to unlock your certification.");
      setActiveTab('learn'); // Automatically redirect to Dashboard (Study Workspace)
    }
  }, [activeTab, completedChaptersCount]);

  const currentLanguage = scoreCard.currentLanguage;
  const currentChapterId = scoreCard.currentChapterId;
  const currentSessionId = scoreCard.currentSessionId;
  const tutorStyle = scoreCard.tutorStyle;
  const studentName = scoreCard.studentName;

  const activeChapters = CURRICULUM[currentLanguage];
  const activeChapter = activeChapters.find((c) => c.id === currentChapterId) || activeChapters[0];
  const activeSession = activeChapter.sessions.find((s) => s.id === currentSessionId) || activeChapter.sessions[0];
  const activeTutor = TUTOR_PROFILES.find((t) => t.id === tutorStyle) || TUTOR_PROFILES[0];
  const activeProgress = scoreCard.languageProgress[currentLanguage] || initialProgress();

  const handleSelectSession = (chapterId: string, sessionId: string) => {
    setScoreCard({
      ...scoreCard,
      currentChapterId: chapterId,
      currentSessionId: sessionId,
    });
    setActiveTab('learn');
  };

  const handleEvaluationSuccess = (score: number) => {
    const currentProg = scoreCard.languageProgress[currentLanguage];
    const updatedCompleted = currentProg.completedSessionIds.includes(currentSessionId)
      ? currentProg.completedSessionIds
      : [...currentProg.completedSessionIds, currentSessionId];

    const updatedScores = {
      ...currentProg.scores,
      [currentSessionId]: Math.max(currentProg.scores[currentSessionId] || 0, score),
    };

    const updatedProg = {
      ...currentProg,
      completedSessionIds: updatedCompleted,
      scores: updatedScores,
    };

    setScoreCard({
      ...scoreCard,
      languageProgress: {
        ...scoreCard.languageProgress,
        [currentLanguage]: updatedProg,
      },
    });
  };

  const handleNextLesson = () => {
    const chapterIdx = activeChapters.findIndex((c) => c.id === currentChapterId);
    const sessionIdx = activeChapter.sessions.findIndex((s) => s.id === currentSessionId);

    if (sessionIdx < activeChapter.sessions.length - 1) {
      const nextSession = activeChapter.sessions[sessionIdx + 1];
      setScoreCard({ ...scoreCard, currentSessionId: nextSession.id });
    } else if (chapterIdx < activeChapters.length - 1) {
      const nextChapter = activeChapters[chapterIdx + 1];
      const nextSession = nextChapter.sessions[0];
      setScoreCard({
        ...scoreCard,
        currentChapterId: nextChapter.id,
        currentSessionId: nextSession.id,
      });
    }
  };

  const handlePreviousLesson = () => {
    const chapterIdx = activeChapters.findIndex((c) => c.id === currentChapterId);
    const sessionIdx = activeChapter.sessions.findIndex((s) => s.id === currentSessionId);

    if (sessionIdx > 0) {
      const prevSession = activeChapter.sessions[sessionIdx - 1];
      setScoreCard({ ...scoreCard, currentSessionId: prevSession.id });
    } else if (chapterIdx > 0) {
      const prevChapter = activeChapters[chapterIdx - 1];
      const prevSession = prevChapter.sessions[prevChapter.sessions.length - 1];
      setScoreCard({
        ...scoreCard,
        currentChapterId: prevChapter.id,
        currentSessionId: prevSession.id,
      });
    }
  };

  const hasPreviousLesson = () => {
    const chapterIdx = activeChapters.findIndex((c) => c.id === currentChapterId);
    const sessionIdx = activeChapter.sessions.findIndex((s) => s.id === currentSessionId);
    return sessionIdx > 0 || chapterIdx > 0;
  };

  const hasNextLesson = () => {
    const chapterIdx = activeChapters.findIndex((c) => c.id === currentChapterId);
    const sessionIdx = activeChapter.sessions.findIndex((s) => s.id === currentSessionId);
    return sessionIdx < activeChapter.sessions.length - 1 || chapterIdx < activeChapters.length - 1;
  };

  const handleSaveTestScore = (testId: string, score: number) => {
    const currentProg = scoreCard.languageProgress[currentLanguage];
    const updatedProg = {
      ...currentProg,
      testScores: {
        ...currentProg.testScores,
        [testId]: Math.max(currentProg.testScores[testId] || 0, score),
      },
    };

    setScoreCard({
      ...scoreCard,
      languageProgress: {
        ...scoreCard.languageProgress,
        [currentLanguage]: updatedProg,
      },
    });
  };

  const handleSaveProjectGrade = (grade: string, code: string, certId: string, certDate: string) => {
    const currentProg = scoreCard.languageProgress[currentLanguage];
    const updatedProg = {
      ...currentProg,
      projectGrade: grade,
      projectCode: code,
      certificateId: certId,
      certificateDate: certDate,
      nameOnCertificate: studentName,
    };

    setScoreCard({
      ...scoreCard,
      languageProgress: {
        ...scoreCard.languageProgress,
        [currentLanguage]: updatedProg,
      },
    });
  };

  const handleChallengeSuccess = (challengeId: string, xpReward: number) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges((prev) => [...prev, challengeId]);
    }
  };

  // Navigations calculation
  const totalSessions = activeChapters.reduce((sum, ch) => sum + ch.sessions.length, 0);
  const isCurriculumComplete = activeProgress.completedSessionIds.length >= totalSessions;
  const completedCount = activeProgress.completedSessionIds.length;
  const progressPercent = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

  const allLanguageSessions = activeChapters.flatMap((ch) => ch.sessions);
  const activeSessionIndex = allLanguageSessions.findIndex((s) => s.id === currentSessionId);
  const sessionNumber = activeSessionIndex !== -1 ? activeSessionIndex + 1 : 1;

  const testScoresList = Object.keys(activeProgress.testScores || {}).map((key) => activeProgress.testScores[key]);
  const passedTestsCount = testScoresList.filter((score) => score >= 80).length;

  if (authLoading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col justify-center items-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
        <p className="text-sm font-semibold text-slate-300">Initializing study portal...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div id="academy-app-root" className="h-screen w-full bg-slate-50 dark:bg-slate-950 flex overflow-hidden font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. LEFT SIDEBAR */}
      <aside id="academy-sidebar" className={`${isSidebarCollapsed ? 'w-0 border-r-0' : 'w-72'} bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none transition-all duration-300 ease-in-out overflow-hidden`}>
        
        {/* Branded Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-extrabold text-white shadow-sm shadow-indigo-500/30">
              R
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">
                R-code
              </h1>
              <span className="text-[10px] text-indigo-400 font-bold font-mono tracking-wider">
                MICRO-LEARNING
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Track selector dropdown */}
        <div className="p-4 shrink-0">
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => {
                const lang = e.target.value as Language;
                const firstChapter = CURRICULUM[lang][0];
                const firstSession = firstChapter.sessions[0];
                setScoreCard({
                  ...scoreCard,
                  currentLanguage: lang,
                  currentChapterId: firstChapter.id,
                  currentSessionId: firstSession.id,
                });
              }}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-lg pl-4 pr-10 py-2.5 text-xs font-bold text-white focus:outline-hidden appearance-none cursor-pointer transition-colors hover:border-slate-600"
            >
              <option value="python">🐍 Python Core Track</option>
              <option value="cpp">⚙️ C++ Systems Track</option>
              <option value="java">☕ Java Enterprise Track</option>
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none flex items-center text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.273 0.263-0.713 0.263-0.986 0l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Chapter Syllabus Navigation Title */}
        <div className="px-6 mb-2 mt-2 shrink-0">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold block">
            Syllabus Chapters
          </label>
        </div>
        
        {/* Course navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1 py-1 px-2 no-scrollbar">
          {activeChapters.map((ch, idx) => {
            const isCurrentChapter = ch.id === currentChapterId;
            const chapterNum = String(idx + 1).padStart(2, '0');
            
            const chSessions = ch.sessions;
            const chCompleted = chSessions.filter(s => activeProgress.completedSessionIds.includes(s.id)).length;
            const isChComplete = chCompleted === chSessions.length;
            
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectSession(ch.id, ch.sessions[0].id)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg text-xs font-bold leading-normal transition-all cursor-pointer ${
                  isCurrentChapter
                    ? 'bg-slate-800 text-white border-l-4 border-indigo-500 pl-3'
                    : isChComplete
                      ? 'text-emerald-400 hover:bg-slate-800/40 hover:text-emerald-300'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 ${
                  isCurrentChapter 
                    ? 'bg-indigo-500/20 text-indigo-400 font-extrabold' 
                    : isChComplete
                      ? 'bg-emerald-500/15 text-emerald-400 font-extrabold'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {isChComplete && !isCurrentChapter ? '✓' : chapterNum}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold">{ch.title.split(': ')[1] || ch.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-medium truncate">
                    {chCompleted}/{chSessions.length} sessions done
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Assessments */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 shrink-0">
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold text-white">Quizzes Passed</span>
              <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold">
                {passedTestsCount}/5 Passed
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mb-3 font-medium">
              Complete chapter exercises to unlock testing sprints.
            </p>
            <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${(passedTestsCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Tutor Status */}
        <button
          onClick={() => setActiveTab('tutors')}
          className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950/50 hover:bg-slate-800/30 transition-colors text-left cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-lg shadow-inner shrink-0">
            {activeTutor.avatarEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white truncate">{activeTutor.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-semibold truncate font-mono uppercase tracking-wider mt-0.5">
              Active Study Mentor
            </p>
          </div>
        </button>

      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        
        {/* TOP COCKPIT HEADER */}
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0 select-none">
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer mr-1 shrink-0"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex flex-col">
              <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-extrabold uppercase tracking-widest font-mono leading-none mb-1">
                Active Session
              </span>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {activeSession.title}
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-sm">
                  Session {sessionNumber} of {totalSessions}
                </span>
              </h2>
            </div>

            <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800" />

            <div className="hidden md:block">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest font-mono block">
                Track Progression
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <div className="w-28 bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 relative overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest font-mono block">
                Gamified Reward
              </span>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1 justify-end">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                {totalXP.toLocaleString()} XP
              </span>
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />

            {/* Profile actions & Sign Out */}
            <div className="flex items-center gap-3.5">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
              </button>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate max-w-[120px]">{studentName}</span>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-900 transition-colors cursor-pointer dark:hover:bg-slate-900"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

        </header>

        {/* CORE WORKSPACE TAB NAVIGATION LINKS */}
        <nav id="app-nav-tabs" className="bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-8 shrink-0 select-none">
          <div className="flex space-x-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'learn', name: 'Study Workspace', icon: Code },
              { id: 'syllabus', name: 'Syllabus Map', icon: BookOpen },
              { id: 'challenges', name: 'Coding Sprints', icon: Cpu },
              { id: 'tests', name: 'Tests & Quizzes', icon: Trophy },
              { id: 'leaderboard', name: 'Leaderboard & Badges', icon: Medal },
              { id: 'capstone', name: 'Capstone & Diploma', icon: Award },
              { id: 'tutors', name: 'AI Tutors Profile', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.name}
                </button>
              );
            })}
          </div>
          
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 font-mono font-bold">
            {dbOfflineError ? (
              <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400" title="Firestore is offline or unprovisioned. Local cache fallback is active.">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>OFFLINE BACKUP ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>CLOUD CONNECTED</span>
              </div>
            )}
          </div>
        </nav>

        {/* CORE SCENARIO VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">

            {/* Firestore Database Connection Warning Banner */}
            {dbOfflineError && showOfflineWarning && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl relative flex items-start gap-3.5 shadow-sm animate-fade-in">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    Firestore Database Connection Issue Detected
                  </h3>
                  <p className="text-xs text-amber-700/90 dark:text-amber-400/90 mt-1 leading-relaxed">
                    We could not establish a connection to Firestore under your custom Firebase project (<code className="px-1 py-0.5 bg-amber-100/60 dark:bg-amber-950/40 rounded font-mono text-[11px] font-bold">studio-9369216500-9932e</code>). This is typically because the Firestore Database service has not been initialized yet in your new Firebase Console.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] text-amber-800 dark:text-amber-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-amber-500" />
                      <strong>How to Fix:</strong> Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline hover:text-amber-950 dark:hover:text-amber-200">Firebase Console</a>, select your project, click <em>Firestore Database</em>, and click <strong>Create Database</strong>.
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-amber-500" />
                      <strong>Offline Engine Active:</strong> No action needed to test! Your study progress, XP, and badges are being safely saved in your browser cache.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowOfflineWarning(false)}
                  className="p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/40 text-amber-500 hover:text-amber-800 dark:text-amber-400 transition-colors cursor-pointer"
                  title="Dismiss warning"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Certification Gate Notification Message */}
            {certAlert && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl relative flex items-center justify-between gap-3.5 shadow-sm animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-rose-800 dark:text-rose-300">
                      Access Denied
                    </h3>
                    <p className="text-xs text-rose-700/90 dark:text-rose-400/90 mt-0.5 font-medium">
                      {certAlert}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCertAlert(null)}
                  className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-800 dark:text-rose-400 transition-colors cursor-pointer"
                  title="Dismiss warning"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Breadcrumb Navigation & Overall Progress Tracker */}
            <div id="curriculum-breadcrumb-tracker" className="mb-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  {currentLanguage === 'python' ? 'Python Academy' : currentLanguage === 'cpp' ? 'C++ Academy' : 'Java Academy'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {activeChapter.title.includes(':') ? activeChapter.title.split(':')[1]?.trim() : activeChapter.title}
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md font-bold text-[11px] border border-indigo-100/60 dark:border-indigo-900/40">
                  {activeSession.title}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Curriculum Completion:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">
                      {completedChaptersCount} / 12 chapters
                    </strong>
                  </div>
                  <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${(completedChaptersCount / 12) * 100}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveTab('syllabus')}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  View Syllabus Map
                </button>
              </div>
            </div>
            
            {/* TAB 1: LEARN STUDY WORKSPACE */}
            {activeTab === 'learn' && (
              <div id="learn-practice-workspace-section" className="w-full relative">
                <InteractiveEditor
                  session={activeSession}
                  tutorStyle={tutorStyle}
                  onEvaluationSuccess={handleEvaluationSuccess}
                  onNextLesson={handleNextLesson}
                  hasPreviousLesson={hasPreviousLesson()}
                  onPreviousLesson={handlePreviousLesson}
                  hasNextLesson={hasNextLesson()}
                />

                {/* AI TUTOR ROLLING ORB (BALL) - Draggable and sleek */}
                <div
                  id="ai-tutor-floating-ball"
                  style={{
                    left: `${ballPosition.x}px`,
                    top: `${ballPosition.y}px`,
                    transform: isDraggingBall ? 'scale(1.1) rotate(15deg)' : 'scale(1)',
                  }}
                  onMouseDown={handleBallMouseDown}
                  onTouchStart={handleBallTouchStart}
                  onClick={() => {
                    if (!ballHasDragged.current) {
                      setTutorChatOpen(!tutorChatOpen);
                    }
                  }}
                  className={`fixed z-50 w-16 h-16 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-transform shadow-[0_10px_35px_rgba(99,102,241,0.25)] border-2 border-indigo-500 bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md group hover:border-indigo-400 active:scale-95`}
                  title={`Click to chat with ${activeTutor.name}! Drag to roll around.`}
                >
                  {/* Pulsing Aura Rings */}
                  <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping group-hover:bg-indigo-500/30 duration-1000" />
                  <span className="absolute -inset-1 rounded-full border border-indigo-500/30 opacity-75 group-hover:scale-105 transition-all" />
                  
                  <div className="relative flex flex-col items-center justify-center">
                    <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(99,102,241,0.5)] animate-bounce duration-1000">
                      {activeTutor.avatarEmoji}
                    </span>
                    {/* Micro status indicator */}
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </span>
                  </div>

                  {/* Mini tooltip */}
                  <div className="absolute right-full mr-3 bg-slate-950/95 border border-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-nowrap">
                    💬 Talk to {activeTutor.name} (Drag me!)
                  </div>
                </div>

                {/* FLOATING DRAGGABLE CHAT WINDOW */}
                {tutorChatOpen && (
                  <div
                    id="floating-tutor-chat-window"
                    style={{
                      left: `${chatPosition.x}px`,
                      top: `${chatPosition.y}px`,
                    }}
                    onMouseDown={handleChatHeaderMouseDown}
                    onTouchStart={handleChatHeaderTouchStart}
                    className="fixed z-50 w-[380px] max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_15px_50px_rgba(0,0,0,0.3)] flex flex-col h-[520px] overflow-hidden animate-fade-in"
                  >
                    <TutorAgentChat
                      tutorStyle={tutorStyle}
                      language={currentLanguage}
                      chapterId={currentChapterId}
                      sessionId={currentSessionId}
                      isFloating={true}
                      onClose={() => setTutorChatOpen(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: COURSE SYLLABUS MAP */}
            {activeTab === 'syllabus' && (
              <div id="syllabus-syllabus-section">
                <CurriculumViewer
                  chapters={activeChapters}
                  progress={activeProgress}
                  currentChapterId={currentChapterId}
                  currentSessionId={currentSessionId}
                  onSelectSession={handleSelectSession}
                />
              </div>
            )}

            {/* TAB 3: INTERACTIVE CODING CHALLENGES */}
            {activeTab === 'challenges' && (
              <div id="interactive-challenges-section">
                <CodingChallenges
                  language={currentLanguage}
                  tutorStyle={tutorStyle}
                  completedChallengeIds={completedChallenges}
                  onChallengeSuccess={handleChallengeSuccess}
                />
              </div>
            )}

            {/* TAB 4: ASSESSMENT TESTS CENTER */}
            {activeTab === 'tests' && (
              <div id="assessment-tests-section">
                <DynamicTestCenter
                  language={currentLanguage}
                  onSaveScore={handleSaveTestScore}
                  completedTests={activeProgress.testScores}
                />
              </div>
            )}

            {/* TAB 5: LEADERBOARD & BADGES */}
            {activeTab === 'leaderboard' && (
              <div id="leaderboard-hall-section">
                <LeaderboardAndBadges
                  currentUserId={currentUser.uid}
                  userPoints={totalXP}
                  userBadges={userBadges}
                  studentName={studentName}
                />
              </div>
            )}

            {/* TAB 6: CAPSTONE FINAL PROJECT & DIPLOMA */}
            {activeTab === 'capstone' && (
              <div id="capstone-diploma-section">
                <CapstoneProject
                  language={currentLanguage}
                  studentName={studentName}
                  tutorStyle={tutorStyle}
                  isCurriculumComplete={isCurriculumComplete}
                  onSaveProjectGrade={handleSaveProjectGrade}
                  savedProjectGrade={activeProgress.projectGrade}
                  savedProjectCode={activeProgress.projectCode}
                  savedCertificateId={activeProgress.certificateId}
                  savedCertificateDate={activeProgress.certificateDate}
                />
              </div>
            )}

            {/* TAB 7: AI TUTORS & PROFILE CONFIGURATION */}
            {activeTab === 'tutors' && (
              <div id="custom-tutors-profile-section">
                <TutorConfigurator
                  studentName={studentName}
                  setStudentName={(name) => {
                    setScoreCard({ ...scoreCard, studentName: name });
                  }}
                  selectedLanguage={currentLanguage}
                  setSelectedLanguage={(lang) => {
                    const firstChapter = CURRICULUM[lang][0];
                    const firstSession = firstChapter.sessions[0];
                    setScoreCard({
                      ...scoreCard,
                      currentLanguage: lang,
                      currentChapterId: firstChapter.id,
                      currentSessionId: firstSession.id,
                    });
                  }}
                  selectedTutor={tutorStyle}
                  setSelectedTutor={(style) => {
                    setScoreCard({ ...scoreCard, tutorStyle: style });
                  }}
                />
              </div>
            )}

          </div>
        </main>

      </div>

    </div>
  );
}
