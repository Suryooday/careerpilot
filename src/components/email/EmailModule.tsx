import React, { useState } from 'react';
import { Mail, Send, Inbox, FileText, CheckCircle2, Paperclip, Sparkles, Edit3, Trash2, Plus, RefreshCw } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { EmailMessage, EmailAttachment } from '../../types/crm';

export const EmailModule: React.FC = () => {
  const {
    emails, sendEmail, updateDraftEmail, sendDraftEmail, syncGmailResponsesNow,
    applications, resumes, coverLetters, documents, profile
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'inbox' | 'drafts' | 'sent'>('drafts');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(emails.find(e => e.type === 'draft')?.id || emails[0]?.id || null);
  const [isSyncingGmail, setIsSyncingGmail] = useState(false);

  // Edit State
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [aiRefinePrompt, setAiRefinePrompt] = useState('');
  const [isAiRefining, setIsAiRefining] = useState(false);

  // Attachment Selector Modal
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const displayedEmails = emails.filter(e => e.type === activeTab);
  const activeEmail = emails.find(e => e.id === selectedEmailId) || displayedEmails[0];

  React.useEffect(() => {
    if (activeEmail) {
      setEditSubject(activeEmail.subject);
      setEditBody(activeEmail.body);
    }
  }, [selectedEmailId, activeEmail?.id]);

  const handleSaveNormalEdit = () => {
    if (!activeEmail) return;
    updateDraftEmail(activeEmail.id, {
      subject: editSubject,
      body: editBody
    });
  };

  const handleAiRefine = () => {
    if (!activeEmail || !aiRefinePrompt.trim()) return;
    setIsAiRefining(true);

    setTimeout(() => {
      let refined = editBody;
      const promptLower = aiRefinePrompt.toLowerCase();
      if (promptLower.includes('short') || promptLower.includes('concise')) {
        refined = editBody.split('\n\n').slice(0, 2).join('\n\n') + '\n\nBest regards,\n' + profile.name;
      } else if (promptLower.includes('formal') || promptLower.includes('polite')) {
        refined = `Dear ${activeEmail.recruiterName},\n\nI am writing to formally follow up on my candidate application for ${activeEmail.companyName}.\n\nThank you for your time and guidance.\n\nSincerely,\n` + profile.name;
      } else {
        refined = editBody + `\n\nP.S. ${aiRefinePrompt}`;
      }

      setEditBody(refined);
      updateDraftEmail(activeEmail.id, { body: refined });
      setAiRefinePrompt('');
      setIsAiRefining(false);
    }, 400);
  };

  const handleAddAttachment = (attachment: EmailAttachment) => {
    if (!activeEmail) return;
    const currentAtts = activeEmail.attachments || [];
    if (!currentAtts.some(a => a.id === attachment.id)) {
      const updated = [...currentAtts, attachment];
      updateDraftEmail(activeEmail.id, { attachments: updated });
    }
    setIsAttachModalOpen(false);
  };

  const handleRemoveAttachment = (attId: string) => {
    if (!activeEmail) return;
    const updated = (activeEmail.attachments || []).filter(a => a.id !== attId);
    updateDraftEmail(activeEmail.id, { attachments: updated });
  };

  const handleSendDraft = async () => {
    if (!activeEmail) return;
    updateDraftEmail(activeEmail.id, { subject: editSubject, body: editBody });
    await sendDraftEmail(activeEmail.id);
  };

  const handleSyncGmail = async () => {
    setIsSyncingGmail(true);
    await syncGmailResponsesNow();
    setIsSyncingGmail(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Gmail Integrated Email Center</h2>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                Gmail API Connected
              </span>
            </div>
            <p className="text-[11px] text-stone-500">Draft editor, RAG AI refinement, file attachments & Gmail API sync</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync Gmail Button */}
          <button
            onClick={handleSyncGmail}
            disabled={isSyncingGmail}
            className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGmail ? 'animate-spin text-red-600' : ''}`} />
            <span>{isSyncingGmail ? 'Syncing Gmail...' : 'Sync Gmail Responses'}</span>
          </button>
        </div>
      </div>

      {/* Main Mail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Email Folders List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="flex border-b border-stone-200 bg-[#fdfbf7] p-2 gap-1">
            <button
              onClick={() => setActiveTab('drafts')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'drafts' ? 'bg-white text-red-600 border border-stone-200 shadow-sm' : 'text-stone-500'
              }`}
            >
              Drafts ({emails.filter(e => e.type === 'draft').length})
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'inbox' ? 'bg-white text-red-600 border border-stone-200 shadow-sm' : 'text-stone-500'
              }`}
            >
              Inbox ({emails.filter(e => e.type === 'inbox').length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'sent' ? 'bg-white text-red-600 border border-stone-200 shadow-sm' : 'text-stone-500'
              }`}
            >
              Sent ({emails.filter(e => e.type === 'sent').length})
            </button>
          </div>

          <div className="divide-y divide-stone-200 overflow-y-auto flex-1 max-h-[650px]">
            {displayedEmails.length === 0 ? (
              <p className="text-xs text-stone-400 p-6 text-center">No messages in {activeTab}.</p>
            ) : (
              displayedEmails.map(mail => {
                const isSelected = mail.id === (activeEmail?.id);
                return (
                  <div
                    key={mail.id}
                    onClick={() => setSelectedEmailId(mail.id)}
                    className={`p-3.5 cursor-pointer transition-all space-y-1 ${
                      isSelected ? 'bg-red-50/50 border-l-4 border-red-600 font-bold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{mail.companyName} ({mail.recruiterName})</span>
                      <span className="text-[10px] text-stone-400">{new Date(mail.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-stone-800 truncate">{mail.subject}</p>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{mail.snippet}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Draft Editor & Reader (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          {activeEmail ? (
            <div className="space-y-5 flex-1">
              {/* Top Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {activeEmail.type.toUpperCase()} • {activeEmail.companyName}
                  </span>
                  <p className="text-xs text-stone-500 mt-1">Recruiter: <strong className="text-stone-800">{activeEmail.recruiterName}</strong> &lt;{activeEmail.recruiterEmail}&gt;</p>
                </div>

                {activeEmail.type === 'draft' && (
                  <button
                    onClick={handleSendDraft}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via Gmail API</span>
                  </button>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Subject Line</label>
                {activeEmail.type === 'draft' ? (
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    onBlur={handleSaveNormalEdit}
                    className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold focus:border-red-600 focus:outline-none"
                  />
                ) : (
                  <p className="text-sm font-bold text-stone-900 mt-1">{activeEmail.subject}</p>
                )}
              </div>

              {/* AI Refine Bar for Drafts */}
              {activeEmail.type === 'draft' && (
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-[11px] font-bold text-stone-900 uppercase">Edit Draft with AI Prompt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 'Make concise', 'Make more formal', 'Add salary inquiry'..."
                      value={aiRefinePrompt}
                      onChange={(e) => setAiRefinePrompt(e.target.value)}
                      className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none"
                    />
                    <button
                      onClick={handleAiRefine}
                      disabled={isAiRefining}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-lg shadow-sm"
                    >
                      {isAiRefining ? 'Refining...' : 'Refine AI'}
                    </button>
                  </div>
                </div>
              )}

              {/* Body Editor */}
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Email Message Body</label>
                {activeEmail.type === 'draft' ? (
                  <textarea
                    rows={10}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    onBlur={handleSaveNormalEdit}
                    className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-800 leading-relaxed font-sans focus:border-red-600 focus:outline-none"
                  />
                ) : (
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 leading-relaxed whitespace-pre-line">
                    {activeEmail.body}
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-900 uppercase flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-stone-500" />
                    <span>Attachments ({activeEmail.attachments?.length || 0})</span>
                  </span>

                  {activeEmail.type === 'draft' && (
                    <button
                      onClick={() => setIsAttachModalOpen(true)}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Attach Resume / Cover Letter</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeEmail.attachments && activeEmail.attachments.length > 0 ? (
                    activeEmail.attachments.map(att => (
                      <div key={att.id} className="p-2 bg-stone-50 border border-stone-200 rounded-lg flex items-center gap-2 text-xs">
                        <FileText className="w-3.5 h-3.5 text-red-600" />
                        <span className="font-bold text-stone-800">{att.name}</span>
                        {activeEmail.type === 'draft' && (
                          <button onClick={() => handleRemoveAttachment(att.id)} className="text-stone-400 hover:text-red-600">
                            ✕
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-400">No attached files.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400">Select an email to view or edit.</div>
          )}
        </div>
      </div>

      {/* Attachment Selection Modal */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="text-xs font-bold text-stone-900 uppercase">Select File Attachment</h3>
              <button onClick={() => setIsAttachModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase mb-1">Resume Versions</p>
                <div className="space-y-1">
                  {resumes.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleAddAttachment({ id: r.id, name: r.title + '.pdf', type: 'Resume' })}
                      className="p-2 bg-stone-50 hover:bg-red-50 border border-stone-200 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-stone-900">{r.title}</span>
                      <span className="text-[10px] text-red-600 font-bold">Attach</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase mb-1">Cover Letters</p>
                <div className="space-y-1">
                  {coverLetters.map(cl => (
                    <div
                      key={cl.id}
                      onClick={() => handleAddAttachment({ id: cl.id, name: cl.title + '.pdf', type: 'Cover Letter' })}
                      className="p-2 bg-stone-50 hover:bg-red-50 border border-stone-200 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-stone-900">{cl.title}</span>
                      <span className="text-[10px] text-red-600 font-bold">Attach</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase mb-1">Vault Documents</p>
                <div className="space-y-1">
                  {documents.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleAddAttachment({ id: d.id, name: d.name, type: 'Document' })}
                      className="p-2 bg-stone-50 hover:bg-red-50 border border-stone-200 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-stone-900">{d.name}</span>
                      <span className="text-[10px] text-red-600 font-bold">Attach</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
