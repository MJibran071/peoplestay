import React from 'react';
import { Home, MessageSquare, Tag, Users, ListChecks, Settings, Bot, CalendarDays } from 'lucide-react';
import type { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'messaging', label: 'Messaging', icon: MessageSquare },
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: ListChecks },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'automations', label: 'Automations', icon: Bot },
  ];

  const handleNavClick = (view: View) => {
    setActiveView(view);
    if(window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setIsOpen(false)}
    ></div>
    <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center justify-center h-20 border-b border-slate-700/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text tracking-wider">Peoplestay</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id as View);
                }}
                className={`flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 group ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-slate-700/50">
           <a
              href="#"
              onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('settings');
              }}
              className={`flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 group ${
                  activeView === 'settings'
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Settings className={`w-5 h-5 mr-3 transition-colors ${activeView === 'settings' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium">Settings</span>
            </a>
        </div>
      </nav>
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center p-3 rounded-lg bg-slate-800/50">
          <img
            src="https://i.pravatar.cc/150?u=manager"
            alt="Admin"
            className="w-10 h-10 rounded-full mr-3 border-2 border-sky-500"
          />
          <div>
            <p className="font-semibold text-white">Alex Doe</p>
            <p className="text-xs text-slate-400">Property Manager</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;