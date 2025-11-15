import React, { useState } from 'react';
import { User, Lock, Bell, Briefcase, Upload, Sun, Moon, Monitor, X, ShieldCheck } from 'lucide-react';
import { mockPlatforms } from '../constants';
import type { Platform } from '../types';

interface SettingCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SettingCard: React.FC<SettingCardProps> = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
    <div className="p-6 border-b border-slate-200">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-4">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
    </div>
    <div className="p-6 bg-slate-50/50">
      {children}
    </div>
  </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-sky-500' : 'bg-slate-300'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const LabeledToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <ToggleSwitch enabled={enabled} onChange={onChange} />
    </div>
);


const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
      bookings: true,
      messages: true,
      tasks: false,
      pricing: true,
  });
  const [platforms, setPlatforms] = useState<Platform[]>(mockPlatforms);
  const [isIntegrationsModalOpen, setIntegrationsModalOpen] = useState(false);
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);
  const [platformToConnect, setPlatformToConnect] = useState<Platform | null>(null);

  const handleNotificationChange = (key: keyof typeof notifications) => {
      setNotifications(prev => ({...prev, [key]: !prev[key]}));
  };

  const handlePlatformToggle = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    // Disconnecting is always a simple toggle
    if (platform.connected) {
      setPlatforms(prev =>
        prev.map(p => (p.id === platformId ? { ...p, connected: false } : p))
      );
      return;
    }

    // Connecting special platforms that need "OAuth"
    if (platform.id === 'gcal' || platform.id === 'gmaps') {
      setPlatformToConnect(platform);
      setIsOAuthModalOpen(true);
    } else {
      // For other platforms, just toggle on
      setPlatforms(prev =>
        prev.map(p => (p.id === platformId ? { ...p, connected: true } : p))
      );
    }
  };

  const handleOAuthAllow = () => {
    if (!platformToConnect) return;
    setPlatforms(prev =>
      prev.map(p => (p.id === platformToConnect.id ? { ...p, connected: true } : p))
    );
    setIsOAuthModalOpen(false);
    setPlatformToConnect(null);
  };

  const handleOAuthDeny = () => {
    setIsOAuthModalOpen(false);
    setPlatformToConnect(null);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account and application preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <SettingCard title="Profile" description="Update your personal details." icon={User}>
              <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <img src="https://i.pravatar.cc/150?u=manager" alt="Admin" className="w-16 h-16 rounded-full"/>
                      <button className="flex items-center bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-slate-100 hover:border-slate-400">
                          <Upload className="w-4 h-4 mr-2"/>
                          Change Photo
                      </button>
                  </div>
                  <div>
                      <label className="text-sm font-medium text-slate-600">Full Name</label>
                      <input type="text" defaultValue="Alex Doe" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                  </div>
                  <div>
                      <label className="text-sm font-medium text-slate-600">Email Address</label>
                      <input type="email" defaultValue="alex.doe@peoplestay.com" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                  </div>
                  <button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:from-sky-600 hover:to-sky-700 transition-all transform hover:-translate-y-0.5">
                      Update Profile
                  </button>
              </div>
            </SettingCard>
            
            <SettingCard title="Change Password" description="For security, choose a strong password." icon={Lock}>
              <div className="space-y-4">
                  <div>
                      <label className="text-sm font-medium text-slate-600">Current Password</label>
                      <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                  </div>
                  <div>
                      <label className="text-sm font-medium text-slate-600">New Password</label>
                      <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                  </div>
                  <button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:from-sky-600 hover:to-sky-700 transition-all transform hover:-translate-y-0.5">
                      Change Password
                  </button>
              </div>
            </SettingCard>
          </div>
          
          <div className="space-y-8">
              <SettingCard title="Notifications" description="Choose how you want to be notified." icon={Bell}>
                <div className="space-y-2 divide-y divide-slate-200">
                      <LabeledToggleSwitch label="New Bookings" enabled={notifications.bookings} onChange={() => handleNotificationChange('bookings')} />
                      <LabeledToggleSwitch label="Guest Messages" enabled={notifications.messages} onChange={() => handleNotificationChange('messages')} />
                      <LabeledToggleSwitch label="Task Updates" enabled={notifications.tasks} onChange={() => handleNotificationChange('tasks')} />
                      <LabeledToggleSwitch label="Pricing Alerts" enabled={notifications.pricing} onChange={() => handleNotificationChange('pricing')} />
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:from-sky-600 hover:to-sky-700 transition-all transform hover:-translate-y-0.5">
                      Save Preferences
                  </button>
              </SettingCard>

              <SettingCard title="Integrations" description="Connect to other platforms." icon={Briefcase}>
                <div className="space-y-3">
                    {platforms.filter(p => p.connected).map(platform => (
                        <div key={platform.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                                  <platform.icon className="w-5 h-5 text-slate-600" />
                                </div>
                                <p className="font-semibold">{platform.name}</p>
                            </div>
                            <span className="text-sm font-medium text-green-600">Connected</span>
                        </div>
                    ))}
                </div>
                  <button
                    onClick={() => setIntegrationsModalOpen(true)}
                    className="w-full mt-4 border-2 border-dashed border-slate-300 text-slate-600 font-semibold py-2 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors">
                      Manage Integrations
                  </button>
              </SettingCard>
          </div>
        </div>
      </div>
      
      {isIntegrationsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-down" style={{animationDuration: '0.3s'}}>
              <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
                      <h2 className="text-xl font-bold text-slate-800">Connect Platforms</h2>
                      <button onClick={() => setIntegrationsModalOpen(false)} className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-200">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                      <p className="text-slate-600 mb-6 text-sm">Enable integrations to sync data across platforms and automate your workflows. Your changes are saved automatically.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {platforms.map(platform => (
                              <div key={platform.id} className="p-4 bg-white border border-slate-200 rounded-lg flex items-start justify-between">
                                  <div className="flex items-start">
                                      <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center mr-4">
                                          <platform.icon className="w-5 h-5 text-slate-600"/>
                                      </div>
                                      <div>
                                          <p className="font-semibold text-slate-800">{platform.name}</p>
                                          <p className="text-sm text-slate-500">{platform.description}</p>
                                      </div>
                                  </div>
                                  <ToggleSwitch 
                                      enabled={platform.connected}
                                      onChange={() => handlePlatformToggle(platform.id)}
                                  />
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="p-4 border-t bg-white/50 flex-shrink-0 text-right">
                      <button 
                          onClick={() => setIntegrationsModalOpen(false)} 
                          className="bg-sky-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors">
                          Done
                      </button>
                  </div>
              </div>
          </div>
      )}

      {isOAuthModalOpen && platformToConnect && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 animate-fade-in-down" style={{animationDuration: '0.3s'}}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 text-center border-b">
              <h2 className="text-xl font-bold text-slate-800">Connect to {platformToConnect.name}</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
            </div>
            <div className="p-6">
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <img src="https://i.pravatar.cc/150?u=manager" alt="Admin" className="w-10 h-10 rounded-full mr-3"/>
                  <div>
                    <p className="font-semibold">Alex Doe</p>
                    <p className="text-sm text-slate-500">alex.doe@peoplestay.com</p>
                  </div>
                </div>
                <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-slate-600 font-medium">Peoplestay is requesting permission to:</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-500">
                  <li className="flex items-start">
                    <ShieldCheck className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>
                      {platformToConnect.id === 'gcal' 
                        ? 'View, edit, and manage your calendars' 
                        : 'View your Google Maps data'}
                    </span>
                  </li>
                   <li className="flex items-start">
                    <ShieldCheck className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Associate you with your personal info on Google</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-400 mt-4">By clicking Allow, you allow this app to use your information in accordance with its terms of service and privacy policy.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
              <button onClick={handleOAuthDeny} className="font-semibold text-slate-600 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                Deny
              </button>
              <button onClick={handleOAuthAllow} className="bg-sky-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors">
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;