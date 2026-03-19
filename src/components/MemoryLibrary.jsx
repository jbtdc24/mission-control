import { useState } from 'react';
import { 
  FileText, 
  Search, 
  FolderOpen, 
  Clock,
  MoreHorizontal,
  Plus,
  ExternalLink,
  X,
  Trash2,
  Edit3,
  Download,
  Image,
  FileSpreadsheet,
  Folder
} from 'lucide-react';
import { useContent } from '../hooks/useApi';

const fileTypeIcons = {
  doc: FileText,
  sheet: FileSpreadsheet,
  image: Image,
  folder: Folder,
  default: FileText,
};

const fileTypeLabels = {
  doc: 'Document',
  sheet: 'Spreadsheet',
  image: 'Image',
  folder: 'Folder',
};

const DocumentItem = ({ doc, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const Icon = fileTypeIcons[doc.type] || fileTypeIcons.default;

  return (
    <div className="group grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors items-center">
      <div className="col-span-6 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/[0.05]">
          <Icon className="w-4 h-4 text-white/50" />
        </div>
        <div className="min-w-0">
          <span className="text-sm text-white/80 group-hover:text-white transition-colors block truncate">
            {doc.title}
          </span>
          <span className="text-[10px] text-white/30">{fileTypeLabels[doc.type] || 'File'}</span>
        </div>
      </div>

      <div className="col-span-3 flex items-center gap-1.5 text-xs text-white/40">
        <Clock className="w-3.5 h-3.5" />
        {doc.updated}
      </div>

      <div className="col-span-2 text-xs text-white/40">
        {doc.size}
      </div>

      <div className="col-span-1 flex justify-end relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded hover:bg-white/[0.1] text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-8 w-40 rounded-lg bg-[#1a1a1a] border border-white/[0.08] shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => { onEdit(doc); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={() => { setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <div className="border-t border-white/[0.06]" />
              <button
                onClick={() => { onDelete(doc.id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// New Document Modal
const DocumentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'doc',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      updated: 'Just now',
      size: '0 KB',
    });
    onClose();
    setFormData({ title: '', type: 'doc' });
  };

  const types = [
    { id: 'doc', label: 'Document', icon: FileText },
    { id: 'sheet', label: 'Spreadsheet', icon: FileSpreadsheet },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'folder', label: 'Folder', icon: Folder },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">New Document</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.1]">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Name</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Document name..."
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {types.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: id })}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    formData.type === id 
                      ? 'border-[#d4a574] bg-[#d4a574]/10' 
                      : 'border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/70">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MemoryLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, title: 'Project Roadmap Q2', type: 'doc', updated: '2 hours ago', size: '245 KB' },
    { id: 2, title: 'Content Strategy', type: 'sheet', updated: 'Yesterday', size: '128 KB' },
    { id: 3, title: 'Avatar Reference', type: 'image', updated: '2 days ago', size: '4.2 MB' },
    { id: 4, title: 'Twitter Analytics', type: 'sheet', updated: '3 days ago', size: '89 KB' },
    { id: 5, title: 'Meeting Notes', type: 'doc', updated: 'Last week', size: '56 KB' },
  ]);

  const folders = [
    { id: 1, name: 'Projects', count: 12 },
    { id: 2, name: 'Content', count: 8 },
    { id: 3, name: 'Assets', count: 24 },
    { id: 4, name: 'Archive', count: 56 },
  ];

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDocument = (doc) => {
    const newDoc = {
      ...doc,
      id: Date.now(),
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleDelete = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleEdit = (doc) => {
    const newTitle = prompt('Rename document:', doc.title);
    if (newTitle && newTitle.trim()) {
      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? { ...d, title: newTitle.trim(), updated: 'Just now' } : d
      ));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 lg:px-8 py-6 border-b border-white/[0.06]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">Memory Library</h1>
            <p className="text-sm text-white/50">Documents, notes, and resources</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="input pl-10 w-64"
              />
            </div>

            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/[0.06] p-4 hidden lg:block">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Folders</h3>

          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedFolder === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                All Documents
              </span>
              <span className="text-xs text-white/30">{documents.length}</span>
            </button>

            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  {folder.name}
                </span>
                <span className="text-xs text-white/30">{folder.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="rounded-xl bg-[#111] border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-medium text-white/40 uppercase tracking-wider">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Updated</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1"></div>
            </div>

            {filteredDocs.map((doc) => (
              <DocumentItem 
                key={doc.id} 
                doc={doc}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}

            {filteredDocs.length === 0 && (
              <div className="p-8 text-center text-white/30">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No documents found</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-[#d4a574] hover:text-[#e8c4a0] text-xs"
                >
                  Create your first document →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDocument}
      />
    </div>
  );
};

export default MemoryLibrary;
