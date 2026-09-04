import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, CheckCircle2, Info, TrendingUp, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getRiskLevel } from '../../data/mockData';
import type { Parcel } from '../../data/mockData';
import { useData } from '../../context/DataContext';

const MapUpdater = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

export const DashboardSection = () => {
  const { parcels } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'map' | 'details'>('list');
  const [flaggedId, setFlaggedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedParcel && parcels.length > 0) {
      setSelectedParcel(parcels[0]);
    }
  }, [parcels, selectedParcel]);

  const filteredParcels = useMemo(() => parcels.filter(p => 
    p.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm, parcels]);

  const stats = useMemo(() => {
    const highRisk = filteredParcels.filter(p => p.riskScore >= 70).length;
    const avgDelay = filteredParcels.length > 0 
      ? Math.round(filteredParcels.reduce((acc, curr) => acc + curr.predictedDelayMonths, 0) / filteredParcels.length)
      : 0;
    return { count: filteredParcels.length, highRisk, avgDelay };
  }, [filteredParcels]);

  const getRiskColor = (score: number) => {
    const level = getRiskLevel(score);
    if (level === 'high') return 'text-risk-high bg-risk-high/10 border-risk-high/30';
    if (level === 'medium') return 'text-risk-medium bg-risk-medium/10 border-risk-medium/30';
    return 'text-risk-low bg-risk-low/10 border-risk-low/30';
  };



  const stages = ['Notification', 'Social Impact Assessment', 'Award', 'Compensation', 'Possession'];

  return (
    <section className="py-20 bg-ink relative" id="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-text-main">Live Dashboard</h2>
            <p className="text-text-muted mt-2">Illustrative sample data for demonstration</p>
          </div>
          
          {/* Dynamic Stats Row */}
          <motion.div layout className="flex gap-4">
            <div className="bg-surface border border-border px-4 py-2 rounded-lg flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-text-muted uppercase font-mono">Tracking</div>
                <div className="font-semibold text-text-main leading-tight">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={stats.count}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block"
                    >
                      {stats.count}
                    </motion.span>
                  </AnimatePresence> Parcels
                </div>
              </div>
            </div>
            <div className="bg-surface border border-risk-high/30 px-4 py-2 rounded-lg flex items-center gap-3 hidden sm:flex">
              <AlertTriangle className="w-5 h-5 text-risk-high" />
              <div>
                <div className="text-xs text-text-muted uppercase font-mono">High Risk</div>
                <div className="font-semibold text-text-main leading-tight">
                   <AnimatePresence mode="popLayout">
                    <motion.span
                      key={stats.highRisk}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block"
                    >
                      {stats.highRisk}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="bg-surface border border-risk-medium/30 px-4 py-2 rounded-lg flex items-center gap-3 hidden md:flex">
              <TrendingUp className="w-5 h-5 text-risk-medium" />
              <div>
                <div className="text-xs text-text-muted uppercase font-mono">Avg Delay</div>
                <div className="font-semibold text-text-main leading-tight">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={stats.avgDelay}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block"
                    >
                      {stats.avgDelay}
                    </motion.span>
                  </AnimatePresence> mo
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:h-[800px]">
          
          {/* Mobile Tabs */}
          <div className="lg:hidden flex rounded-lg bg-surface border border-border p-1 col-span-full">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'list' ? 'bg-ink text-primary shadow-sm border border-border' : 'text-text-muted hover:text-text-main'}`}
              onClick={() => setActiveTab('list')}
            >
              List
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'map' ? 'bg-ink text-primary shadow-sm border border-border' : 'text-text-muted hover:text-text-main'}`}
              onClick={() => setActiveTab('map')}
            >
              Map
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'details' ? 'bg-ink text-primary shadow-sm border border-border' : 'text-text-muted hover:text-text-main'}`}
              onClick={() => setActiveTab('details')}
              disabled={!selectedParcel}
            >
              Details
            </button>
          </div>

          {/* Left Column: Search & List */}
          <div className={`${activeTab === 'list' ? 'flex' : 'hidden'} lg:flex lg:col-span-4 flex-col gap-4 h-[500px] lg:h-full col-span-full`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search by state, district, or project..." 
                className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-text-main placeholder:text-text-muted transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-surface border border-border rounded-xl custom-scrollbar relative">
              {filteredParcels.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-8 text-center text-text-muted text-sm absolute inset-0 flex items-center justify-center"
                >
                  No parcels found matching your criteria.
                </motion.div>
              ) : (
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {filteredParcels.map(parcel => (
                      <motion.button 
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={parcel.id}
                        onClick={() => {
                          setSelectedParcel(parcel);
                          if (window.innerWidth < 1024) setActiveTab('details');
                        }}
                        className={`w-full text-left p-4 hover:bg-ink transition-colors border-b border-border ${selectedParcel?.id === parcel.id ? 'bg-ink border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-sans font-medium text-text-main truncate pr-2">{parcel.name}</span>
                          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${getRiskColor(parcel.riskScore)}`}>
                            {parcel.riskScore}
                          </span>
                        </div>
                        <div className="text-xs text-text-muted flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" /> {parcel.district}, {parcel.state}
                        </div>
                        <div className="text-xs font-mono text-text-muted opacity-75">
                          ID: {parcel.khasraId}
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Map & Details Container */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:h-full col-span-full overflow-hidden">
            
            {/* Interactive Map */}
            <div className={`${activeTab === 'map' ? 'flex' : 'hidden'} lg:flex h-[400px] lg:h-3/5 bg-parchment rounded-xl border border-border relative overflow-hidden mix-blend-luminosity z-0`}>
              <MapContainer 
                center={selectedParcel ? [selectedParcel.coordinates[0], selectedParcel.coordinates[1]] : [22.0, 79.0]} 
                zoom={5} 
                scrollWheelZoom={true} 
                className="h-full w-full z-0"
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="dark-map-tiles"
                />
                <MapUpdater center={selectedParcel ? [selectedParcel.coordinates[0], selectedParcel.coordinates[1]] : null} />
                
                {filteredParcels.map(parcel => {
                  const isSelected = selectedParcel?.id === parcel.id;
                  const colorClass = parcel.riskScore >= 70 ? 'bg-risk-high' : parcel.riskScore >= 40 ? 'bg-risk-medium' : 'bg-risk-low';
                  
                  const customIcon = L.divIcon({
                    className: 'custom-leaflet-icon !overflow-visible',
                    html: `<div style="position:relative; width:16px; height:16px;">
                             ${isSelected ? `<div style="position:absolute; inset:0; border-radius:50%; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.75" class="${colorClass}"></div>` : ''}
                             <div style="position:relative; width:16px; height:16px; border-radius:50%; border:2px solid #E8E3D2; ${isSelected ? 'box-shadow: 0 0 0 2px #6E56CF, 0 0 0 4px #E8E3D2;' : ''}" class="${colorClass}"></div>
                             ${isSelected ? `<div style="position:absolute; bottom:100%; left:50%; transform:translateX(-50%); margin-bottom:8px; white-space:nowrap; background:#0A0D14; color:#EDEFF4; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600; font-family:sans-serif; border:1px solid #232B3E; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5); z-index:50; pointer-events:none;">${parcel.name}</div>` : ''}
                           </div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                  });

                  return (
                    <Marker 
                      key={parcel.id} 
                      position={[parcel.coordinates[0], parcel.coordinates[1]]} 
                      icon={customIcon}
                      eventHandlers={{
                        click: () => {
                          setSelectedParcel(parcel);
                          if (window.innerWidth < 1024) setActiveTab('details');
                        },
                      }}
                    >
                      <Popup className="custom-popup" closeButton={false}>
                        <div className="bg-ink text-text-main text-xs font-mono px-2 py-1 rounded border border-border whitespace-nowrap shadow-lg -mt-1 -ml-1">
                          ${parcel.khasraId} - Risk: ${parcel.riskScore}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Detail Panel */}
            <div className={`${activeTab === 'details' ? 'flex' : 'hidden'} lg:flex h-[500px] lg:h-2/5 flex-col`}>
              <AnimatePresence mode="wait">
                {selectedParcel ? (
                  <motion.div
                    key={selectedParcel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-surface border border-border rounded-xl p-6 flex flex-col overflow-y-auto custom-scrollbar relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <motion.h3 
                          key={selectedParcel.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-display text-2xl font-bold text-text-main"
                        >
                          {selectedParcel.name}
                        </motion.h3>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="text-text-muted flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {selectedParcel.village}, {selectedParcel.district}, {selectedParcel.state}
                          </span>
                          <span className="text-border">|</span>
                          <button 
                            onClick={() => navigator.clipboard.writeText(selectedParcel.khasraId)}
                            className="font-mono text-text-muted hover:text-primary transition-colors flex items-center gap-1 group cursor-pointer"
                            title="Copy ID"
                          >
                            ID: {selectedParcel.khasraId}
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] ml-1 bg-ink px-1 rounded border border-border">Copy</span>
                          </button>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto relative group">
                        <motion.div 
                          key={selectedParcel.riskScore}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded border font-mono cursor-help transition-all ${getRiskColor(selectedParcel.riskScore)}`}
                        >
                          <span className="text-2xl font-bold">{selectedParcel.riskScore}</span>
                          <span className="text-xs uppercase opacity-80 text-left leading-tight">Risk<br/>Score</span>
                        </motion.div>
                        
                        {/* Risk Tooltip */}
                        <div className="absolute top-full mt-2 right-0 bg-ink/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none whitespace-nowrap">
                           <div className="text-xs text-text-muted font-mono mb-2 border-b border-border pb-1">Risk Breakdown</div>
                           <div className="flex justify-between gap-4 text-sm mb-1"><span className="text-text-muted">Base Score:</span><span className="text-text-main">30</span></div>
                           <div className="flex justify-between gap-4 text-sm mb-1"><span className="text-text-muted">Legal Issues:</span><span className="text-risk-high">+{Math.floor(selectedParcel.riskScore * 0.4)}</span></div>
                           <div className="flex justify-between gap-4 text-sm"><span className="text-text-muted">Timeline Variance:</span><span className="text-risk-medium">+{Math.floor(selectedParcel.riskScore * 0.2)}</span></div>
                        </div>

                        {selectedParcel.predictedDelayMonths > 0 && (
                          <div className="mt-2 text-xs font-mono text-risk-high flex items-center justify-start sm:justify-end gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            +{selectedParcel.predictedDelayMonths} mo delay predicted
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage Tracker */}
                    <div className="mb-6 pb-6 border-b border-border">
                      <div className="text-xs font-mono text-text-muted mb-3 uppercase tracking-wider">Acquisition Stage</div>
                      <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border z-0"></div>
                        {stages.map((stage, idx) => {
                          const currentIdx = stages.indexOf(selectedParcel.currentStage);
                          const isCompleted = idx < currentIdx;
                          const isCurrent = idx === currentIdx;
                          
                          const stageDescriptions = {
                            'Notification': 'Initial gazette publication under Sec 11',
                            'Social Impact Assessment': 'Public hearings and SIA report generation',
                            'Award': 'Final award of compensation under Sec 23',
                            'Compensation': 'Disbursement of funds to beneficiaries',
                            'Possession': 'Physical handover of land to authority'
                          };
                          
                          return (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={stage} 
                              className="relative z-10 flex flex-col items-center gap-2 bg-surface px-2 group cursor-pointer"
                            >
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-125 ${
                                isCompleted ? 'bg-primary border-primary shadow-[0_0_10px_rgba(110,86,207,0.5)]' : 
                                isCurrent ? 'bg-ink border-primary shadow-[0_0_10px_rgba(110,86,207,0.5)]' : 
                                'bg-ink border-border group-hover:border-text-muted'
                              }`}>
                                {isCompleted && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-3 h-3 text-white" /></motion.div>}
                                {isCurrent && <motion.div layoutId="currentStage" className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              </div>
                              <span className={`text-[10px] uppercase font-mono max-w-[70px] text-center transition-colors duration-300 ${
                                isCompleted || isCurrent ? 'text-text-main font-semibold' : 'text-text-muted group-hover:text-text-main'
                              }`}>
                                {stage}
                              </span>

                              {/* Stage Tooltip */}
                              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-ink/95 backdrop-blur-sm border border-border p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none w-32 text-center">
                                <span className="text-[10px] text-text-muted font-sans leading-tight block">
                                  {stageDescriptions[stage as keyof typeof stageDescriptions]}
                                </span>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Tags & Action */}
                    <div className="grid md:grid-cols-2 gap-6 flex-1">
                      <div>
                        <div className="text-xs font-mono text-text-muted mb-3 uppercase tracking-wider">Contributing Factors</div>
                        {selectedParcel.causes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedParcel.causes.map((cause, i) => (
                              <motion.button 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                key={cause} 
                                className="px-2.5 py-1 bg-ink border border-border rounded text-xs text-text-main hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-sm"
                              >
                                {cause}
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-text-muted italic">No major risk factors detected.</div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-text-muted mb-3 uppercase tracking-wider">Recommended Intervention</div>
                        <motion.div 
                          layout
                          className={`flex gap-3 border rounded p-3 transition-colors ${flaggedId === selectedParcel.id ? 'bg-risk-low/10 border-risk-low/30' : 'bg-primary/10 border-primary/20'}`}
                        >
                          {flaggedId === selectedParcel.id ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle2 className="w-5 h-5 text-risk-low shrink-0 mt-0.5" />
                            </motion.div>
                          ) : (
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm text-text-main">{selectedParcel.recommendation}</p>
                            {flaggedId === selectedParcel.id ? (
                              <motion.span 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="inline-block mt-3 text-xs font-medium text-risk-low uppercase tracking-wide"
                              >
                                Flagged successfully
                              </motion.span>
                            ) : (
                              <button 
                                onClick={() => setFlaggedId(selectedParcel.id)}
                                className="mt-3 text-xs font-medium text-primary hover:text-primary/80 uppercase tracking-wide transition-colors"
                              >
                                Flag for review →
                              </button>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-surface border border-border rounded-xl flex items-center justify-center"
                  >
                    <span className="text-text-muted text-sm font-mono">Select a parcel to view details</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

