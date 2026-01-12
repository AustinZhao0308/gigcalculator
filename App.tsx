import React, { useState } from 'react';
import { EventState, INITIAL_STATE, Venue, TicketTier, Band } from './types';
import { Dashboard } from './components/Dashboard';
import { BandManager } from './components/BandManager';
import { VenueAndTickets } from './components/VenueAndTickets';
import { ExpensesAndSchedule } from './components/ExpensesAndSchedule';
import { LayoutDashboard, Users, MapPin, CalendarClock, Menu, X, Download, Upload, Globe } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent = () => {
  const { t, language, setLanguage } = useLanguage();
  const [state, setState] = useState<EventState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TABS = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'venue', label: t.navVenue, icon: MapPin },
    { id: 'bands', label: t.navBands, icon: Users },
    { id: 'schedule', label: t.navSchedule, icon: CalendarClock },
  ];

  const updateState = (updates: Partial<EventState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Export state as JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import state from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target?.result as string);
        setState(importedState);
        alert(t.importSuccess || 'Event data imported successfully!');
      } catch (error) {
        alert(t.importError || 'Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} />;
      case 'venue':
        return (
          <VenueAndTickets 
            venue={state.venue} 
            tickets={state.tickets}
            days={state.days}
            onVenueChange={(v: Venue) => updateState({ venue: v })}
            onTicketsChange={(t: TicketTier[]) => updateState({ tickets: t })}
            onDaysChange={(d: number) => updateState({ days: d })}
          />
        );
      case 'bands':
        return (
          <BandManager 
            bands={state.bands} 
            onChange={(b: Band[]) => updateState({ bands: b })} 
          />
        );
      case 'schedule':
        return (
          <ExpensesAndSchedule 
            state={state} 
            onUpdate={updateState} 
          />
        );
      default:
        return <Dashboard state={state} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
          GigCalculator
        </h1>
        <div className="flex gap-4">
           <button 
             onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
             className="text-slate-400 hover:text-white"
           >
             {language.toUpperCase()}
           </button>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
           </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed inset-0 z-40 bg-slate-900/95 md:bg-slate-900 md:static md:w-64 border-r border-slate-800 
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="hidden md:block font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              GigCalculator
            </h1>
            <button 
               onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
               className="hidden md:flex text-xs font-bold bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 items-center gap-1 transition-colors"
               title="Switch Language"
            >
               <Globe size={12} />
               {language.toUpperCase()}
            </button>
          </div>
          <p className="hidden md:block text-xs text-slate-500 mb-8">{t.subtitle}</p>
          
          <div className="space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
           <div className="text-xs text-slate-500 mb-2">{t.currentEvent}</div>
           <input 
             className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 outline-none"
             value={state.title}
             onChange={(e) => updateState({ title: e.target.value })}
           />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto bg-slate-950 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
                title={t.exportTooltip || 'Export event data'}
              >
                <Download size={14} /> {t.export || 'Export'}
              </button>
              <label className="flex items-center gap-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors border border-slate-700 cursor-pointer"
                title={t.importTooltip || 'Import event data'}
              >
                <Upload size={14} /> {t.import || 'Import'}
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImport} 
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}