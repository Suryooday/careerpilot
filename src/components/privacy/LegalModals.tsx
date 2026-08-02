import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface Props {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<Props> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 bg-[#fdfbf7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? <ShieldCheck className="w-5 h-5 text-red-600" /> : <FileText className="w-5 h-5 text-red-600" />}
            <h2 className="text-xs font-bold text-stone-900 font-outfit uppercase tracking-wider">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} - CareerPilot AI
            </h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-stone-700 overflow-y-auto leading-relaxed">
          {type === 'privacy' ? (
            <>
              <h3 className="text-sm font-bold text-stone-900">CareerPilot AI Privacy Policy</h3>
              <p>Last updated: August 2026</p>

              <h4 className="font-bold text-stone-900 uppercase pt-2">1. Information Collection</h4>
              <p>
                CareerPilot AI collects user-provided job application details, master resume information, and optional Google OAuth tokens solely to provide candidate tracking, AI resume scoring, and email draft generation.
              </p>

              <h4 className="font-bold text-stone-900 uppercase pt-2">2. Google API Data & Gmail Scopes</h4>
              <p>
                CareerPilot AI uses Gmail REST API permissions (`gmail.send` and `gmail.readonly`) strictly to send user-authorized outreach emails and monitor recruiter responses for job application updates.
                We do not sell, store on third-party servers, or share your private Google data.
              </p>

              <h4 className="font-bold text-stone-900 uppercase pt-2">3. Local Browser Storage</h4>
              <p>
                All application tracking data, resume details, and API tokens remain stored locally in your browser (`localStorage`) and are under your complete control.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-stone-900">CareerPilot AI Terms of Service</h3>
              <p>Last updated: August 2026</p>

              <h4 className="font-bold text-stone-900 uppercase pt-2">1. Usage Agreement</h4>
              <p>
                By accessing CareerPilot AI, you agree to use the service in compliance with applicable employment laws and automated communication guidelines.
              </p>

              <h4 className="font-bold text-stone-900 uppercase pt-2">2. User Ownership</h4>
              <p>
                You retain full ownership of all resume content, job application records, and emails generated through the platform.
              </p>

              <h4 className="font-bold text-stone-900 uppercase pt-2">3. Limitation of Liability</h4>
              <p>
                CareerPilot AI is provided "as is" without warranty. Users are responsible for reviewing all AI-generated email drafts before sending.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 bg-stone-900 text-white font-bold text-xs rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
