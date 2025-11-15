import React, { useState } from 'react';
import { Bot, Zap, PlusCircle, ArrowRight, X } from 'lucide-react';
import { mockAutomations, triggerDetails, actionDetails } from '../constants';
import type { Automation, TriggerType, ActionType } from '../types';

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onChange(!enabled); }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-sky-500' : 'bg-slate-300'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const Automations: React.FC = () => {
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = (id: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
  };

  const handleAddAutomation = (newAutomationData: Omit<Automation, 'id' | 'enabled' | 'lastTriggered'>) => {
    const newAutomation: Automation = {
      ...newAutomationData,
      id: `auto-${Date.now()}`,
      enabled: true,
      lastTriggered: null,
    };
    setAutomations(prev => [newAutomation, ...prev]);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Automations</h1>
                <p className="text-slate-500 mt-1">Build workflows to automate your repetitive tasks.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:shadow-lg hover:from-sky-600 hover:to-sky-700 transition-all transform hover:-translate-y-0.5"
            >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Automation
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map(auto => (
                <div key={auto.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transform transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-slate-800">{auto.name}</h3>
                            <ToggleSwitch enabled={auto.enabled} onChange={() => handleToggle(auto.id)} />
                        </div>
                        <p className="text-sm text-slate-500 mb-4 h-10">{auto.description}</p>
                        <div className="flex items-center justify-center space-x-2 my-4">
                            <div className="text-center p-3 bg-slate-100 rounded-lg w-1/2 border border-slate-200">
                                <p className="text-xs text-slate-500 font-semibold uppercase">Trigger</p>
                                <p className="text-sm font-medium">{triggerDetails[auto.trigger].name}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <div className="text-center p-3 bg-slate-100 rounded-lg w-1/2 border border-slate-200">
                                <p className="text-xs text-slate-500 font-semibold uppercase">Action</p>
                                <p className="text-sm font-medium">{actionDetails[auto.action].name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 border-t pt-3 mt-4">
                        {auto.lastTriggered ? `Last triggered: ${auto.lastTriggered}` : 'Never triggered'}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
          <AutomationCreatorModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleAddAutomation} 
          />
      )}
    </>
  );
};

interface AutomationCreatorModalProps {
    onClose: () => void;
    onSave: (automationData: Omit<Automation, 'id' | 'enabled' | 'lastTriggered'>) => void;
}

const AutomationCreatorModal: React.FC<AutomationCreatorModalProps> = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
    const [automationName, setAutomationName] = useState('');
    const [automationDescription, setAutomationDescription] = useState('');

    const handleTriggerSelect = (trigger: TriggerType) => {
        setSelectedTrigger(trigger);
    };

    const handleActionSelect = (action: ActionType) => {
        setSelectedAction(action);
    };
    
    const handleNext = () => {
        if (step === 2 && selectedTrigger && selectedAction) {
             setAutomationName(`When ${triggerDetails[selectedTrigger].name}, then ${actionDetails[selectedAction].name}`);
        }
        setStep(prev => prev + 1);
    }

    const handleSave = () => {
        if (!selectedTrigger || !selectedAction || !automationName) return;
        onSave({
            name: automationName,
            description: automationDescription,
            trigger: selectedTrigger,
            action: selectedAction,
        });
        onClose();
    };

    const isNextDisabled = () => {
        if (step === 1 && !selectedTrigger) return true;
        if (step === 2 && !selectedAction) return true;
        return false;
    };
    
    const SelectionCard: React.FC<{
      title: string;
      description: string;
      isSelected: boolean;
      onClick: () => void;
    }> = ({ title, description, isSelected, onClick }) => (
      <div 
        onClick={onClick} 
        className={`p-4 bg-white border rounded-lg hover:border-sky-500 hover:shadow-md cursor-pointer transition-all ${isSelected ? 'border-sky-500 ring-2 ring-sky-500/50 shadow-lg' : 'border-slate-200'}`}
      >
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-down" style={{animationDuration: '0.3s'}}>
            <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Create New Automation</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        {([1, 2, 3] as const).map((s, index, arr) => (
                          <React.Fragment key={s}>
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step >= s ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{s}</div>
                                <p className={`ml-2 font-semibold transition-colors ${step >= s ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {s === 1 ? 'Trigger' : s === 2 ? 'Action' : 'Configure'}
                                </p>
                            </div>
                            {index < arr.length - 1 && <div className={`flex-1 h-0.5 mx-4 transition-colors ${step > s ? 'bg-sky-500' : 'bg-slate-200'}`}></div>}
                          </React.Fragment>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div>
                        {step === 1 && (
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-4">When this happens...</h3>
                                <div className="space-y-3">
                                    {Object.entries(triggerDetails).map(([key, value]) => (
                                        <SelectionCard 
                                          key={key} 
                                          title={value.name}
                                          description={value.description}
                                          isSelected={selectedTrigger === key}
                                          onClick={() => handleTriggerSelect(key as TriggerType)} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                         {step === 2 && (
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-4">...do this automatically</h3>
                                 <div className="space-y-3">
                                    {Object.entries(actionDetails).map(([key, value]) => (
                                       <SelectionCard 
                                          key={key} 
                                          title={value.name}
                                          description={value.description}
                                          isSelected={selectedAction === key}
                                          onClick={() => handleActionSelect(key as ActionType)} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div>
                                <h3 className="text-lg font-semibold text-center mb-4">Finalize your Automation</h3>
                                <div className="space-y-4 p-4 bg-white rounded-lg border">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Automation Name</label>
                                        <input type="text" value={automationName} onChange={e => setAutomationName(e.target.value)} placeholder="e.g., Post-Checkout Cleaning" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">Description (Optional)</label>
                                        <textarea value={automationDescription} onChange={e => setAutomationDescription(e.target.value)} placeholder="Describe what this automation does" rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <div className="p-4 border-t bg-white/50 flex justify-between items-center">
                    <button 
                        onClick={() => setStep(prev => Math.max(1, prev - 1))}
                        disabled={step === 1}
                        className="font-semibold text-slate-600 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Back
                    </button>
                    {step < 3 ? (
                      <button 
                          onClick={handleNext}
                          disabled={isNextDisabled()}
                          className="bg-sky-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                          Next
                      </button>
                    ) : (
                      <button 
                          onClick={handleSave}
                          disabled={!automationName}
                          className="bg-sky-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                          Save Automation
                      </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Automations;