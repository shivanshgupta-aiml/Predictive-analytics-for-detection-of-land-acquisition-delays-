import { Database, BrainCircuit, Activity, ShieldAlert } from 'lucide-react';

export const PipelineSection = () => {
  const steps = [
    {
      icon: <Database className="w-5 h-5" />,
      title: "Data In",
      desc: "Land records, court filings, past project timelines, and compensation disbursement history are ingested."
    },
    {
      icon: <BrainCircuit className="w-5 h-5" />,
      title: "Risk Model",
      desc: "Our ML engine processes the data to find patterns correlated with historical delays in similar districts."
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Early-Warning Score",
      desc: "Parcels are assigned a continuous risk score indicating the likelihood of delay exceeding 6 months."
    },
    {
      icon: <ShieldAlert className="w-5 h-5" />,
      title: "Recommended Action",
      desc: "The system prescribes specific interventions (e.g., 'Deploy legal counsel', 'Verify ground survey')."
    }
  ];

  return (
    <section className="py-20 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-text-main mb-4">How it works</h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-ink border-2 border-primary/50 text-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(110,86,207,0.3)]">
                  {step.icon}
                </div>
                <div className="bg-ink border border-border rounded-lg p-5 w-full h-full">
                  <div className="text-primary font-mono text-sm mb-2">STEP {i + 1}</div>
                  <h3 className="font-sans text-lg font-semibold text-text-main mb-2">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
