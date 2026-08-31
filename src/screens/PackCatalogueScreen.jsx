import { useState, useMemo } from 'react';
import { ArrowLeft, Crown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { packs } from '../data/packs';
import PackCard from '../components/PackCard';
import PackComparisonSheet from '../components/PackComparisonSheet';

const VALIDITY_OPTIONS = ['All', '1 Day', '7 Days', '28 Days', '90 Days', '365 Days'];
const PLATFORM_OPTIONS = ['All', 'bioscope', 'hoichoi', 'chorki', 'Combo', 'Data+OTT'];

// Map filter values to exact strings in packs data
const validityMap = {
  '1 Day': 1,
  '7 Days': 7,
  '28 Days': 28,
  '90 Days': 90,
  '365 Days': 365
};

export default function PackCatalogueScreen() {
  const { goBack, setPaywallContext } = useApp();
  
  const [selectedValidity, setSelectedValidity] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [showComparison, setShowComparison] = useState(false);

  // Filter logic
  const filteredPacks = useMemo(() => {
    return packs.filter(p => {
      // Exclude recommended pack from normal list, it will be hoisted
      if (p.recommended) return false;

      // Validity
      if (selectedValidity !== 'All' && p.durationDays !== validityMap[selectedValidity]) {
        return false;
      }

      // Platform
      if (selectedPlatform !== 'All') {
        if (selectedPlatform === 'Data+OTT' && p.kind !== 'data+ott') return false;
        if (selectedPlatform === 'Combo' && p.providers.length <= 1) return false; // simple proxy for combo
        if (selectedPlatform !== 'Data+OTT' && selectedPlatform !== 'Combo' && !p.providers.includes(selectedPlatform)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedValidity, selectedPlatform]);

  const recommendedPack = packs.find(p => p.recommended);

  const handlePackSelect = (packId) => {
    setPaywallContext({ origin: 'generic', content: null, initialPackId: packId });
  };

  return (
    <div className="absolute inset-0 bg-dark flex flex-col overflow-hidden z-40">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-10 pb-6 shrink-0 bg-dark">
        <button onClick={goBack} className="cursor-pointer">
          <ArrowLeft size={28} className="text-white" />
        </button>
        <div>
          <h1 className="text-[28px] font-bold text-white leading-tight tracking-tight">Select Your Pack</h1>
          <span className="text-[14px] text-white/60">Unlock premium entertainment</span>
        </div>
      </div>

      {/* Filters (Sticky) */}
      <div className="shrink-0 bg-dark border-b border-white/10 pb-4">
        <div className="overflow-x-auto no-scrollbar px-5 mb-4 flex gap-2">
          {VALIDITY_OPTIONS.map(v => (
            <button
              key={v}
              onClick={() => setSelectedValidity(v)}
              className={`shrink-0 h-[40px] px-5 rounded-full text-[14px] font-bold transition-colors cursor-pointer ${
                selectedValidity === v ? 'bg-white text-black' : 'bg-surface-dark text-white hover:bg-white/10 ring-1 ring-white/10'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto no-scrollbar px-5 flex gap-2">
          {PLATFORM_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`shrink-0 h-[40px] px-5 rounded-full text-[14px] font-bold transition-colors cursor-pointer ${
                selectedPlatform === p ? 'bg-white text-black' : 'bg-surface-dark text-white hover:bg-white/10 ring-1 ring-white/10'
              }`}
            >
              {p === 'bioscope' ? 'Bioscope+' : p === 'hoichoi' ? 'Hoichoi' : p === 'chorki' ? 'Chorki' : p}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-12 flex flex-col gap-6">
        
        {/* Hoisted Recommended Pack */}
        {recommendedPack && (
          <div>
            <h2 className="text-[14px] font-bold text-amber uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Crown size={16} /> Most Popular
            </h2>
            <PackCard pack={recommendedPack} onSelect={() => handlePackSelect(recommendedPack.id)} />
          </div>
        )}

        {/* Filtered Packs */}
        {filteredPacks.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredPacks.map(p => (
              <PackCard key={p.id} pack={p} onSelect={() => handlePackSelect(p.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-[48px] h-[48px] rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-[20px]">🔍</span>
            </div>
            <h3 className="text-[16px] font-bold text-white mb-2">No packs match these filters</h3>
            <p className="text-[13px] text-white/50 mb-6">Try selecting a different validity or platform.</p>
            <button
              onClick={() => { setSelectedValidity('All'); setSelectedPlatform('All'); }}
              className="h-[36px] px-4 bg-white/10 rounded-full text-[13px] font-bold text-white cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Inert Flexiplan Card */}
        <div className="rounded-[16px] bg-surface-dark p-5 flex flex-col border border-white/10 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={16} className="text-cyan" />
            <span className="text-[14px] font-bold text-white">Flexiplan</span>
          </div>
          <h3 className="text-[18px] font-bold text-white mb-1">Make your custom plan in 2 simple steps</h3>
          <p className="text-[12px] text-white/60 mb-4">Choose your preferred data, voice, and OTTs.</p>
          <button className="h-[44px] rounded-[8px] bg-white/5 text-cyan font-bold text-[14px] border border-cyan/20 cursor-default opacity-80 mt-2">
            + Create Package
          </button>
        </div>

        {/* Footer Microcopy */}
        <div className="pt-6 pb-4 text-center">
          <button 
            onClick={() => setShowComparison(true)}
            className="text-[13px] text-cyan font-bold mb-4 cursor-pointer hover:underline"
          >
            Compare all packs
          </button>
          <p className="text-[11px] text-white/40 leading-[16px]">
            Prices are inclusive of 15% VAT.<br/>Auto-renewal can be managed anytime from My Subscriptions.
          </p>
        </div>
      </div>
      
      <PackComparisonSheet 
        open={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
}
