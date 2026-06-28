import React, { useState, useEffect } from 'react';
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
import { BookOpen, Award, GraduationCap, Settings, Code, Trophy, Sparkles, MessageCircle, User, Medal, Target, LogOut, Cpu, Sun, Moon } from 'lucide-react';

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
        const localGuest = window.localStorage.getItem('guest_user_session');
        if (localGuest) {
          try {
            const guestUser = JSON.parse(localGuest);
            setCurrentUser(guestUser);
            const profile = await getUserProfile(guestUser.uid);
            if (profile) {
              setScoreCard({
                languageProgress: profile.languageProgress || defaultScoreCard().languageProgress,
                currentLanguage: (profile.currentLanguage || 'python') as Language,
                currentChapterId: profile.currentChapterId || 'py_ch1',
                currentSessionId: profile.currentSessionId || 'py_s1',
                tutorStyle: (profile.tutorStyle || 'friendly') as TutorStyle,
                studentName: profile.studentName || 'Guest Student',
              });
              setCompletedChallenges(profile.completedChallenges || []);
            } else {
              const tempName = window.localStorage.getItem('signup_name_temp') || 'Guest Student';
              const newProfile = {
                uid: guestUser.uid,
                email: guestUser.email || '',
                studentName: tempName,
                points: 100,
                badges: ['first_step'],
                languageProgress: defaultScoreCard().languageProgress,
                currentLanguage: 'python',
                currentChapterId: 'py_ch1',
                currentSessionId: 'py_s1',
                tutorStyle: 'friendly',
                completedChallenges: []
              };
              await saveUserProfile(guestUser.uid, newProfile);
              setScoreCard({
                ...defaultScoreCard(),
                studentName: tempName
              });
              setCompletedChallenges([]);
            }
          } catch (e) {
            console.error('Error reloading guest session:', e);
            setCurrentUser(null);
            window.localStorage.removeItem('user_email_session');
          }
        } else {
          setCurrentUser(null);
          window.localStorage.removeItem('user_email_session');
        }
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

    if (user && user.uid.startsWith('guest_')) {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setScoreCard({
          languageProgress: profile.languageProgress || defaultScoreCard().languageProgress,
          currentLanguage: (profile.currentLanguage || 'python') as Language,
          currentChapterId: profile.currentChapterId || 'py_ch1',
          currentSessionId: profile.currentSessionId || 'py_s1',
          tutorStyle: (profile.tutorStyle || 'friendly') as TutorStyle,
          studentName: profile.studentName || 'Guest Student',
        });
        setCompletedChallenges(profile.completedChallenges || []);
      } else {
        const tempName = name || 'Guest Student';
        const newProfile = {
          uid: user.uid,
          email: user.email || '',
          studentName: tempName,
          points: 100,
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
    }
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
      <aside id="academy-sidebar" className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
        
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CLOUD CONNECTED</span>
          </div>
        </nav>

        {/* CORE SCENARIO VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            
            {/* TAB 1: LEARN STUDY WORKSPACE */}
            {activeTab === 'learn' && (
              <div id="learn-practice-workspace-section" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-8">
                  <InteractiveEditor
                    session={activeSession}
                    tutorStyle={tutorStyle}
                    onEvaluationSuccess={handleEvaluationSuccess}
                    onNextLesson={handleNextLesson}
                    hasPreviousLesson={hasPreviousLesson()}
                    onPreviousLesson={handlePreviousLesson}
                    hasNextLesson={hasNextLesson()}
                  />
                </div>
                <div className="xl:col-span-4 sticky top-4">
                  <TutorAgentChat
                    tutorStyle={tutorStyle}
                    language={currentLanguage}
                    chapterId={currentChapterId}
                    sessionId={currentSessionId}
                  />
                </div>
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
