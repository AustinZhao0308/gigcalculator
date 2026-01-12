import React from 'react';
import { EventState, TicketTier, TicketType, Venue } from '../types';
import { Card, CardHeader } from './ui/Card';
import { Input, Label } from './ui/Input';
import { Building2, Ticket, Plus, Trash2, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  venue: Venue;
  tickets: TicketTier[];
  days: number;
  onVenueChange: (v: Venue) => void;
  onTicketsChange: (t: TicketTier[]) => void;
  onDaysChange: (d: number) => void;
}

export const VenueAndTickets: React.FC<Props> = ({ venue, tickets, days, onVenueChange, onTicketsChange, onDaysChange }) => {
  const { t, language } = useLanguage();
  
  const addTicket = () => {
    const newTicket: TicketTier = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Early Bird',
      price: 100,
      totalAllocation: 100,
      expectedSales: 80,
      isMultiDay: false,
      validDays: [0] // Default to Day 1
    };
    onTicketsChange([...tickets, newTicket]);
  };

  const updateTicket = (id: string, updates: Partial<TicketTier>) => {
    onTicketsChange(tickets.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTicket = (id: string) => {
    onTicketsChange(tickets.filter(t => t.id !== id));
  };

  const toggleDayValidity = (ticketId: string, dayIdx: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    let newDays = ticket.validDays.includes(dayIdx)
      ? ticket.validDays.filter(d => d !== dayIdx)
      : [...ticket.validDays, dayIdx];
    
    // Sort logic
    newDays.sort((a,b) => a-b);

    updateTicket(ticketId, { validDays: newDays, isMultiDay: newDays.length > 1 });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Venue Column */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Building2 className="text-indigo-400" /> {t.venueSetup}</h2>
        <Card>
          <div className="space-y-4">
             <div>
                <Label>{t.eventDuration}</Label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(d => (
                        <button
                            key={d}
                            onClick={() => onDaysChange(d)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${days === d ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
             </div>
            <div className="h-px bg-slate-800 my-4" />
            <Input 
              label={t.venueName}
              value={venue.name} 
              onChange={e => onVenueChange({...venue, name: e.target.value})} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label={t.capacity}
                type="number"
                value={venue.capacity} 
                onChange={e => onVenueChange({...venue, capacity: parseInt(e.target.value) || 0})} 
              />
               <Input 
                label={`${t.baseFee} ¥`}
                type="number"
                value={venue.baseFee} 
                onChange={e => onVenueChange({...venue, baseFee: parseFloat(e.target.value) || 0})} 
              />
            </div>
            
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
               <div className="flex items-center gap-2 mb-4">
                 <input 
                    type="checkbox" 
                    id="revShare"
                    checked={venue.hasRevenueShare}
                    onChange={e => onVenueChange({...venue, hasRevenueShare: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-slate-700"
                 />
                 <Label><span className="ml-1 cursor-pointer" onClick={() => onVenueChange({...venue, hasRevenueShare: !venue.hasRevenueShare})}>{t.enableRevShare}</span></Label>
               </div>
               
               {venue.hasRevenueShare && (
                 <div className="animate-in fade-in slide-in-from-top-2">
                   <p className="text-xs text-slate-400 mb-3">
                     {t.revShareHelp}
                   </p>
                   <Input 
                      label={t.venueSplit}
                      type="number"
                      value={venue.revenueSharePercent} 
                      onChange={e => onVenueChange({...venue, revenueSharePercent: parseFloat(e.target.value) || 0})} 
                    />
                 </div>
               )}
            </div>

             <Input 
                label={`${t.barRevenue} ¥`}
                type="number"
                value={venue.drinksCut} 
                onChange={e => onVenueChange({...venue, drinksCut: parseFloat(e.target.value) || 0})} 
              />
          </div>
        </Card>
      </div>

      {/* Tickets Column */}
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2"><Ticket className="text-pink-400" /> {t.ticketingStrategy}</h2>
            <button onClick={addTicket} className="text-sm bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                <Plus size={16} /> {t.addTicket}
            </button>
         </div>

         <div className="space-y-4">
            {tickets.map(ticket => (
                <Card key={ticket.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 mr-4">
                            <Input 
                                placeholder={t.ticketName}
                                className="font-bold text-lg bg-transparent border-transparent px-0 py-0 h-auto focus:ring-0 focus:border-slate-700 hover:border-slate-800 border-b"
                                value={ticket.name}
                                onChange={e => updateTicket(ticket.id, { name: e.target.value })}
                            />
                        </div>
                        <button onClick={() => removeTicket(ticket.id)} className="text-slate-600 hover:text-rose-500">
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                         <Input 
                            label={`${t.price} ¥`}
                            type="number"
                            value={ticket.price} 
                            onChange={e => updateTicket(ticket.id, { price: parseFloat(e.target.value) || 0 })} 
                        />
                         <Input 
                            label={t.totalSupply}
                            type="number"
                            value={ticket.totalAllocation} 
                            onChange={e => updateTicket(ticket.id, { totalAllocation: parseInt(e.target.value) || 0 })} 
                        />
                         <Input 
                            label={t.expectedSales}
                            type="number"
                            value={ticket.expectedSales} 
                            onChange={e => updateTicket(ticket.id, { expectedSales: parseInt(e.target.value) || 0 })} 
                        />
                    </div>

                    {days > 1 && (
                        <div className="bg-slate-800/50 p-3 rounded">
                            <Label>{t.validDays}:</Label>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {Array.from({length: days}).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => toggleDayValidity(ticket.id, idx)}
                                        className={`px-3 py-1 rounded text-xs border ${ticket.validDays.includes(idx) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                    >
                                        {language === 'zh' ? `${t.day} ${idx + 1} 天` : `${t.day} ${idx + 1}`}
                                    </button>
                                ))}
                            </div>
                            {ticket.isMultiDay && <p className="text-xs text-indigo-300 mt-2">{t.multiDayActive}</p>}
                        </div>
                    )}
                </Card>
            ))}
            {tickets.length === 0 && (
                 <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                    {t.noTickets}
                  </div>
            )}
         </div>
      </div>
    </div>
  );
};