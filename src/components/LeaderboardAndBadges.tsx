import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../dbService';
import { Award, Trophy, Medal, Shield, Sparkles, CheckCircle, Flame, Star, Crown } from 'lucide-react';

interface LeaderboardAndBadgesProps {
  currentUserId: string;
  userPoints: number;
  userBadges: string[];
  studentName: string;
}

interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  xp: number;
}

const BADGES: BadgeDef[] = [
  { id: 'first_step', name: 'First Step', desc: 'Sign up and initialize your micro-learning academy profile.', icon: '🎓', color: 'from-blue-500 to-indigo-500', xp: 100 },
  { id: 'py_exp', name: 'Python Explorer', desc: 'Complete all Python basic foundation sessions.', icon: '🐍', color: 'from-amber-400 to-yellow-600', xp: 300 },
  { id: 'cpp_exp', name: 'C++ Explorer', desc: 'Complete C++ basic foundation lessons.', icon: '⚙️', color: 'from-purple-500 to-indigo-500', xp: 300 },
  { id: 'java_exp', name: 'Java Explorer', desc: 'Complete Java basic foundation lessons.', icon: '☕', color: 'from-red-500 to-orange-500', xp: 300 },
  { id: 'quiz_whiz', name: 'Quiz Whiz', desc: 'Achieve 100% accuracy on any dynamic test center quiz.', icon: '🧠', color: 'from-emerald-400 to-emerald-600', xp: 500 },
  { id: 'chal_master', name: 'Challenge Hero', desc: 'Complete at least 3 custom language coding challenges.', icon: '⚡', color: 'from-cyan-400 to-blue-600', xp: 500 },
  { id: 'track_master', name: 'Sprints Master', desc: 'Complete all sessions across a language syllabus.', icon: '🏆', color: 'from-pink-500 to-rose-500', xp: 600 },
  { id: 'grad', name: 'Verifiable Graduate', desc: 'Successfully grade your capstone project.', icon: '🌟', color: 'from-yellow-400 to-amber-500', xp: 1000 }
];

export default function LeaderboardAndBadges({
  currentUserId,
  userPoints,
  userBadges = [],
  studentName
}: LeaderboardAndBadgesProps) {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const data = await getLeaderboard();
    
    // Inject the current user into the leaderboard if they aren't there yet,
    // or update their record dynamically so the board reflects their live score!
    let foundCurrentUser = false;
    const updated = data.map((u) => {
      if (u.id === currentUserId || (u.email && authEmailMatches(u.email))) {
        foundCurrentUser = true;
        return {
          ...u,
          studentName: studentName || 'You',
          points: userPoints,
          badges: userBadges
        };
      }
      return u;
    });

    if (!foundCurrentUser && currentUserId) {
      updated.push({
        id: currentUserId,
        studentName: studentName || 'You',
        points: userPoints,
        badges: userBadges,
        email: ''
      });
    }

    // Sort by points desc
    updated.sort((a, b) => b.points - a.points);
    setLeaderboardData(updated);
    setLoading(false);
  };

  const authEmailMatches = (email: string) => {
    const currentUserEmail = window.localStorage.getItem('user_email_session');
    return currentUserEmail && email === currentUserEmail;
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [userPoints, userBadges, studentName]);

  return (
    <div id="leaderboard-badges-workspace" className="space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 rounded-2xl p-6 border border-slate-800 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-xl font-extrabold flex items-center justify-center md:justify-start gap-2">
            <Crown className="h-5 w-5 text-amber-400 animate-bounce" />
            Academy Hall of Fame
          </h2>
          <p className="text-xs text-slate-300">
            Sprint ahead of your classmate companions. Earn points by finishing curriculum lessons, testing sprints, and interactive challenges.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-slate-900/50 px-5 py-3 rounded-xl border border-slate-850">
          <div className="text-center md:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">My Standing</span>
            <span className="text-xl font-black text-indigo-400 block font-mono">
              {userPoints.toLocaleString()} XP
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">Badges</span>
            <span className="text-xl font-black text-emerald-400 block font-mono">
              {userBadges.length} / {BADGES.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: LEADERBOARD BOARD (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Trophy className="h-4.5 w-4.5 text-indigo-500" />
                Live Standings
              </h3>
              <button 
                onClick={fetchLeaderboard}
                className="text-[10px] uppercase font-mono font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Refresh Board
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                <p className="text-xs text-slate-400 font-medium">Syncing standings...</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {leaderboardData.slice(0, 10).map((u, index) => {
                  const isUser = u.id === currentUserId || (u.email && authEmailMatches(u.email));
                  const rank = index + 1;
                  
                  let rankColor = 'bg-slate-100 text-slate-600';
                  let crownColor = '';
                  if (rank === 1) {
                    rankColor = 'bg-amber-500 text-white font-extrabold';
                    crownColor = 'text-amber-500';
                  } else if (rank === 2) {
                    rankColor = 'bg-slate-300 text-slate-800 font-extrabold';
                    crownColor = 'text-slate-400';
                  } else if (rank === 3) {
                    rankColor = 'bg-amber-700 text-amber-50 font-extrabold';
                    crownColor = 'text-amber-700';
                  }

                  return (
                    <div
                      key={u.id || index}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isUser
                          ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Rank Badge */}
                        <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs ${rankColor} shrink-0`}>
                          {rank}
                        </div>

                        {/* Name & Title */}
                        <div className="min-w-0">
                          <p className={`text-xs font-extrabold truncate flex items-center gap-1.5 ${isUser ? 'text-indigo-950 font-black' : 'text-slate-800'}`}>
                            {u.studentName || 'Academy Student'}
                            {isUser && <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white uppercase tracking-wider">You</span>}
                            {rank <= 3 && <Star className={`h-3 w-3 fill-current ${crownColor}`} />}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(u.badges || []).slice(0, 3).map((b: string, bIdx: number) => {
                              const badgeDef = BADGES.find(x => x.id === b || x.name === b);
                              return (
                                <span 
                                  key={bIdx}
                                  className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 font-medium truncate"
                                  title={badgeDef?.desc || b}
                                >
                                  {badgeDef?.icon || '🏆'} {badgeDef?.name || b}
                                </span>
                              );
                            })}
                            {(u.badges || []).length > 3 && (
                              <span className="text-[9px] px-1 py-0.5 rounded-md bg-slate-50 text-slate-400 font-semibold border border-slate-100 shrink-0">
                                +{(u.badges || []).length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Points / XP */}
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-mono font-extrabold ${isUser ? 'text-indigo-600' : 'text-slate-700'}`}>
                          {(u.points || 0).toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold font-mono ml-0.5 uppercase tracking-wider">XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MILESTONE BADGES BOARD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Medal className="h-4.5 w-4.5 text-emerald-500" />
              Verifiable Milestones ({userBadges.length}/{BADGES.length})
            </h3>

            <div className="space-y-3.5">
              {BADGES.map((badge) => {
                const isUnlocked = userBadges.includes(badge.id) || userBadges.includes(badge.name);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-emerald-50/20 border-emerald-100'
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    {/* Badge Icon Shield */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center text-lg shadow-sm shrink-0 relative`}>
                      {badge.icon}
                      {isUnlocked && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center border-2 border-white text-[8px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className={`text-xs font-extrabold ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                          {badge.name}
                        </h4>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${isUnlocked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-400'}`}>
                          +{badge.xp} XP
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
