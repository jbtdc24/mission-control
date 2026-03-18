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
  PlayCircle
} from 'lucide-react';
import { useContent } from '../hooks/useApi';

const platformIcons = {
  Twitter,
  YouTube: Youtube,
  Instagram,
  LinkedIn: Linkedin,
};

const stageConfig = {
  idea: { label: 'Idea', color: 'bg-white/10 text-white/50', icon: Circle },
  script: { label: 'Script', color: 'bg-blue-500/10 text-blue-400', icon: Circle },
  record: { label: 'Recording', color: 'bg-purple-500/10 text-purple-400', icon: PlayCircle },
  edit: { label: 'Editing', color: 'bg-amber-500/10 text-amber-400', icon: Clock },
  review: { label: 'Review', color: 'bg-orange-500/10 text-orange-400', icon: Circle },
  scheduled: { label: 'Scheduled', color: 'bg-cyan-500/10 text-cyan-400', icon: Calendar },
  published: { label: 'Published', color: 'bg-green-500/10 text-green-400', icon: CheckCircle2 },
};

const ContentCard = ({ item }) => {
  const PlatformIcon = platformIcons[item.platform] || Twitter;
  const stage = stageConfig[item.stage] || stageConfig.idea;
  const StageIcon = stage.icon;

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
              {item.day}
            </span>
          </div>
        </div>

        <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-white/[0.1] transition-all">
          <MoreHorizontal className="w-4 h-4 text-white/40" />
        </button>
      </div>
    </div>
  );
};

const ContentPipeline = () => {
  const { content } = useContent();
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stages = Object.keys(stageConfig);

  const filteredContent = content.filter(item => {
    const matchesStage = selectedStage === 'all' || item.stage === selectedStage;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const contentByStage = stages.reduce((acc, stage) => {
    acc[stage] = filteredContent.filter(item => item.stage === stage);
    return acc;
  }, {});

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

            <button className="btn btn-primary">
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
                <span className={`w-1.5 h-1.5 rounded-full ${config.color.split(' ')[0].replace('bg-', 'bg-').replace('/10', '')}`} />
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
                    <span className={`w-2 h-2 rounded-full ${config.color.split(' ')[0].replace('bg-', 'bg-').replace('/10', '')}`} />
                    <h3 className="text-sm font-medium text-white/80">{config.label}</h3>
                    <span className="text-xs text-white/30">({items.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <ContentCard key={item.id} item={item} />
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
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filteredContent.length === 0 && (
          <div className="h-96 flex flex-col items-center justify-center text-white/30">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-sm">No content found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPipeline;