import React from 'react';
import { TUTOR_PROFILES } from '../data';
import { Language, TutorStyle } from '../types';
import { BookOpen, Sparkles, Check, User } from 'lucide-react';

interface TutorConfiguratorProps {
  studentName: string;
  setStudentName: (name: string) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  selectedTutor: TutorStyle;
  setSelectedTutor: (style: TutorStyle) => void;
}

export default function TutorConfigurator({
  studentName,
  setStudentName,
  selectedLanguage,
  setSelectedLanguage,
  selectedTutor,
  setSelectedTutor,
}: TutorConfiguratorProps) {
  const activeTutor = TUTOR_PROFILES.find((t) => t.id === selectedTutor) || TUTOR_PROFILES[0];

  const languages: { id: Language; name: string; icon: string; desc: string; color: string }[] = [
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      desc: 'The world\'s most popular language for AI, data science, and scripting. Clean & close to English.',
      color: 'from-blue-500 to-yellow-500',
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: '⚙️',
      desc: 'A powerhouse of raw speed and memory control. Behind game engines, systems, and hardware.',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'java',
      name: 'Java',
      icon: '☕',
      desc: 'Enterprise-grade, robust, and platform-independent OOP language. Powers billions of systems and Android apps.',
      color: 'from-red-500 to-orange-500',
    },
  ];

  return (
    <div id="tutor-configurator-container" className="space-y-10">
      {/* 1. Student Profile Banner */}
      <div id="profile-card" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-slate-800 flex items-center gap-2">
              <User className="h-6 w-6 text-indigo-600" />
              Who is learning today?
            </h2>
            <p className="text-sm text-slate-500">
              Your name is used to generate your official, verifiable Certificate of Completion at the end.
            </p>
          </div>
          <div className="w-full md:w-80 relative">
            <input
              id="student-name-input"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value || 'Developer')}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 pl-11 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 rounded-xl outline-hidden transition-all duration-200 text-sm font-medium"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 2. Choose Your Programming Track */}
      <div id="language-selection-grid" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-slate-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            Choose Your Academy Track
          </h2>
          <p className="text-sm text-slate-500">
            Select the language you want to study. Progress is tracked independently for each language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                id={`lang-btn-${lang.id}`}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`relative overflow-hidden rounded-2xl p-6 text-left border transition-all duration-300 group ${
                  isSelected
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-600/15 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Gradient banner indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${lang.color}`} />
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl bg-slate-50 p-2 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    {lang.icon}
                  </span>
                  {isSelected && (
                    <span className="bg-indigo-600 text-white rounded-full p-1 shadow-xs">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-display text-slate-800 mb-2">{lang.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{lang.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Choose & Customise Your AI Tutor */}
      <div id="tutor-selection-section" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            Customise Your AI Companion
          </h2>
          <p className="text-sm text-slate-500">
            Choose an AI mentor whose personality matches your style of study. You can switch tutors at any time!
          </p>
        </div>

        {/* Tutor Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TUTOR_PROFILES.map((profile) => {
            const isSelected = selectedTutor === profile.id;
            return (
              <button
                key={profile.id}
                id={`tutor-btn-${profile.id}`}
                onClick={() => setSelectedTutor(profile.id)}
                className={`rounded-xl p-4 text-center border transition-all duration-200 flex flex-col items-center justify-between h-40 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2 flex flex-col items-center">
                  <span className="text-3xl filter drop-shadow-sm">{profile.avatarEmoji}</span>
                  <div>
                    <h3 className="font-bold font-display text-xs text-slate-800">{profile.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{profile.title.split(' ').slice(0, 2).join(' ')}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isSelected ? 'Active Mentor' : 'Select'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Selected Tutor Conversation Bubble */}
        <div id="active-tutor-profile-bubble" className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className={`p-5 rounded-2xl border ${activeTutor.avatarBg} flex items-center justify-center text-5xl shrink-0 select-none shadow-xs`}>
              {activeTutor.avatarEmoji}
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-display text-slate-800">{activeTutor.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {activeTutor.title}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{activeTutor.description}</p>
              </div>

              {/* Chat speech bubble preview */}
              <div className="relative bg-slate-50 border border-slate-200/60 rounded-2xl rounded-tl-none p-5 text-sm text-slate-700 italic shadow-2xs">
                {/* Speech tail */}
                <div className="absolute -left-2 top-0 w-0 h-0 border-t-[12px] border-t-slate-50 border-r-[12px] border-r-transparent" />
                <div className="absolute -left-[9px] top-0 w-0 h-0 border-t-[11px] border-t-slate-200/60 border-r-[11px] border-r-transparent -z-10" />
                
                <p className="leading-relaxed">
                  "{activeTutor.greeting.replace('Alice', studentName)}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
