import React, { useState } from 'react';
import { File, Upload, Download, Search, Plus } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { UserDocument } from '../../types/crm';

export const DocumentsModule: React.FC = () => {
  const { documents, addDocument } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<UserDocument['category']>('Portfolio');

  const filteredDocs = documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addDocument({
      name: name.endsWith('.pdf') ? name : name + '.pdf',
      category,
      fileType: 'PDF',
      fileSize: '850 KB',
    });
    setName('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 text-xs text-stone-800 placeholder-stone-400 pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="p-5 rounded-xl bg-white border border-stone-200 hover:border-red-500 transition-all shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <File className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 font-outfit truncate max-w-[180px]">{doc.name}</h3>
                    <p className="text-[10px] text-stone-500">{doc.fileType} • {doc.fileSize}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {doc.category}
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400">
              <span>Uploaded {doc.uploadDate}</span>
              <button onClick={() => alert(`Downloading ${doc.name}...`)} className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-stone-900 uppercase">Upload Document</h3>
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Document Name *</label>
                <input type="text" required placeholder="Cert.pdf" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-900">
                  <option value="Portfolio">Portfolio</option>
                  <option value="Transcript">Transcript</option>
                  <option value="Certification">Certification</option>
                  <option value="Reference Letter">Reference Letter</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-3.5 py-1.5 bg-stone-100 text-xs font-bold rounded-lg text-stone-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-red-600 text-xs font-bold rounded-lg text-white">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
