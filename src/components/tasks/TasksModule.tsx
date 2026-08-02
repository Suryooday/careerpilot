import React, { useState } from 'react';
import { CheckSquare, Plus, CheckCircle2, Circle } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Priority } from '../../types/crm';

export const TasksModule: React.FC = () => {
  const { tasks, addTask, toggleTaskCompleted, applications } = useCRM();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-08-05');
  const [priority, setPriority] = useState<Priority>('High');
  const [category, setCategory] = useState<'Follow-up' | 'Preparation' | 'Assessment' | 'Networking' | 'Other'>('Follow-up');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const targetApp = applications.find(a => a.id === selectedAppId);

    addTask({
      applicationId: targetApp?.id,
      companyName: targetApp?.companyName || 'General',
      title,
      dueDate,
      priority,
      category
    });

    setTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Tasks & Follow-ups</h2>
            <p className="text-[11px] text-stone-500">Action items & reminders</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase">Pending Tasks ({pendingTasks.length})</h3>
          <div className="space-y-2">
            {pendingTasks.map(t => (
              <div
                key={t.id}
                onClick={() => toggleTaskCompleted(t.id)}
                className="p-3 bg-stone-50 border border-stone-200 rounded-lg hover:border-red-500 cursor-pointer transition-all flex items-start gap-2.5 group"
              >
                <Circle className="w-4 h-4 text-stone-400 group-hover:text-red-600 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-stone-900 group-hover:text-red-600">{t.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-stone-500">
                    <span>{t.companyName}</span>
                    <span className="font-bold text-red-600">Due: {t.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-400 uppercase">Completed ({completedTasks.length})</h3>
          <div className="space-y-2">
            {completedTasks.map(t => (
              <div
                key={t.id}
                onClick={() => toggleTaskCompleted(t.id)}
                className="p-3 bg-stone-50/50 border border-stone-200 rounded-lg cursor-pointer opacity-60 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-stone-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-stone-500 line-through">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-stone-900 uppercase">Create Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Title *</label>
                <input type="text" required placeholder="Send follow-up..." value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3.5 py-1.5 bg-stone-100 text-xs font-bold rounded-lg text-stone-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-red-600 text-xs font-bold rounded-lg text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
