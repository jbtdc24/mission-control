import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone,
  MoreHorizontal,
  Building2
} from 'lucide-react';

const contacts = [
  { id: 1, name: 'Julz', email: 'jbtdc22498@gmail.com', role: 'You', company: 'Anichess', type: 'personal' },
  { id: 2, name: 'Anichess Support', email: 'support@anichess.com', role: 'Game Support', company: 'Animoca Brands', type: 'work' },
  { id: 3, name: 'Typefully Team', email: 'hello@typefully.com', role: 'Platform', company: 'Typefully', type: 'work' },
];

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 lg:px-8 py-6 border-b border-white/[0.06]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">Contacts</h1>
            <p className="text-sm text-white/50">People and organizations</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="input pl-10 w-64"
              />
            </div>

            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="rounded-xl bg-[#111] border border-white/[0.06] overflow-hidden">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#254670] flex items-center justify-center text-sm font-medium text-white"
              >
                {contact.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white">{contact.name}</h4>
                <p className="text-xs text-white/50">{contact.role}</p>
              </div>

              <div className="hidden sm:flex items-center gap-6 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">{contact.email}</span>
                </div>

                {contact.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{contact.company}</span>
                  </div>
                )}
              </div>

              <button className="p-2 rounded-lg hover:bg-white/[0.1] text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contacts;