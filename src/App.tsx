import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { ProblemSection } from './components/sections/ProblemSection';
import { PipelineSection } from './components/sections/PipelineSection';
import { DashboardSection } from './components/sections/DashboardSection';
import { AnalyticsSection } from './components/sections/AnalyticsSection';
import { AdminPage } from './pages/AdminPage';

export type ViewType = 'dashboard' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <div className="min-h-screen bg-ink flex flex-col selection:bg-primary/30 selection:text-primary">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1">
        {currentView === 'dashboard' ? (
          <>
            <HeroSection />
            <ProblemSection />
            <PipelineSection />
            <DashboardSection />
            <AnalyticsSection />
          </>
        ) : (
          <AdminPage />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
