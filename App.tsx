import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Messaging from './components/Messaging';
import Pricing from './components/Pricing';
import Leads from './components/Leads';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import Automations from './components/Automations';
import Calendar from './components/Calendar';
import type { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = useCallback(() => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'messaging':
        return <Messaging />;
      case 'pricing':
        return <Pricing />;
      case 'leads':
        return <Leads />;
      case 'tasks':
        return <Tasks />;
      case 'calendar':
        return <Calendar />;
      case 'automations':
        return <Automations />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  }, [activeView]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;