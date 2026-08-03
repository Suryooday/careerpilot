import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { signUpWithEmail, signInWithEmail } from '../../lib/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { updateProfile, addNotification } = useCRM();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        const data = await signUpWithEmail(email, password, name);
        updateProfile({ name, email, isOnboarded: false });
        localStorage.setItem('cp_is_logged_in', 'true');
        addNotification('success', 'Account Created!', 'Supabase registration successful. Welcome!');
      } else {
        const data = await signInWithEmail(email, password);
        const userName = data.user?.user_metadata?.name || email.split('@')[0];
        updateProfile({ name: userName, email, isOnboarded: true });
        localStorage.setItem('cp_is_logged_in', 'true');
        addNotification('success', 'Signed In!', `Welcome back, ${userName}!`);
      }
      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Authentication failed. Please check your details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-5 bg-[#fdfbf7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-stone-900 font-outfit uppercase tracking-wider">
                {mode === 'signin' ? 'Sign In to Access Dashboard' : 'Create Supabase Account'}
              </h2>
              <p className="text-[11px] text-stone-500">Authentication required for CRM access</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 px-5 bg-[#fdfbf7]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-red-600" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
              <Mail className="w-3 h-3 text-red-600" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
              <Lock className="w-3 h-3 text-red-600" />
              <span>Password *</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {loading ? 'Connecting to Supabase...' : mode === 'signin' ? 'Sign In & Access Dashboard' : 'Create Account & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
