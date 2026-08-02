import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { answerCopilotQuery } from '../../utils/aiEngine';

export const AICopilotDrawer: React.FC = () => {
  const {
    isCopilotDrawerOpen, setIsCopilotDrawerOpen, applications, tasks,
    setActiveTab, setSelectedAppId, createDraftEmailFromApp
  } = useCRM();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; actionButtons?: any[] }>>([
    {
      sender: 'ai',
      text: 'Hi Alex! I am your **CareerPilot AI Copilot**. How can I help you accelerate your job search today?',
      actionButtons: [
        { label: 'Draft Follow-up Email', action: 'draft_email' },
        { label: 'Groq Resume Audit', action: 'navigate_resume' }
      ]
    }
  ]);

  if (!isCopilotDrawerOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = inputQuery;
    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      const aiAns = answerCopilotQuery(userMsg, applications, tasks);
      setMessages(prev => [...prev, { sender: 'ai', text: aiAns.response, actionButtons: aiAns.actionButtons }]);
    }, 300);
  };

  const handleButtonClick = (action: string) => {
    if (action === 'navigate_tasks') setActiveTab('tasks');
    if (action === 'navigate_resume') setActiveTab('resume');
    if (action === 'draft_email') {
      const firstApp = applications[0];
      if (firstApp) createDraftEmailFromApp(firstApp.id, 'Follow-up');
      setActiveTab('email');
      setIsCopilotDrawerOpen(false);
    }
    if (action === 'view_vercel_app') {
      const vercelApp = applications.find(a => a.companyName === 'Vercel');
      if (vercelApp) setSelectedAppId(vercelApp.id);
      setActiveTab('applications');
      setIsCopilotDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-stone-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-150">
        <div className="p-4 border-b border-stone-200 bg-[#fdfbf7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 font-outfit uppercase">CareerPilot AI Assistant</h3>
              <p className="text-[10px] text-stone-500">Gemini & Groq AI Engine</p>
            </div>
          </div>
          <button onClick={() => setIsCopilotDrawerOpen(false)} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 overflow-y-auto flex-1 bg-stone-50/50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  AI
                </div>
              )}
              <div className={`max-w-[82%] p-3 rounded-xl text-xs space-y-2 ${
                m.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-xs'
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                {m.actionButtons && m.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.actionButtons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => handleButtonClick(btn.action)}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-red-50 border border-stone-200 hover:border-red-300 text-stone-900 hover:text-red-700 text-[10px] font-bold transition-all"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI Copilot..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-600"
          />
          <button type="submit" className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
