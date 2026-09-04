export const Footer = () => {
  return (
    <footer className="bg-ink border-t border-border mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="font-display text-lg font-bold text-text-main mb-2">BhoomiSight</h2>
          <p className="text-text-muted text-sm max-w-sm">
            Built for PMUs, highway/rail authorities, and state governments to act before a case stalls.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-3 py-1 bg-surface border border-border rounded text-xs font-mono text-text-muted">
            React
          </div>
          <div className="px-3 py-1 bg-surface border border-border rounded text-xs font-mono text-text-muted">
            Tailwind
          </div>
          <div className="px-3 py-1 bg-surface border border-border rounded text-xs font-mono text-text-muted">
            Recharts
          </div>
        </div>
      </div>
    </footer>
  );
};
