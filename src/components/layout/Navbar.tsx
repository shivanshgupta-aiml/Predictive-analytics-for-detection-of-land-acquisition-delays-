import { Map, ShieldAlert } from 'lucide-react';
import type { ViewType } from '../../App';

interface NavbarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const Navbar = ({ currentView, setCurrentView }: NavbarProps) => {
  return (
    <nav className="w-full bg-[#090C10]/80 backdrop-blur-xl border-b border-white/[0.04] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group transition-all duration-300"
          onClick={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-inner group-hover:border-primary/40 transition-colors duration-300">
            <Map className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-[1.35rem] font-bold tracking-wide text-text-main group-hover:text-white transition-colors duration-300">
              BhoomiSight
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex text-sm font-mono text-text-muted/80 tracking-wide">
            Catch land-acquisition delays before they cost a season.
          </div>
          <button
            onClick={() => setCurrentView(currentView === 'dashboard' ? 'admin' : 'dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md border text-sm font-medium transition-all duration-200 ${
              currentView === 'admin' 
                ? 'bg-primary/10 border-primary/40 text-primary hover:bg-primary/15' 
                : 'bg-surface/50 border-white/5 text-text-muted hover:text-text-main hover:bg-surface hover:border-white/10'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {currentView === 'admin' ? 'Exit Admin' : 'Admin Portal'}
          </button>
        </div>
      </div>
    </nav>
  );
};
