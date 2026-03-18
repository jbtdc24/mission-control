import React from 'react';
import { User, Mail, Globe, DollarSign, Clock } from 'lucide-react';

const contacts = [
  { name: 'Julz', role: 'Owner', handle: '@jbtdc24', timezone: 'GMT+8', type: 'internal', notes: 'Philippines based, works at Anichess' },
  { name: 'Monday', role: 'AI Lead', handle: 'monday@julz.local', timezone: 'GMT+8', type: 'internal', notes: 'Primary AI assistant' },
];

const categories = {
  internal: 'Internal Team',
  content: 'Content Team',
  external: 'External',
  clients: 'Clients',
};

export default function Contacts() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-monday-amber">Contacts</h1>
        <p className="text-gray-400">People and connections</p>
      </div>

      {Object.entries(categories).map(([key, label]) => {
        const categoryContacts = contacts.filter(c => c.type === key);
        
        return (
          <div key={key} className="mb-6">
            <h2 className="text-lg font-semibold mb-3">{label}</h2>            
            
            <div className="grid gap-3">
              {categoryContacts.length > 0 ? categoryContacts.map((contact) => (
                <div key={contact.name} className="card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-monday-navy flex items-center justify-center">
                      <User size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{contact.name}</h3>
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">{contact.role}</span>
                      </div>                      
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {contact.handle}
                        </span>                        
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {contact.timezone}
                        </span>
                      </div>                      
                      <p className="mt-2 text-sm text-gray-500">{contact.notes}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No contacts in this category yet</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}