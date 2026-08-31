import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X as XIcon } from 'lucide-react';
import { packs } from '../data/packs';

export default function PackComparisonSheet({ open, onClose }) {
  if (!open) return null;

  const comparePacks = packs.filter(p => p.eligible !== false); // Don't compare ineligible packs

  const features = [
    { label: 'Price', render: (p) => <span className="font-bold">{p.price} BDT</span> },
    { label: 'Duration', render: (p) => p.duration },
    { label: 'Telco Value', render: (p) => p.telcoValue || '-' },
    { label: 'Bioscope+', render: (p) => p.providers.includes('bioscope') ? <Check size={16} className="mx-auto text-white" /> : <XIcon size={16} className="mx-auto text-white/20" /> },
    { label: 'Hoichoi', render: (p) => p.providers.includes('hoichoi') ? <Check size={16} className="mx-auto text-white" /> : <XIcon size={16} className="mx-auto text-white/20" /> },
    { label: 'Chorki', render: (p) => p.providers.includes('chorki') ? <Check size={16} className="mx-auto text-white" /> : <XIcon size={16} className="mx-auto text-white/20" /> },
    { label: 'SonyLIV', render: (p) => p.providers.includes('sonyliv') ? <Check size={16} className="mx-auto text-white" /> : <XIcon size={16} className="mx-auto text-white/20" /> },
    { label: 'Unlocks', render: (p) => <span className="text-[10px] text-white/70 leading-tight block max-w-[80px] mx-auto text-center">{p.unlocks.join(', ')}</span> },
    { label: 'Pay With', render: (p) => <span className="text-[10px] text-white/70 leading-tight block max-w-[80px] mx-auto text-center">{p.payWith.join(', ')}</span> },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-dark rounded-t-[20px] ring-1 ring-white/5 overflow-hidden flex flex-col h-[85%]"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 320 }}
        >
          <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0 bg-dark">
            <button onClick={onClose} className="cursor-pointer">
              <ArrowLeft size={24} className="text-white" />
            </button>
            <span className="text-[18px] font-bold text-white">Compare Packs</span>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-8">
            <div className="rounded-[16px] bg-surface-dark ring-1 ring-white/10 overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-[12px] text-white">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="py-3 px-3 font-medium text-white/60 sticky left-0 bg-surface-panel z-10 whitespace-nowrap min-w-[100px]">Features</th>
                      {comparePacks.map(p => (
                        <th key={p.id} className={`py-3 px-3 font-bold text-center min-w-[90px] ${p.recommended ? 'text-amber' : 'text-white'}`}>
                          {p.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {features.map((feature, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 sticky left-0 bg-surface-panel z-10 whitespace-nowrap">{feature.label}</td>
                        {comparePacks.map(p => (
                          <td key={p.id} className="py-3 px-3 text-center">
                            {feature.render(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <p className="mt-6 text-[12px] text-white/50 text-center leading-relaxed">
              Comparison is for illustrative purposes. Actual limits may vary based on publisher terms and device capability.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
