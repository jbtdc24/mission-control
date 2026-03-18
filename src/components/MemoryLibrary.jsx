import { useState } from 'react';
import { 
  FileText, 
  Search, 
  FolderOpen, 
  Clock,
  MoreHorizontal,
  Plus,
  ExternalLink
} from 'lucide-react';

const documents = [
  { id: 1, title: 'Project Roadmap Q2', type: 'doc', updated: '2 hours ago', size: '245 KB' },
  { id: 2, title: 'Content Strategy', type: 'sheet', updated: 'Yesterday', size: '128 KB' },
  { id: 3, title: 'Avatar Reference', type: 'image', updated: '2 days ago', size: '4.2 MB' },
  { id: 4, title: 'Twitter Analytics', type: 'sheet', updated: '3 days ago', size: '89 KB' },
  { id: 5, title: 'Meeting Notes', type: 'doc', updated: 'Last week', size: '56 KB' },
];

const folders = [
  { id: 1, name: 'Projects', count: 12 },
  { id: 2, name: 'Content', count: 8 },
  { id: 3, name: 'Assets', count: 24 },
  { id: 4, name: 'Archive', count: 56 },
];

const MemoryLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

            <button className="btn btn-primary">
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
              <div
                key={doc.id}
                className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors items-center group cursor-pointer"
              >
                <div className="col-span-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.05]">
                    <FileText className="w-4 h-4 text-white/50" />
                  </div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                    {doc.title}
                  </span>
                </div>

                <div className="col-span-3 flex items-center gap-1.5 text-xs text-white/40">
                  <Clock className="w-3.5 h-3.5" />
                  {doc.updated}
                </div>

                <div className="col-span-2 text-xs text-white/40">
                  {doc.size}
                </div>

                <div className="col-span-1 flex justify-end">
                  <button className="p-1.5 rounded hover:bg-white/[0.1] text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryLibrary;