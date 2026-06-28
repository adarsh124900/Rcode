import React from 'react';
import { Chapter, Session, LanguageProgress } from '../types';
import { CheckCircle2, Circle, Lock, PlayCircle, Trophy, BookOpen } from 'lucide-react';

interface CurriculumViewerProps {
  chapters: Chapter[];
  progress: LanguageProgress;
  currentChapterId: string;
  currentSessionId: string;
  onSelectSession: (chapterId: string, sessionId: string) => void;
}

export default function CurriculumViewer({
  chapters,
  progress,
  currentChapterId,
  currentSessionId,
  onSelectSession,
}: CurriculumViewerProps) {
  
  // Total sessions and completed calculation
  const totalSessions = chapters.reduce((sum, ch) => sum + ch.sessions.length, 0);
  const completedCount = progress.completedSessionIds.length;
  const progressPercent = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

  // Find average score for completed sessions
  const scoreValues = Object.values(progress.scores);
  const averageScore = scoreValues.length > 0 
    ? Math.round(scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length) 
    : 0;

  return (
    <div id="curriculum-viewer-container" className="space-y-6">
      {/* Dynamic Score Card & Learning Progress Bar */}
      <div id="overall-progress-card" className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Progress Circle & Text */}
          <div className="space-y-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
              Academy Progress
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-slate-800">{progressPercent}%</span>
              <span className="text-sm text-slate-400 font-medium">completed</span>
            </div>
            <p className="text-xs text-slate-500">
              {completedCount} of {totalSessions} 1-minute lessons completed
            </p>
          </div>

          {/* Progress Bar Display */}
          <div className="md:col-span-1 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Learning Bar</span>
              <span>{completedCount}/{totalSessions} Sessions</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Average Score Badge */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="bg-amber-500 text-white rounded-xl p-3 shadow-xs">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Practice Score</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-display text-slate-800">{averageScore || 0}</span>
                <span className="text-xs text-slate-400 font-bold">/100</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Chapter Map */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          Interactive Course Syllabus
        </h3>
        
        <div id="syllabus-timeline" className="space-y-6">
          {chapters.map((chapter, chIdx) => {
            // Check if previous chapter is fully completed to enforce sequential learning (optional, but let's allow jumping around with a warning, or fully unlock for perfect UX while showing order)
            const chapterSessions = chapter.sessions;
            const completedInChapter = chapterSessions.filter(s => progress.completedSessionIds.includes(s.id)).length;
            const isChapterActive = chapter.id === currentChapterId;

            return (
              <div 
                key={chapter.id} 
                id={`chapter-card-${chapter.id}`}
                className={`bg-white rounded-2xl border transition-all duration-300 ${
                  isChapterActive 
                    ? 'border-indigo-200 ring-2 ring-indigo-600/5 shadow-xs' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Chapter Header Banner */}
                <div className="px-6 py-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {chapter.id.includes('ch1') ? 'Foundations' : chapter.id.includes('ch2') ? 'Control Flow' : chapter.id.includes('ch3') ? 'Data Structures' : 'Core OOP'}
                    </span>
                    <h4 className="font-bold font-display text-slate-800">{chapter.title}</h4>
                    <p className="text-xs text-slate-500">{chapter.description}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                      {completedInChapter}/{chapterSessions.length}
                    </span>
                  </div>
                </div>

                {/* Session List */}
                <div className="divide-y divide-slate-50">
                  {chapterSessions.map((session) => {
                    const isCompleted = progress.completedSessionIds.includes(session.id);
                    const isSessionActive = session.id === currentSessionId;
                    const sessionScore = progress.scores[session.id];

                    return (
                      <button
                        key={session.id}
                        id={`session-row-${session.id}`}
                        onClick={() => onSelectSession(chapter.id, session.id)}
                        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-200 hover:bg-slate-50/50 group ${
                          isSessionActive ? 'bg-indigo-50/20' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {isCompleted ? (
                            <span className="text-emerald-500 bg-emerald-50 p-1.5 rounded-full border border-emerald-100 group-hover:scale-110 transition-transform">
                              <CheckCircle2 className="h-5 w-5" />
                            </span>
                          ) : isSessionActive ? (
                            <span className="text-indigo-600 bg-indigo-50 p-1.5 rounded-full border border-indigo-100 animate-pulse">
                              <PlayCircle className="h-5 w-5" />
                            </span>
                          ) : (
                            <span className="text-slate-400 bg-slate-50 p-1.5 rounded-full border border-slate-100 group-hover:text-indigo-500 transition-colors">
                              <Circle className="h-5 w-5" />
                            </span>
                          )}

                          <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                              Lesson • {session.estimatedTime}
                            </span>
                            <h5 className={`text-sm font-bold transition-colors ${
                              isSessionActive ? 'text-indigo-600' : 'text-slate-800'
                            }`}>
                              {session.title}
                            </h5>
                          </div>
                        </div>

                        {/* Right side Score / Start indicator */}
                        <div className="flex items-center gap-3">
                          {sessionScore !== undefined ? (
                            <div className="text-right">
                              <span className="text-[10px] font-semibold text-slate-400 block">Best Score</span>
                              <span className={`text-xs font-extrabold ${
                                sessionScore >= 90 ? 'text-emerald-600' : sessionScore >= 75 ? 'text-indigo-600' : 'text-amber-600'
                              }`}>
                                {sessionScore}/100
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                              {isSessionActive ? 'Active' : 'Start'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
