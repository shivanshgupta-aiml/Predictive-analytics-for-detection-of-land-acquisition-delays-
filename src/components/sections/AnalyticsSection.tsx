import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, TrendingDown, AlertCircle } from 'lucide-react';

const ALL_DATA = {
  '6M': {
    causes: [
      { name: 'Litigation', count: 42 },
      { name: 'Compensation', count: 38 },
      { name: 'Survey Gap', count: 24 },
      { name: 'R&R Issues', count: 18 },
    ],
    trend: [
      { month: 'Jan', actual: 4, predicted: 4 },
      { month: 'Feb', actual: 5, predicted: 6 },
      { month: 'Mar', actual: 8, predicted: 7 },
      { month: 'Apr', actual: 12, predicted: 10 },
      { month: 'May', actual: 15, predicted: 14 },
      { month: 'Jun', actual: 22, predicted: 24 },
    ],
    stats: { total: 122, avgDelay: '14 months', trend: '+12%' }
  },
  '1Y': {
    causes: [
      { name: 'Litigation', count: 85 },
      { name: 'Compensation', count: 62 },
      { name: 'Survey Gap', count: 45 },
      { name: 'R&R Issues', count: 38 },
    ],
    trend: [
      { month: 'Jul', actual: 3, predicted: 3 },
      { month: 'Aug', actual: 5, predicted: 4 },
      { month: 'Sep', actual: 7, predicted: 8 },
      { month: 'Oct', actual: 9, predicted: 9 },
      { month: 'Nov', actual: 11, predicted: 12 },
      { month: 'Dec', actual: 14, predicted: 15 },
      { month: 'Jan', actual: 18, predicted: 19 },
      { month: 'Feb', actual: 21, predicted: 20 },
      { month: 'Mar', actual: 25, predicted: 24 },
      { month: 'Apr', actual: 28, predicted: 29 },
      { month: 'May', actual: 32, predicted: 30 },
      { month: 'Jun', actual: 35, predicted: 36 },
    ],
    stats: { total: 230, avgDelay: '11 months', trend: '-5%' }
  },
  'ALL': {
    causes: [
      { name: 'Litigation', count: 210 },
      { name: 'Compensation', count: 145 },
      { name: 'Survey Gap', count: 98 },
      { name: 'R&R Issues', count: 76 },
    ],
    trend: [
      { month: '2021', actual: 40, predicted: 45 },
      { month: '2022', actual: 65, predicted: 60 },
      { month: '2023', actual: 95, predicted: 90 },
      { month: '2024', actual: 140, predicted: 135 },
      { month: '2025', actual: 185, predicted: 190 },
      { month: '2026', actual: 230, predicted: 220 },
    ],
    stats: { total: 529, avgDelay: '16 months', trend: '+22%' }
  }
};

export const AnalyticsSection = () => {
  const [timeRange, setTimeRange] = useState<'6M' | '1Y' | 'ALL'>('6M');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const currentData = ALL_DATA[timeRange];

  return (
    <section className="py-20 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Interactive Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-text-main mb-4">Analytics & Insights</h2>
            <p className="text-text-muted text-lg">System-wide patterns across all monitored corridors.</p>
          </div>
          
          <div className="flex items-center p-1 bg-ink rounded-lg border border-border shadow-inner">
            {(['6M', '1Y', 'ALL'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`relative px-5 py-2 text-sm font-medium rounded-md transition-colors ${timeRange === range ? 'text-primary-light' : 'text-text-muted hover:text-text-main'}`}
              >
                {timeRange === range && (
                  <motion.div
                    layoutId="activeRange"
                    className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-md z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{range === 'ALL' ? 'All Time' : range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <AnimatePresence mode="wait">
             <motion.div 
               key={`stat1-${timeRange}`} 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="bg-ink border border-border p-5 rounded-xl shadow-sm flex items-center gap-4"
             >
               <div className="bg-primary/10 p-3 rounded-lg text-primary">
                 <AlertCircle className="w-6 h-6" />
               </div>
               <div>
                 <div className="text-xs text-text-muted mb-1 font-mono uppercase tracking-wider">Issues Tracked</div>
                 <div className="text-2xl font-bold text-text-main">{currentData.stats.total}</div>
               </div>
             </motion.div>
             
             <motion.div 
               key={`stat2-${timeRange}`} 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2, delay: 0.05 }}
               className="bg-ink border border-border p-5 rounded-xl shadow-sm flex items-center gap-4"
             >
               <div className="bg-risk-high/10 p-3 rounded-lg text-risk-high">
                 <TrendingDown className="w-6 h-6" />
               </div>
               <div>
                 <div className="text-xs text-text-muted mb-1 font-mono uppercase tracking-wider">Avg Delay</div>
                 <div className="flex items-baseline gap-2">
                   <div className="text-2xl font-bold text-text-main">{currentData.stats.avgDelay}</div>
                   <div className={`text-xs font-mono ${currentData.stats.trend.startsWith('+') ? 'text-risk-high' : 'text-risk-low'}`}>
                     {currentData.stats.trend}
                   </div>
                 </div>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Chart 1: Delay Causes */}
          <div className="bg-ink border border-border rounded-xl p-6 group transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-sans text-lg font-semibold text-text-main">Primary Causes of Delay</h3>
               <Filter className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData.causes} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} horizontal={false} />
                  <XAxis type="number" stroke="#8B93A7" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#8B93A7" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(110, 86, 207, 0.1)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-ink border border-border p-3 rounded-lg shadow-xl backdrop-blur-md bg-opacity-90">
                            <p className="text-text-main font-semibold mb-1">{label}</p>
                            <p className="text-primary font-mono text-sm">{payload[0].value} occurrences</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[0, 4, 4, 0]} 
                    barSize={24} 
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {currentData.causes.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={activeIndex === index ? '#8A73EA' : '#6E56CF'} 
                        className="transition-colors duration-300 cursor-pointer" 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Predicted vs Actual */}
          <div className="bg-ink border border-border rounded-xl p-6 transition-all duration-300 hover:border-border-hover hover:shadow-lg">
            <h3 className="font-sans text-lg font-semibold text-text-main mb-6">Predicted vs Actual Timelines</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData.trend} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} vertical={false} />
                  <XAxis dataKey="month" stroke="#8B93A7" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8B93A7" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                     content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-ink border border-border p-3 rounded-lg shadow-xl backdrop-blur-md bg-opacity-90">
                            <p className="text-text-main font-semibold mb-2">{label}</p>
                            {payload.map((entry, index) => (
                               <div key={index} className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                  <span className="text-text-muted text-sm">{entry.name}:</span>
                                  <span className="text-text-main font-mono text-sm ml-auto">{entry.value}</span>
                               </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#e0a036" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#1e1e2a', strokeWidth: 2 }} 
                    activeDot={{ r: 6, fill: '#e0a036', strokeWidth: 0 }} 
                    name="Predicted Delay" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#d8585c" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#1e1e2a', strokeWidth: 2 }} 
                    activeDot={{ r: 6, fill: '#d8585c', strokeWidth: 0 }} 
                    name="Actual Delay" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-6 justify-center text-xs font-mono text-text-muted">
              <div className="flex items-center gap-2 cursor-pointer hover:text-text-main transition-colors">
                <div className="w-3 h-3 rounded-full bg-risk-medium"></div> Predicted
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-text-main transition-colors">
                <div className="w-3 h-3 rounded-full bg-risk-high"></div> Actual
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
