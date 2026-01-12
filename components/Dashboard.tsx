import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { EventState } from '../types';
import { calculateFinancials, checkCapacityIssues } from '../services/calculator';
import { Card, CardHeader } from './ui/Card';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  state: EventState;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316'];

export const Dashboard: React.FC<Props> = ({ state }) => {
  const { t } = useLanguage();
  const { revenue, costs, netProfit } = calculateFinancials(state);
  const warnings = checkCapacityIssues(state);

  const costData = [
    { name: 'Venue', value: costs.venue },
    { name: 'Bands', value: costs.bands },
    { name: 'Travel', value: costs.travel },
    { name: 'Merch Prod', value: costs.merchProd },
    { name: 'Marketing/Misc', value: costs.misc },
  ].filter(d => d.value > 0);

  const profitMargin = revenue.total > 0 ? ((netProfit / revenue.total) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{t.totalRevenue}</p>
              <h2 className="text-2xl font-bold text-white">¥{revenue.total.toLocaleString()}</h2>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-rose-900/40 to-slate-900 border-rose-500/30">
           <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 rounded-lg text-rose-400">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{t.totalCosts}</p>
              <h2 className="text-2xl font-bold text-white">¥{costs.total.toLocaleString()}</h2>
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-br border-opacity-30 ${netProfit >= 0 ? 'from-emerald-900/40 border-emerald-500' : 'from-red-900/40 border-red-500'}`}>
           <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{t.netProfit} ({profitMargin}%)</p>
              <h2 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netProfit >= 0 ? '+' : ''}¥{netProfit.toLocaleString()}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {warnings.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-4 flex gap-3 items-start">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-500 text-sm">{t.capacityWarnings}</h4>
            <ul className="text-sm text-amber-200/80 list-disc list-inside">
              {warnings.map((w, i) => <li key={i}>{t.warningMsg(w.day, w.allocated, w.capacity)}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-96">
          <CardHeader title={t.costBreakdown} subtitle={t.costSubtitle} />
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => `¥${value.toLocaleString()}`}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-96">
          <CardHeader title={t.revenueVsCost} subtitle={t.financialHealth} />
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={[
                { name: 'Financials', Revenue: revenue.total, Cost: costs.total, Profit: netProfit }
              ]}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `¥${v/1000}k`} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" hide />
              <Tooltip 
                 cursor={{fill: '#334155', opacity: 0.4}}
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="Revenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={30} />
              <Bar dataKey="Cost" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={30} />
              <Bar dataKey="Profit" fill="#10b981" radius={[0, 4, 4, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};