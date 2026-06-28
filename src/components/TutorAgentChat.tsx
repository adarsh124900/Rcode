import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, TutorProfile, Language } from '../types';
import { TUTOR_PROFILES } from '../data';
import { Send, Sparkles, MessageCircle, RefreshCw, AlertCircle, Volume2 } from 'lucide-react';

interface TutorAgentChatProps {
  tutorStyle: string;
  language: Language;
  chapterId: string;
  sessionId: string;
}

export default function TutorAgentChat({
  tutorStyle,
  language,
  chapterId,
  sessionId,
}: TutorAgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTutor = TUTOR_PROFILES.find((t) => t.id === tutorStyle) || TUTOR_PROFILES[0];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Fine-tune tone according to style
      if (tutorStyle === 'pirate') {
        utterance.pitch = 0.8;
        utterance.rate = 0.95;
      } else if (tutorStyle === 'strict') {
        utterance.pitch = 0.95;
        utterance.rate = 1.0;
      } else if (tutorStyle === 'sarcastic') {
        utterance.pitch = 1.05;
        utterance.rate = 1.15;
      } else if (tutorStyle === 'zen') {
        utterance.pitch = 0.9;
        utterance.rate = 0.85;
      } else {
        utterance.pitch = 1.1;
        utterance.rate = 1.05;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser environment.");
    }
  };

  // Refresh greeting when tutor changes
  useEffect(() => {
    setMessages([
      {
        sender: 'tutor',
        text: activeTutor.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [tutorStyle]);

  // Auto scroll to latest chats
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) {
      setInputText('');
    }

    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorStyle,
          language,
          chapterId,
          sessionId,
          message: text,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API timeout or error');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('Tutor Chat Error:', error);
      // Simulated polite response if error
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'tutor',
            text: `[Companion connection notice] I am offline due to a connection limit, but I suggest you verify your variable names, matching braces {}, and syntax. You can ask me another query or reset the slide!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 800);
    } finally {
      setIsTyping(false);
    }
  };

  const handleShortcut = (topic: string) => {
    let promptText = '';
    switch (topic) {
      case 'explain':
        promptText = `Can you explain the main concept of this 1-minute lesson in extremely simple terms?`;
        break;
      case 'hint':
        promptText = `I am stuck on this coding task. Can you give me a friendly hint without writing the entire code for me?`;
        break;
      case 'analogy':
        promptText = `Explain this concept using a creative real-world analogy that matches your personality!`;
        break;
      default:
        promptText = `Help me debug my code.`;
    }
    handleSendMessage(promptText);
  };

  const handleResetChat = () => {
    if (confirm('Clear current tutoring chat history?')) {
      setMessages([
        {
          sender: 'tutor',
          text: activeTutor.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div id="tutor-agent-chat-card" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col h-[520px]">
      
      {/* Active Tutor Status Bar */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/80 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{activeTutor.avatarEmoji}</div>
          <div>
            <h4 className="text-sm font-extrabold font-display text-slate-800 dark:text-slate-200">
              Chatting with {activeTutor.name}
            </h4>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider block">
              Active Customizable Companion
            </span>
          </div>
        </div>
        
        <button
          id="reset-chat-btn"
          onClick={handleResetChat}
          title="Reset chat session"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Chat Messages Scrolling Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 max-w-[85%] ${
                isTutor ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {isTutor ? (
                <span className="text-2xl p-1 bg-slate-100 dark:bg-slate-850 rounded-lg select-none">{activeTutor.avatarEmoji}</span>
              ) : (
                <span className="text-sm p-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-full select-none">👤</span>
              )}

              <div className="space-y-1">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed relative group/msg ${
                    isTutor
                      ? 'bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs'
                  }`}
                >
                  {msg.text}
                  
                  {isTutor && (
                    <button
                      onClick={() => speakText(msg.text)}
                      title="Speak message"
                      className="absolute -right-7 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover/msg:opacity-100 transition-opacity cursor-pointer duration-150 shadow-xs"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <span className={`text-[9px] font-medium text-slate-400 block ${isTutor ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 max-w-[50%] mr-auto pl-10 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-100">●</span>
            <span className="animate-bounce delay-200">●</span>
            <span>{activeTutor.name} is typing...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Study Shortcuts / Assist Chips */}
      <div className="px-6 py-2 bg-slate-50/50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto select-none no-scrollbar py-2 border-b">
        <button
          onClick={() => handleShortcut('explain')}
          className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
        >
          💡 Explain Lesson
        </button>
        <button
          onClick={() => handleShortcut('hint')}
          className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
        >
          ❓ Stuck? Ask hint
        </button>
        <button
          onClick={() => handleShortcut('analogy')}
          className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
        >
          🌾 Give Analogy
        </button>
      </div>

      {/* Chat Typing Input Bar */}
      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/80 flex gap-3 items-center">
        <input
          id="chat-user-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask ${activeTutor.name} a question...`}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-hidden focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
        />
        <button
          id="send-chat-msg-btn"
          onClick={() => handleSendMessage()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 cursor-pointer shadow-xs shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
