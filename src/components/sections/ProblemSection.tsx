import { useState } from 'react';
import { FileWarning, Scale, Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProblemSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const problems = [
    {
      icon: <Scale className="w-6 h-6 text-risk-high" />,
      title: "Title Disputes & Litigation",
      desc: "Legacy claims, missing heir signatures, and sudden injunctions freeze acquisition for years. We track historical court filings on overlapping Khasra boundaries to predict litigation risk."
    },
    {
      icon: <Users className="w-6 h-6 text-risk-medium" />,
      title: "Compensation Disagreements",
      desc: "Mismatches between circle rates and market expectations derail the 'Award' stage. Our engine flags corridors with recent spikes in commercial re-zoning or past R&R protests."
    },
    {
      icon: <FileWarning className="w-6 h-6 text-primary" />,
      title: "Survey & Documentation Gaps",
      desc: "Physical ground realities often contradict paper revenue records. We cross-reference satellite data with cadastre ledgers to identify probable unrecorded structures before surveyors hit the ground."
    }
  ];

  return (
    <section className="py-20 bg-ink relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-display text-3xl font-bold text-text-main mb-4">Why projects stall</h2>
          <p className="text-text-muted max-w-2xl text-lg">
            Land acquisition doesn't fail overnight. It fails in predictable patterns buried in revenue offices and district courts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((prob, i) => (
            <div 
              key={i} 
              className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-ink border border-border flex items-center justify-center">
                  {prob.icon}
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-text-muted transition-transform duration-300 ${expandedIndex === i ? 'rotate-180' : ''}`} 
                />
              </div>
              <h3 className="font-sans text-xl font-semibold text-text-main mb-2">{prob.title}</h3>
              
              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-text-muted leading-relaxed pt-2">{prob.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
