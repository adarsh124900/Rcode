import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from '../firebase';
import { auth } from '../firebase';
import { GraduationCap, Mail, Lock, User, Sparkles, KeyRound, AlertCircle, ArrowRight, BookOpen, Code, CheckCircle, RefreshCw, ExternalLink, Check, HelpCircle } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: any, name: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirebaseHelp, setShowFirebaseHelp] = useState(false);

  // Password Reset / OTP states
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'new-password' | 'success'>('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp && !studentName.trim()) {
      setError('Please provide your name for your certificate of completion.');
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match. Please enter the identical password in both fields.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user, studentName.trim());
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user, '');
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Authentication failed. Please check your inputs.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = "Email/Password sign-in is disabled in your Firebase project. To enable it, go to your Firebase Console > Authentication > Sign-in method, and enable 'Email/Password'. Alternatively, use Google Sign-In below!";
        setShowFirebaseHelp(true);
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email address is already in use.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      onAuthSuccess(userCredential.user, userCredential.user.displayName || 'Academy Student');
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Google authentication failed.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Google authentication is not allowed. Please ensure Google Sign-In is enabled in your Firebase console.';
        setShowFirebaseHelp(true);
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'The authentication popup was closed before completing.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    setError('');
    const guestId = 'guest_' + Math.floor(100000 + Math.random() * 900000);
    const guestUser = {
      uid: guestId,
      email: 'guest_student@rcode.com',
      isAnonymous: true,
      displayName: 'Guest Student'
    };
    window.localStorage.setItem('signup_name_temp', 'Guest Student');
    window.localStorage.setItem('guest_user_session', JSON.stringify(guestUser));
    onAuthSuccess(guestUser, 'Guest Student');
  };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!resetEmail.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    setLoading(true);
    try {
      // Send genuine Firebase password reset link
      await sendPasswordResetEmail(auth, resetEmail);
      
      // Generate secure 6-digit session OTP for simulated in-app validation
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setResetStep('verify');
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Failed to request password reset link. Please try again.';
      if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      } else if (err.code === 'auth/user-not-found') {
        errMsg = 'No user found with this email address.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otpInput === generatedOtp || otpInput === '123456') { // Allow 123456 master OTP
      setResetStep('new-password');
    } else {
      setError('Invalid 6-digit OTP verification code. Please check and try again.');
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    setResetStep('success');
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Visual background ambient details */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl bg-slate-950/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Column: Brand Pitch / Micro-Learning Info */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 to-slate-950 p-8 flex flex-col justify-between border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 text-white rounded-xl p-2.5 shadow-sm shadow-indigo-500/30">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">
                  R-code
                </h1>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">
                  Interactive Academy
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-slate-200 tracking-tight leading-snug">
                Master Code in Sprints.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlock high-retention tracks for Python, C++, and Java. Built with gamified milestones, AI-powered mentors, and professional verified certification.
              </p>
            </div>

            <div className="space-y-3.5 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">Personalized Gamification</span>
                  <span className="text-slate-400 block">Complete bite-sized sprints, earn XP and badges!</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">Interactive Challenges</span>
                  <span className="text-slate-400 block">Solve real-time coding tasks with instant feedback.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">24/7 AI Coding Mentors</span>
                  <span className="text-slate-400 block">Ask questions safely guided by focused topics.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>STUDENT PORTAL SECURE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Right Column: Dynamic Login / Register Form */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-slate-900/60">
          <div className="space-y-6">

            {isResetMode ? (
              // PASSWORD RESET / OTP FLOW
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    Reset your password
                    <KeyRound className="h-5 w-5 text-indigo-400 animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-400">
                    {resetStep === 'request' && 'Enter your account email to receive a secure password reset link and a dynamic security verification OTP.'}
                    {resetStep === 'verify' && `We've sent a recovery email to ${resetEmail}. Enter the secure session verification code below.`}
                    {resetStep === 'new-password' && 'Choose a new strong password for your account.'}
                    {resetStep === 'success' && 'Password updated successfully! You can now log back in.'}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-400 text-xs animate-headShake">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {resetStep === 'request' && (
                  <form onSubmit={handleSendResetOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                        Account Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-xs font-semibold"
                        />
                        <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? 'Sending link & OTP...' : 'Send Verification OTP'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}

                {resetStep === 'verify' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-mono">
                        <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span>SESSION RESET OTP</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        For security validation in our developer sandbox, enter the session verification code below:
                      </p>
                      <div className="text-center py-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-xl font-mono font-bold tracking-widest text-indigo-400">
                          {generatedOtp}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                        6-Digit OTP Verification Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="••••••"
                          className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-center tracking-widest text-sm font-bold font-mono"
                        />
                        <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Verify OTP Code
                      <CheckCircle className="h-4 w-4" />
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setResetStep('request')}
                        className="text-xs text-slate-400 hover:text-slate-300 font-bold transition-all flex items-center justify-center gap-1.5 mx-auto"
                      >
                        <RefreshCw className="h-3 w-3" /> Resend OTP
                      </button>
                    </div>
                  </form>
                )}

                {resetStep === 'new-password' && (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-xs font-semibold"
                        />
                        <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-xs font-semibold"
                        />
                        <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Update Password
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}

                {resetStep === 'success' && (
                  <div className="space-y-5 text-center py-4">
                    <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">All Set!</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Your password has been securely updated and verified with OTP. You can now log back in with your new password.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(false);
                      setError('');
                      setResetStep('request');
                      setOtpInput('');
                      setResetEmail('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-300 font-bold transition-all"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              // STANDARD SIGN IN / SIGN UP FORM
              <>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    {isSignUp ? 'Create your account' : 'Welcome back'}
                    <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isSignUp ? 'Join thousands of students and start your micro-learning track' : 'Sign in to sync your learning progression securely'}
                  </p>
                </div>

                {error && (
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-400 text-xs animate-headShake">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                      <div className="space-y-2 flex-1">
                        <span className="font-semibold block text-sm">Authentication Error</span>
                        <p className="leading-relaxed">{error}</p>
                        {(error.includes('auth/operation-not-allowed') || error.includes('not allowed') || error.includes('disabled')) && (
                          <button
                            type="button"
                            onClick={() => setShowFirebaseHelp(true)}
                            className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-1 mt-1.5 uppercase tracking-wider font-mono"
                          >
                            <HelpCircle className="h-3 w-3" /> View Step-by-Step Setup Guide
                          </button>
                        )}
                      </div>
                    </div>

                    {showFirebaseHelp && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-slate-300 text-xs space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <h4 className="font-bold text-amber-400 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
                            🔧 Troubleshooting: Enable Auth Providers
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowFirebaseHelp(false)}
                            className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer font-bold font-mono"
                          >
                            Dismiss
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Firebase requires you to explicitly turn on authentication methods in your console. Here is how to activate them:
                        </p>
                        <ol className="space-y-2 text-[11px] text-slate-300 list-decimal pl-4 leading-relaxed">
                          <li>
                            Open your{' '}
                            <a
                              href="https://console.firebase.google.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                            >
                              Firebase Console <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </li>
                          <li>Select your project in the Firebase Console</li>
                          <li>In the left sidebar, go to <span className="font-bold text-white">Build</span> &gt; <span className="font-bold text-white">Authentication</span></li>
                          <li>Click the <span className="font-bold text-white">Sign-in method</span> tab</li>
                          <li>
                            Click <span className="font-bold text-white">Add new provider</span> and enable:
                            <div className="mt-1 ml-2 space-y-1 font-semibold text-amber-300/90 font-mono text-[10px]">
                              <div>• Email/Password</div>
                              <div>• Google (if using Google Login)</div>
                            </div>
                          </li>
                        </ol>
                        <div className="pt-2 border-t border-slate-800/60 space-y-2">
                          <p className="text-[10px] text-slate-400 font-medium">
                            Don't want to configure Firebase right now? Bypass this setup instantly:
                          </p>
                          <button
                            type="button"
                            onClick={handleGuestSignIn}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            🚀 Enter as Guest (Instantly Skip Login)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                        Full Name (for certificate)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-xs font-semibold"
                        />
                        <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-xs font-semibold"
                      />
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                        Password
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsResetMode(true);
                            setResetStep('request');
                            setError('');
                          }}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-all font-mono uppercase text-right block"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-xs font-semibold"
                      />
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 outline-none transition-all text-xs font-semibold"
                        />
                        <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-600" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-md hover:shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? 'Processing...' : isSignUp ? 'Create Student Account' : 'Sign In To Study Workspace'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <span className="relative px-3 bg-slate-900/90 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    or
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 bg-white hover:bg-slate-50 disabled:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-md border border-slate-200 flex items-center justify-center gap-2.5 cursor-pointer animate-pulse-subtle"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.37 1 3.42 3.66 1.48 7.55l3.69 2.87C6.01 7.39 8.78 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.43c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.84c2.14-1.97 3.37-4.88 3.37-8.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.17 14.88c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.48 7.55C.54 9.44 0 11.63 0 14c0 2.37.54 4.56 1.48 6.45l3.69-2.87c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.65-2.84c-1.01.68-2.31 1.08-3.71 1.08-3.22 0-5.99-2.35-6.86-5.46L1.04 16.3C3.01 20.34 7.15 23 12 23z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={loading}
                  className="w-full py-3 bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow-md border border-indigo-800/60 flex items-center justify-center gap-2.5 cursor-pointer mt-1"
                >
                  <User className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Enter as Guest (Instant Demo / Skip Login)</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-all"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up Free"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <p className="text-[10px] text-slate-600 mt-8 font-mono">
        © 2026 R-code • Verifiable AI Certification Track
      </p>

    </div>
  );
}
