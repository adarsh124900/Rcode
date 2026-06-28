import React, { useRef } from 'react';
import { Language, TutorStyle } from '../types';
import { TUTOR_PROFILES } from '../data';
import { Award, Printer, Download, Share2 } from 'lucide-react';

interface CertificateOfCompletionProps {
  studentName: string;
  language: Language;
  certificateId: string;
  date: string;
  grade: string;
  tutorStyle: TutorStyle;
}

export default function CertificateOfCompletion({
  studentName,
  language,
  certificateId,
  date,
  grade,
  tutorStyle,
}: CertificateOfCompletionProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const tutor = TUTOR_PROFILES.find((t) => t.id === tutorStyle) || TUTOR_PROFILES[0];

  const handlePrint = () => {
    window.print();
  };

  const getLanguageFullName = (lang: Language) => {
    switch (lang) {
      case 'python': return 'Python Programming Masterclass';
      case 'cpp': return 'C++ Software Engineering Architecture';
      case 'java': return 'Java Enterprise Software Systems';
      default: return 'Computer Science Track';
    }
  };

  return (
    <div id="certificate-showcase-container" className="space-y-8 max-w-4xl mx-auto">
      
      {/* Print Instructions Info Bar */}
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🎓</span>
          <div>
            <h3 className="font-bold font-display text-emerald-900 text-sm">Congratulations, {studentName}!</h3>
            <p className="text-xs text-emerald-700 font-medium">
              You have completed the full program. Here is your official Certificate of Completion!
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            id="print-cert-btn"
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Printer className="h-4 w-4" /> Print Certificate
          </button>
        </div>
      </div>

      {/* RENDER CERTIFICATE CARD */}
      <div 
        ref={certificateRef}
        id="official-certificate-card"
        className="relative bg-[#FCFBF7] border-[14px] border-[#1E293B] rounded-2xl p-8 md:p-14 shadow-xl select-text font-serif text-slate-800 overflow-hidden mx-auto max-w-[800px] aspect-[11/8.5] flex flex-col justify-between print:border-[8px] print:p-8"
      >
        {/* Elegant Ornate Geometric SVG Background */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-amber-600/30 m-3 rounded-md" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-600/5 rounded-tr-full pointer-events-none" />

        {/* Certificate Header Badge */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/10 rounded-full scale-130 animate-pulse" />
              <div className="relative bg-gradient-to-br from-amber-500 to-yellow-600 text-[#FCFBF7] p-3 rounded-full border border-amber-400 shadow-sm">
                <Award className="h-8 w-8 text-slate-900" />
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-xs tracking-widest text-amber-700 font-bold uppercase font-display">
              Verifiable Diploma of Merit
            </h1>
            <p className="text-[10px] uppercase font-sans tracking-widest font-bold text-slate-500">
              1-Minute Coding Academy
            </p>
          </div>
        </div>

        {/* Certificate Recipient Body */}
        <div className="text-center space-y-4 my-6">
          <p className="text-xs italic text-slate-500 font-medium">This document certifies that</p>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1E293B] font-display tracking-tight border-b border-slate-200 pb-2 max-w-lg mx-auto leading-normal">
            {studentName}
          </h2>
          
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            has successfully completed all chapters, practice tasks, examinations, and the Capstone Project in the study of
          </p>

          <h3 className="text-lg md:text-xl font-bold font-display text-amber-700 tracking-tight">
            {getLanguageFullName(language)}
          </h3>

          <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
            Graded with Honors: <span className="text-indigo-600 font-extrabold font-mono text-xs">{grade}</span>
          </p>
        </div>

        {/* Certificate Signatures and Serial Validation */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 border-t border-slate-200/80 pt-6">
          
          {/* Certificate Metadata ID */}
          <div className="text-left font-mono text-[9px] text-slate-400 space-y-0.5">
            <div><span className="font-semibold uppercase tracking-wider text-slate-500">Serial Hash:</span> {certificateId}</div>
            <div><span className="font-semibold uppercase tracking-wider text-slate-500">Issued On:</span> {date}</div>
            <div><span className="font-semibold uppercase tracking-wider text-slate-500">Authorized:</span> Secure AI Protocol</div>
          </div>

          {/* Signature Placeholder */}
          <div className="text-center space-y-2">
            <div className="font-mono text-xs italic text-indigo-600 font-bold tracking-tight">
              {tutor.name}
            </div>
            <div className="w-40 border-t border-slate-300 mx-auto" />
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-sans">
              Academy Mentor Signature
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
