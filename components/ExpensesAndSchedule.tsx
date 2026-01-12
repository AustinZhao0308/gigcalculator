import React from 'react';
import { Band, EventState, MerchItem, ScheduledSet } from '../types';
import { Card, CardHeader } from './ui/Card';
import { Input, Label } from './ui/Input';
import { ShoppingBag, Clock, Plus, Trash2, CalendarDays } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  state: EventState;
  onUpdate: (updates: Partial<EventState>) => void;
}

export const ExpensesAndSchedule: React.FC<Props> = ({ state, onUpdate }) => {
  const { t } = useLanguage();

  // --- Merch Handlers ---
  const addMerch = () => {
    const item: MerchItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Band T-Shirt',
      unitCost: 30,
      sellingPrice: 100,
      quantityOrdered: 50,
      expectedSales: 40
    };
    onUpdate({ merch: [...state.merch, item] });
  };
  
  const updateMerch = (id: string, updates: Partial<MerchItem>) => {
    onUpdate({ merch: state.merch.map(m => m.id === id ? { ...m, ...updates } : m) });
  };

  const removeMerch = (id: string) => {
    onUpdate({ merch: state.merch.filter(m => m.id !== id) });
  };

  // --- Misc Cost Handlers ---
  const addMisc = () => {
    onUpdate({ otherCosts: [...state.otherCosts, { name: 'New Expense', cost: 0 }] });
  };

  const updateMisc = (index: number, updates: { name?: string; cost?: number }) => {
    const newCosts = [...state.otherCosts];
    newCosts[index] = { ...newCosts[index], ...updates };
    onUpdate({ otherCosts: newCosts });
  };

  const removeMisc = (index: number) => {
    onUpdate({ otherCosts: state.otherCosts.filter((_, i) => i !== index) });
  };

  // --- Schedule Handlers ---
  const addToSchedule = (bandId: string, dayIndex: number) => {
    const newSet: ScheduledSet = {
      id: Math.random().toString(36).substr(2, 9),
      bandId,
      dayIndex,
      startTime: '20:00',
      endTime: '20:45'
    };
    onUpdate({ schedule: [...state.schedule, newSet] });
  };

  const updateSet = (setId: string, updates: Partial<ScheduledSet>) => {
    onUpdate({ schedule: state.schedule.map(s => s.id === setId ? { ...s, ...updates } : s) });
  };

  const removeSet = (setId: string) => {
    onUpdate({ schedule: state.schedule.filter(s => s.id !== setId) });
  };

  const getBandName = (id: string) => state.bands.find(b => b.id === id)?.name || 'Unknown Band';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* Column 1: Other Costs & Merch */}
      <div className="space-y-6">
        
        {/* Misc Costs */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-slate-200">{t.productionMarketing}</h3>
             <button onClick={addMisc} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><Plus size={14}/> {t.addItem}</button>
          </div>
          <Card>
            {state.otherCosts.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input 
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white flex-1"
                  value={item.name}
                  onChange={(e) => updateMisc(idx, { name: e.target.value })}
                  placeholder={t.expenseName}
                />
                 <input 
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white w-24"
                  type="number"
                  value={item.cost}
                  onChange={(e) => updateMisc(idx, { cost: parseFloat(e.target.value) || 0 })}
                  placeholder={t.cost}
                />
                <button onClick={() => removeMisc(idx)} className="text-slate-600 hover:text-rose-500"><Trash2 size={16}/></button>
              </div>
            ))}
             <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-sm">
                <span className="text-slate-400">{t.totalMisc}</span>
                <span className="font-mono text-white">¥{state.otherCosts.reduce((a, b) => a + b.cost, 0).toLocaleString()}</span>
             </div>
          </Card>
        </section>

        {/* Merch */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2"><ShoppingBag className="text-emerald-400" size={20}/> {t.merchandise}</h3>
             <button onClick={addMerch} className="text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-2 py-1 rounded border border-emerald-600/30 flex items-center gap-1 transition-colors">
               <Plus size={14}/> {t.addProduct}
             </button>
          </div>
          {state.merch.map(item => (
            <Card key={item.id} className="mb-4 relative">
               <button onClick={() => removeMerch(item.id)} className="absolute top-3 right-3 text-slate-600 hover:text-rose-500"><Trash2 size={16}/></button>
               <Input 
                 className="mb-3 font-medium bg-transparent border-transparent px-0 -ml-1 hover:border-slate-700 focus:bg-slate-800 focus:px-2" 
                 value={item.name} 
                 onChange={e => updateMerch(item.id, {name: e.target.value})}
               />
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Input label={t.unitCost} type="number" value={item.unitCost} onChange={e => updateMerch(item.id, {unitCost: parseFloat(e.target.value)||0})} />
                  <Input label={t.sellPrice} type="number" value={item.sellingPrice} onChange={e => updateMerch(item.id, {sellingPrice: parseFloat(e.target.value)||0})} />
                  <Input label={t.qtyMade} type="number" value={item.quantityOrdered} onChange={e => updateMerch(item.id, {quantityOrdered: parseInt(e.target.value)||0})} />
                  <Input label={t.expectedSales} type="number" value={item.expectedSales} onChange={e => updateMerch(item.id, {expectedSales: parseInt(e.target.value)||0})} />
               </div>
               <div className="mt-3 text-xs text-right text-slate-400">
                  {t.potentialProfit}: <span className="text-emerald-400">¥{((item.sellingPrice * item.expectedSales) - (item.unitCost * item.quantityOrdered)).toLocaleString()}</span>
               </div>
            </Card>
          ))}
        </section>

      </div>

      {/* Column 2: Schedule */}
      <div className="space-y-6">
        <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2"><Clock className="text-indigo-400" size={20}/> {t.runOfShow}</h3>
        
        {Array.from({length: state.days}).map((_, dayIdx) => (
          <Card key={dayIdx} className="border-indigo-500/20">
             <CardHeader title={t.scheduleFor(dayIdx + 1)} />
             
             {/* Timeline */}
             <div className="space-y-2 relative pl-4 border-l-2 border-slate-800 ml-2">
                {state.schedule
                  .filter(s => s.dayIndex === dayIdx)
                  .sort((a,b) => a.startTime.localeCompare(b.startTime))
                  .map(set => (
                    <div key={set.id} className="bg-slate-800 p-3 rounded-lg relative group">
                        <button onClick={() => removeSet(set.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                        <div className="font-bold text-indigo-300">{getBandName(set.bandId)}</div>
                        <div className="flex gap-2 mt-2">
                           <input 
                              type="time" 
                              className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-300"
                              value={set.startTime}
                              onChange={e => updateSet(set.id, { startTime: e.target.value })}
                           />
                           <span className="text-slate-500 text-sm">-</span>
                           <input 
                              type="time" 
                              className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-300"
                              value={set.endTime}
                              onChange={e => updateSet(set.id, { endTime: e.target.value })}
                           />
                        </div>
                    </div>
                  ))}
             </div>

             {/* Add Button */}
             <div className="mt-4 pt-4 border-t border-slate-800">
                <Label>{t.addPerformance}:</Label>
                <div className="flex gap-2 mt-2">
                  <select 
                     id={`add-band-day-${dayIdx}`}
                     className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white flex-1"
                  >
                     <option value="">{t.selectBand}</option>
                     {state.bands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <button 
                    onClick={() => {
                       const select = document.getElementById(`add-band-day-${dayIdx}`) as HTMLSelectElement;
                       if (select.value) {
                         addToSchedule(select.value, dayIdx);
                         select.value = '';
                       }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    {t.add}
                  </button>
                </div>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};