import React, { useState } from 'react';
import { Wand2, Loader2, Mail, Copy } from 'lucide-react';
import { mockLeads } from '../constants';
import type { Lead } from '../types';
import { generateLeadFollowUp } from '../services/geminiService';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [followUpEmail, setFollowUpEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateFollowUp = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsLoading(true);
    setFollowUpEmail('');
    try {
      const emailText = await generateLeadFollowUp(lead);
      setFollowUpEmail(emailText);
    } catch (error) {
      setFollowUpEmail("Sorry, couldn't generate an email at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(followUpEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-yellow-100 text-yellow-700';
      case 'Converted': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Client Leads</h1>
        <p className="text-slate-500 mb-6">Manage and convert your prospective clients.</p>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Inquiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-100/50">
                  <td className="py-3 px-4 font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-slate-600">{lead.source}</td>
                  <td className="py-3 px-4 text-slate-600">{lead.inquiryDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleGenerateFollowUp(lead)}
                      className="text-sky-600 hover:text-sky-800 font-semibold text-sm flex items-center justify-end w-full"
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Follow-up
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4">AI-Generated Follow-up</h2>
        {selectedLead && (
            <div className="mb-4 p-3 bg-zinc-100 rounded-lg">
                <p className="font-semibold">{selectedLead.name}</p>
                <p className="text-sm text-slate-500">{selectedLead.email}</p>
            </div>
        )}
        <div className="flex-1 bg-zinc-50 rounded-lg p-4 overflow-y-auto border border-slate-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Generating email...</p>
            </div>
          ) : followUpEmail ? (
            <div className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{followUpEmail}</div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
              <Mail className="w-10 h-10 mb-2" />
              <p>Select a lead to generate a personalized follow-up email.</p>
            </div>
          )}
        </div>
        {followUpEmail && !isLoading && (
            <div className="mt-4 flex gap-2">
                <button
                    onClick={handleCopy}
                    className="w-full bg-slate-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <button className="w-full bg-sky-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors">
                    Send Email
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Leads;