import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Loader2 } from 'lucide-react';
import { mockProperties } from '../constants';
import type { Property } from '../types';
import { suggestPricing } from '../services/geminiService';

interface PricingSuggestion {
  suggestedPrice: number;
  confidence: string;
  reasoning: string;
  priceForecast: { day: string; price: number; }[];
}

const Pricing: React.FC = () => {
  const [properties] = useState<Property[]>(mockProperties);
  const [suggestions, setSuggestions] = useState<{ [key: string]: PricingSuggestion | null }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: string | null }>({});

  const handleOptimize = async (property: Property) => {
    setLoading(prev => ({ ...prev, [property.id]: true }));
    setError(prev => ({ ...prev, [property.id]: null }));
    
    // Simulate market context
    const marketContext = `Upcoming holiday weekend, major concert in town, and competing listings have an average occupancy of 90%.`;

    try {
      const result = await suggestPricing(property, marketContext);
      if(result.error) {
        throw new Error(result.error);
      }
      setSuggestions(prev => ({ ...prev, [property.id]: result }));
    } catch (e: any) {
      setError(prev => ({ ...prev, [property.id]: e.message || "An unexpected error occurred." }));
    } finally {
      setLoading(prev => ({ ...prev, [property.id]: false }));
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dynamic Pricing</h1>
        <p className="text-slate-500 mt-1">Optimize your rental rates based on market data.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <img src={prop.imageUrl} alt={prop.name} className="w-full h-48 object-cover"/>
            <div className="p-6">
              <h3 className="text-xl font-bold">{prop.name}</h3>
              <p className="text-sm text-slate-500">{prop.address}</p>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm text-slate-500">Current Price</p>
                  <p className="text-2xl font-bold text-sky-600">${prop.currentPrice}<span className="text-sm font-normal text-slate-500">/night</span></p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 text-right">Occupancy</p>
                  <p className="text-2xl font-bold text-slate-800">{prop.occupancy}%</p>
                </div>
              </div>
              <button
                onClick={() => handleOptimize(prop)}
                disabled={loading[prop.id]}
                className="w-full mt-6 bg-sky-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-all disabled:bg-slate-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading[prop.id] ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Zap className="w-5 h-5 mr-2" />
                )}
                {loading[prop.id] ? 'Optimizing...' : 'Optimize Pricing'}
              </button>
            </div>
            {suggestions[prop.id] && (
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <h4 className="font-semibold mb-2">AI Suggestion:</h4>
                <div className="flex items-baseline mb-2">
                    <p className="text-3xl font-bold text-green-600">${suggestions[prop.id]?.suggestedPrice}</p>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(suggestions[prop.id]?.confidence || '')}`}>{suggestions[prop.id]?.confidence} confidence</span>
                </div>
                <p className="text-sm text-slate-600 mb-4 italic">"{suggestions[prop.id]?.reasoning}"</p>
                <h5 className="font-semibold mb-2 text-sm">7-Day Forecast</h5>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={suggestions[prop.id]?.priceForecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{fontSize: 12}} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', borderColor: '#e2e8f0'}}/>
                    <Line type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {error[prop.id] && (
                <div className="p-6 border-t border-red-200 bg-red-50 text-red-700 text-sm">
                    <strong>Error:</strong> {error[prop.id]}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;