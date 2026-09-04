import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useData } from '../../context/DataContext';

export const HeroSection = () => {
  const { parcels } = useData();
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl sm:text-6xl text-text-main font-bold leading-[1.1] tracking-tight mb-8">
              Predict land delays before they cost a season.
            </h1>
            <p className="text-xl text-text-muted mb-10 font-sans leading-relaxed">
              An early-warning engine for infrastructure projects. We analyze land records, court filings, and historical timelines to flag at-risk parcels before your project stalls.
            </p>
            <a 
              href="#dashboard"
              className="bg-primary text-white font-medium px-7 py-3.5 rounded-md inline-flex items-center gap-2 w-fit"
            >
              Explore the dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Map Visualization */}
          <div className="relative h-[400px] w-full bg-surface border border-border rounded-xl overflow-hidden p-4 shadow-2xl">
            {/* Live Map Base */}
            <div className="absolute inset-4 rounded-lg opacity-90 overflow-hidden mix-blend-luminosity z-0">
              <MapContainer 
                center={[22.0, 79.0]} 
                zoom={4} 
                scrollWheelZoom={false} 
                className="h-full w-full"
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="dark-map-tiles"
                />
                
                {parcels.slice(0, 4).map(parcel => {
                  const colorClass = parcel.riskScore >= 70 ? 'bg-risk-high' : parcel.riskScore >= 40 ? 'bg-risk-medium' : 'bg-risk-low';
                  
                  const customIcon = L.divIcon({
                    className: 'custom-leaflet-icon',
                    html: `<div style="position:relative; width:16px; height:16px;">
                             <div style="position:absolute; inset:0; border-radius:50%; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.75" class="${colorClass}"></div>
                             <div style="position:relative; width:16px; height:16px; border-radius:50%; border:2px solid #E8E3D2;" class="${colorClass}"></div>
                           </div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                  });

                  return (
                    <Marker 
                      key={parcel.id} 
                      position={[parcel.coordinates[0], parcel.coordinates[1]]} 
                      icon={customIcon}
                    />
                  );
                })}
              </MapContainer>
            </div>
            
            {/* Radar Sweep Overlay */}
            <div className="absolute inset-4 rounded-lg overflow-hidden pointer-events-none z-10">
              <motion.div 
                className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -ml-[400px] -mt-[400px] rounded-full border-t border-r border-primary/30"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 70%, rgba(110, 86, 207, 0.1) 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* Overlay UI elements on the map */}
            <div className="absolute top-6 left-6 bg-[#090C10]/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-mono text-white/80 shadow-xl z-20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              SCANNING KADASTRA...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
