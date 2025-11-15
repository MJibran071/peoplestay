import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, BedDouble, MessageSquare, ListChecks } from 'lucide-react';
import { mockNotifications } from '../constants';
import type { Notification } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const hasUnread = notifications.some(n => !n.read);

  const handleNotificationToggle = () => {
    setIsNotificationOpen(prev => !prev);
    if (!isNotificationOpen && hasUnread) {
      // Mark all as read when opening
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  useEffect(() => {
    if (!isNotificationOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <BedDouble className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'task':
        return <ListChecks className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 bg-white/70 backdrop-blur-lg shadow-sm z-20">
      <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
            <button
                onClick={toggleSidebar}
                className="lg:hidden text-slate-600 mr-4"
                aria-label="Open sidebar"
            >
                <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search properties, guests..."
                    className="w-64 pl-10 pr-4 py-2 rounded-full bg-zinc-100 border border-transparent focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                />
            </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={handleNotificationToggle} 
              className="relative text-slate-500 hover:text-slate-800"
              aria-label="Toggle notifications"
            >
              <Bell className="w-6 h-6" />
              {hasUnread && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>
            {isNotificationOpen && (
              <div ref={notificationRef} className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-lg border border-slate-200 z-50 animate-fade-in-down">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} className="flex items-start p-4 hover:bg-slate-100 cursor-pointer border-b last:border-b-0 border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-3 flex-shrink-0">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-tight">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center p-8 text-sm text-slate-500">No new notifications</p>
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    <button className="w-full text-center text-sm font-semibold text-sky-600 hover:bg-slate-200/60 p-2 rounded-lg transition-colors">
                        View all notifications
                    </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <img
              src="https://i.pravatar.cc/150?u=manager"
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
            <div className="hidden sm:block">
              <p className="font-semibold text-sm">Alex Doe</p>
              <p className="text-xs text-slate-500">Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;