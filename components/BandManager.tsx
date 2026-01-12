import React, { useState } from 'react';
import { Band, TravelExpense } from '../types';
import { Card, CardHeader } from './ui/Card';
import { Input, Label } from './ui/Input';
import { Plus, Trash2, User, MapPin, DollarSign, Train, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  bands: Band[];
  onChange: (bands: Band[]) => void;
}

export const BandManager: React.FC<Props> = ({ bands, onChange }) => {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  
  const addBand = () => {
    const newBand: Band = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      genre: '',
      location: '',
      members: 4,
      guaranteeFee: 0,
      travelExpenses: [],
      description: ''
    };
    onChange([...bands, newBand]);
    setIsAdding(true);
  };

  const updateBand = (id: string, updates: Partial<Band>) => {
    onChange(bands.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBand = (id: string) => {
    onChange(bands.filter(b => b.id !== id));
  };

  const addExpense = (bandId: string) => {
    const band = bands.find(b => b.id === bandId);
    if (!band) return;
    const expense: TravelExpense = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Train Ticket',
      cost: 0,
      type: 'Transport'
    };
    updateBand(bandId, { travelExpenses: [...band.travelExpenses, expense] });
  };

  const updateExpense = (bandId: string, expenseId: string, updates: Partial<TravelExpense>) => {
    const band = bands.find(b => b.id === bandId);
    if (!band) return;
    const newExpenses = band.travelExpenses.map(e => e.id === expenseId ? { ...e, ...updates } : e);
    updateBand(bandId, { travelExpenses: newExpenses });
  };

  const removeExpense = (bandId: string, expenseId: string) => {
    const band = bands.find(b => b.id === bandId);
    if (!band) return;
    updateBand(bandId, { travelExpenses: band.travelExpenses.filter(e => e.id !== expenseId) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t.lineupCosts}</h2>
        <button 
          onClick={addBand}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> {t.addBand}
        </button>
      </div>

      <div className="grid gap-6">
        {bands.map((band, index) => (
          <Card key={band.id} className="relative group">
            <button 
              onClick={() => removeBand(band.id)}
              className="absolute top-4 right-4 text-slate-500 hover:text-rose-500 transition-colors p-1"
              title="Remove Band"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-indigo-400 flex items-center gap-2">
                  <User size={18} /> {t.bandDetails}
                </h3>
                <Input 
                  label={t.bandName}
                  value={band.name} 
                  placeholder={t.descPlaceholder}
                  onChange={e => updateBand(band.id, { name: e.target.value })} 
                />
                <div className="flex gap-4">
                  <Input 
                    label={t.members}
                    type="number" 
                    value={band.members} 
                    onChange={e => updateBand(band.id, { members: parseInt(e.target.value) || 0 })} 
                  />
                  <Input 
                    label={t.location}
                    value={band.location} 
                    placeholder="City"
                    onChange={e => updateBand(band.id, { location: e.target.value })} 
                  />
                </div>
                <Input 
                  label={t.description}
                  value={band.description} 
                  onChange={e => updateBand(band.id, { description: e.target.value })} 
                />
              </div>

              <div className="space-y-4 bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                  <DollarSign size={18} /> {t.financials}
                </h3>
                 <Input 
                    label={t.showFee}
                    type="number" 
                    value={band.guaranteeFee} 
                    onChange={e => updateBand(band.id, { guaranteeFee: parseFloat(e.target.value) || 0 })} 
                  />
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>{t.travelExpenses}</Label>
                    <button onClick={() => addExpense(band.id)} className="text-xs text-indigo-400 hover:underline">+ {t.addExpense}</button>
                  </div>
                  
                  {band.travelExpenses.length === 0 && (
                    <p className="text-xs text-slate-500 italic">{t.noTravel}</p>
                  )}

                  <div className="space-y-2">
                    {band.travelExpenses.map(exp => (
                      <div key={exp.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
                        <select 
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white h-9"
                          value={exp.type}
                          onChange={(e) => updateExpense(band.id, exp.id, { type: e.target.value as any })}
                        >
                          <option value="Transport">Transport</option>
                          <option value="Accommodation">Hotel</option>
                          <option value="Per Diem">Food/Per Diem</option>
                        </select>
                        <input 
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white flex-1 h-9"
                          value={exp.name}
                          placeholder="Description"
                          onChange={e => updateExpense(band.id, exp.id, { name: e.target.value })}
                        />
                         <input 
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white w-20 h-9"
                          type="number"
                          placeholder="Cost"
                          value={exp.cost}
                          onChange={e => updateExpense(band.id, exp.id, { cost: parseFloat(e.target.value) || 0 })}
                        />
                        <button onClick={() => removeExpense(band.id, exp.id)} className="text-slate-600 hover:text-rose-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                   <div className="mt-2 text-right text-xs text-slate-400">
                      {t.totalTravel}: <span className="text-slate-200 font-mono">¥{band.travelExpenses.reduce((a,b) => a+b.cost, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {bands.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
            <User size={48} className="mx-auto mb-3 opacity-50" />
            <p>{t.noBands}</p>
          </div>
        )}
      </div>
    </div>
  );
};