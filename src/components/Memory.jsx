import React, { useState } from 'react';
import { Search, FileText, Calendar, Tag, Filter } from 'lucide-react';

const memories = [
  { id: 1, title: '2026-03-19 — First Full Day with Julz', date: '2026-03-19', category: 'Daily Log', preview: 'First complete day working with Julz. Established full workflow...' },
  { id: 2, title: 'Twitter Content Strategy', date: '2026-03-19', category: 'Strategy', preview: '3x daily posts schedule. Morning: Industry news...' },
  { id: 3, title: 'API Keys & Credentials', date: '2026-03-19', category: 'Config', preview: 'Gemini, GitHub, Typefully keys configured...' },
  { id: 4, title: 'Avatar Reference — Julz', date: '2026-03-19', category: 'Assets', preview: 'Anime/manga style, black denim jacket...' },
  { id: 5, title: 'Star Office Deployment', date: '2026-03-19', category: 'Dev', preview: 'Deployed to Vercel with custom domain...' },
];

const categories = ['All', 'Daily Log', 'Strategy', 'Config', 'Assets', 'Dev', 'Archive'];

export default function Memory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = memories.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          m.preview.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || m.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-monday-amber">Memory</h1>
          <p className="text-gray-400">Searchable document library of everything we do</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-julz-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2"
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-julz-dark border border-gray-700 rounded-lg px-4 py-2"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Memory Cards */}
      <div className="grid gap-4">
        {filtered.map((memory) => (
          <div key={memory.id} className="card hover:border-gray-600 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-monday-amber" />
                <div>
                  <h3 className="font-medium">{memory.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {memory.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      {memory.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>            
            <p className="mt-3 text-sm text-gray-400">{memory.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}