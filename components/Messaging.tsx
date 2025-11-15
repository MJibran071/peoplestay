import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { mockMessageThreads } from '../constants';
import type { MessageThread } from '../types';
import { generateGuestResponse } from '../services/geminiService';

const Messaging: React.FC = () => {
  const [threads, setThreads] = useState<MessageThread[]>(mockMessageThreads);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(threads[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.messages]);

  const handleSendMessage = async () => {
    if (!selectedThread) return;
    
    setIsTyping(true);
    const guestQuery = newMessage.trim();
    if (guestQuery === '') return;
    
    const guestMessage = {
      id: `m${Date.now()}`,
      sender: 'guest' as 'guest',
      text: guestQuery,
      timestamp: 'Just now'
    };

    // Optimistically update UI
    const updatedMessages = [...(selectedThread.messages || []), guestMessage];
    const updatedThread = { ...selectedThread, messages: updatedMessages };
    setSelectedThread(updatedThread);
    setNewMessage('');

    try {
      const aiResponse = await generateGuestResponse(guestQuery, selectedThread.property);
      const hostMessage = {
        id: `m${Date.now() + 1}`,
        sender: 'host' as 'host',
        text: aiResponse,
        timestamp: 'Just now'
      };
      
      const finalMessages = [...updatedMessages, hostMessage];
      const finalThread = { ...selectedThread, messages: finalMessages, lastMessage: aiResponse.substring(0,30) + "..." };
      setSelectedThread(finalThread);

      // Update the main threads list
      setThreads(threads.map(t => t.id === finalThread.id ? finalThread : t));

    } catch (error) {
      console.error("Failed to get AI response", error);
      // Handle error in UI if needed
    } finally {
      setIsTyping(false);
    }
  };

  if (!selectedThread) {
    return (
        <div className="flex h-full items-center justify-center bg-white rounded-2xl shadow-md">
            <p className="text-slate-500">Select a conversation to start messaging.</p>
        </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Threads List */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-4 cursor-pointer border-l-4 ${
                selectedThread?.id === thread.id
                  ? 'bg-sky-100/50 border-sky-500'
                  : 'border-transparent hover:bg-zinc-100/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <img src={thread.avatarUrl} alt={thread.guestName} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <p className="font-semibold">{thread.guestName}</p>
                        <p className="text-sm text-slate-500">{thread.property}</p>
                    </div>
                </div>
                {thread.unread && <span className="w-2.5 h-2.5 bg-sky-500 rounded-full mt-1"></span>}
              </div>
              <p className="text-sm text-slate-600 mt-2 truncate">{thread.lastMessage}</p>
              <p className="text-xs text-slate-400 text-right mt-1">{thread.timestamp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center">
            <img src={selectedThread.avatarUrl} alt={selectedThread.guestName} className="w-10 h-10 rounded-full mr-3" />
            <div>
                <h3 className="text-lg font-bold">{selectedThread.guestName}</h3>
                <p className="text-sm text-slate-500">{selectedThread.property}</p>
            </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-50">
          {selectedThread.messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 my-4 ${msg.sender === 'host' ? 'justify-end' : ''}`}>
                {msg.sender === 'guest' && <User className="w-6 h-6 text-slate-400 rounded-full bg-slate-200 p-1" />}
                <div className={`max-w-md p-3 rounded-2xl ${
                    msg.sender === 'host'
                    ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-br-none shadow-lg'
                    : 'bg-white text-slate-800 rounded-bl-none shadow-md'
                }`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'host' ? 'text-sky-200' : 'text-slate-400'} text-right`}>{msg.timestamp}</p>
                </div>
                {msg.sender === 'host' && <Bot className="w-6 h-6 text-white rounded-full bg-gradient-to-br from-sky-500 to-sky-600 p-1" />}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-end gap-2 my-4 justify-end">
              <div className="max-w-md p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-br-none shadow-lg">
                <div className="flex items-center justify-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                </div>
              </div>
              <Bot className="w-6 h-6 text-white rounded-full bg-gradient-to-br from-sky-500 to-sky-600 p-1" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2">Simulate guest message and get an AI-generated host response.</p>
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
              placeholder="Type guest's message here..."
              className="w-full pl-4 pr-12 py-3 rounded-full bg-zinc-100 border border-transparent focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !newMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 disabled:bg-slate-300 transition-all transform hover:scale-110"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;