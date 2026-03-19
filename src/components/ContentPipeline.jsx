import { useState } from 'react';
import { 
  Plus, 
  Twitter, 
  Youtube, 
  Instagram, 
  Linkedin,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  X,
  Trash2,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { useContent } from '../hooks/useApi';

const platformIcons = {
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
};

const stageConfig = {
  idea: { label: 'Idea', color: 'bg-white/10 text-white/50', icon: Circle, borderColor: 'border-white/10' },
  script: { label: 'Script', color: 'bg-blue-500/10 text-blue-400', icon: Circle, borderColor: 'border-blue-500/30' },
  record: { label: 'Recording', color: 'bg-purple-500/10 text-purple-400', icon: PlayCircle, borderColor: 'border-purple-500/30' },
  edit: { label: 'Editing', color: 'bg-amber-500/10 text-amber-400', icon: Clock, borderColor: 'border-amber-500/30' },
  review: { label: 'Review', color: 'bg-orange-500/10 text-orange-400', icon: Circle, borderColor: 'border-orange-500/30' },
  scheduled: { label: 'Scheduled', color: 'bg-cyan-500/10 text-cyan-400', icon: Calendar, borderColor: 'border-cyan-500/30' },
  published: { label: 'Published', color: 'bg-green-500/10 text-green-400', icon: CheckCircle2, borderColor: 'border-green-500/30' },
};

const ContentCard = ({ item, onEdit, onDelete, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const PlatformIcon = platformIcons[item.platform?.toLowerCase()] || Twitter;
  const stage = stageConfig[item.stage] || stageConfig.idea;
  const StageIcon = stage.icon;

  const moveToNextStage = () => {
    const stages = Object.keys(stageConfig);
    const currentIndex = stages.indexOf(item.stage);
    if (currentIndex < stages.length - 1) {
      onUpdate(item.id, { stage: stages[currentIndex + 1] });
    }
  };

  return (
    <div className="group p-4 rounded-xl bg-[#161616] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1c1c1c] transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/[0.05]">
          <PlatformIcon className="w-4 h-4 text-white/60" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white/90 mb-1 truncate">
            {item.title}
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${stage.color}`}>
              <StageIcon className="w-3 h-3" />
              {stage.label}
            </span>

            <span className="text-[11px] text-white/40">
              {item.day || 'No date'}
            </span>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded hover:bg-white/[0.1] transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4 text-white/40" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 w-44 rounded-lg bg-[#1a1a1a] border border-white/[0.08] shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => { moveToNextStage(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Move to Next Stage
                </button>
                <button
                  onClick={() => { onEdit(item); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <div className="border-t border-white/[0.06]" />
                <button
                  onClick={() => { onDelete(item.id); setShowMenu(false); }}
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
    </div>
  );
};

// New/Edit Content Modal
const ContentModal = ({ isOpen, onClose, content, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'twitter',
    stage: 'idea',
    day: 'Monday',
    type: 'text',
    ...content
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    if (!content) {
      setFormData({ title: '', platform: 'twitter', stage: 'idea', day: 'Monday', type: 'text' });
    }
  };

  const platforms = [
    { id: 'twitter', label: 'Twitter', icon: Twitter },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const types = ['text', 'video', 'image', 'thread'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{content ? 'Edit Content' : 'New Content'}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.1]">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Content title..."
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {platforms.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: id })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                    formData.platform === id 
                      ? 'border-[#d4a574] bg-[#d4a574]/10' 
                      : 'border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white/60" />
                  <span className="text-[10px] text-white/50">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="input"
            >
              {Object.entries(stageConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="input"
              >
                {days.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                {types.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {content ? 'Save Changes' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContentPipeline = () => {
  const { content, addContent, updateContent, deleteContent } = useContent();
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const stages = Object.keys(stageConfig);

  const filteredContent = content.filter(item => {
    const matchesStage = selectedStage === 'all' || item.stage === selectedStage;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const contentByStage = stages.reduce((acc, stage) => {
    acc[stage] = filteredContent.filter(item => item.stage === stage);
    return acc;
  }, {});

  const handleEdit = (item) => {
    setEditingContent(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingContent(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (editingContent) {
      updateContent(editingContent.id, formData);
    } else {
      addContent(formData);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 lg:px-8 py-6 border-b border-white/[0.06]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">Content Pipeline</h1>
            <p className="text-sm text-white/50">Track your content from idea to published</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="input pl-10 w-64"
              />
            </div>

            <button className="btn btn-secondary">
              <Filter className="w-4 h-4" />
              Filter
            </button>

            <button onClick={handleAdd} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              New Content
            </button>
          </div>
        </div>

        {/* Stage Filter */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedStage === 'all'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            All Stages
          </button>

          {stages.map((stage) => {
            const config = stageConfig[stage];
            const count = contentByStage[stage]?.length || 0;

            return (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedStage === stage
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.color.split(' ')[0].replace('/10', '')}`} />
                {config.label}
                <span className="text-white/30">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {selectedStage === 'all' ? (
          // Show by stages
          <div className="space-y-8">
            {stages.map((stage) => {
              const items = contentByStage[stage];
              if (items.length === 0) return null;

              const config = stageConfig[stage];

              return (
                <div key={stage}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-2 h-2 rounded-full ${config.color.split(' ')[0].replace('/10', '')}`} />
                    <h3 className="text-sm font-medium text-white/80">{config.label}</h3>
                    <span className="text-xs text-white/30">({items.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <ContentCard 
                        key={item.id} 
                        item={item} 
                        onEdit={handleEdit}
                        onDelete={deleteContent}
                        onUpdate={updateContent}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Show filtered
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContent.map((item) => (
              <ContentCard 
                key={item.id} 
                item={item} 
                onEdit={handleEdit}
                onDelete={deleteContent}
                onUpdate={updateContent}
              />
            ))}
          </div>
        )}

        {filteredContent.length === 0 && (
          <div className="h-96 flex flex-col items-center justify-center text-white/30">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-sm">No content found</p>
            <button onClick={handleAdd} className="mt-4 text-[#d4a574] hover:text-[#e8c4a0] text-sm">
              Create your first content →
            </button>
          </div>
        )}
      </div>

      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={editingContent}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ContentPipeline;
