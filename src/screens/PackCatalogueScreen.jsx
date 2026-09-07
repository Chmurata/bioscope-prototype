import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Crown, X } from 'lucide-react';
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
  const { goBack, setPaywallContext, activeCampaign, packCatalogueContent, setPackCatalogueContent } = useApp();

  const [selectedValidity, setSelectedValidity] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [showComparison, setShowComparison] = useState(false);

  // Reuses the exact predicate PaywallSheet.jsx uses to scope packs to a title.
  const matchesContent = useCallback(
    (p) => !packCatalogueContent || packCatalogueContent.packs.includes(p.id),
    [packCatalogueContent]
  );

  // Filter logic
  const filteredPacks = useMemo(() => {
    return packs.filter(p => {
      // A pack the user cannot meet the requirement for is not offered at all,
      // the way it works in the real app — it is not shown greyed out.
      if (!p.eligible) return false;

      // Exclude recommended pack from normal list, it will be hoisted
      if (p.recommended) return false;

      if (!matchesContent(p)) return false;

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
  }, [selectedValidity, selectedPlatform, matchesContent]);

  const recommendedPack = packs.find(p => p.recommended && matchesContent(p));

  // A campaign is set from outside this screen, so the pack it applies to can be
  // anywhere in the list. Bring it into view rather than making the user hunt.
  const listRef = useRef(null);
  const cardRefs = useRef({});
  const campaignPackId = activeCampaign?.packId;

  useEffect(() => {
    if (!campaignPackId) return;
    const frame = requestAnimationFrame(() => {
      const el = cardRefs.current[campaignPackId];
      const list = listRef.current;
      if (!el || !list) return;
      const elRect = el.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const target = list.scrollTop + (elRect.top - listRect.top)
        - Math.max(0, (list.clientHeight - elRect.height) / 2);
      list.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [campaignPackId, filteredPacks]);

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
        <h1 className="text-[20px] font-bold text-white leading-tight tracking-tight">Select Your Pack</h1>
      </div>

      {/* Content filter indicator — dismissible back to the unfiltered catalogue */}
      {packCatalogueContent && (
        <div className="shrink-0 px-5 pb-4 -mt-2">
          <div className="inline-flex items-center gap-2 h-[28px] pl-3 pr-2 rounded-full bg-cyan/15 ring-1 ring-cyan/30">
            <span className="text-[11px] font-bold text-cyan">Packs for {packCatalogueContent.title}</span>
            <button
              onClick={() => setPackCatalogueContent(null)}
              className="w-[16px] h-[16px] rounded-full bg-cyan/20 flex items-center justify-center cursor-pointer"
            >
              <X size={10} className="text-cyan" />
            </button>
          </div>
        </div>
      )}

      {/* Filters (Sticky) */}
      <div className="shrink-0 bg-dark border-b border-white/10 pb-2">
        <div className="overflow-x-auto no-scrollbar px-5 mb-2 flex gap-1">
          {VALIDITY_OPTIONS.map(v => (
            <button
              key={v}
              onClick={() => setSelectedValidity(v)}
              className={`shrink-0 h-[28px] px-2.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                selectedValidity === v ? 'bg-white text-black' : 'bg-surface-dark text-white hover:bg-white/10 ring-1 ring-white/10'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto no-scrollbar px-5 flex gap-1">
          {PLATFORM_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`shrink-0 h-[28px] px-2.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                selectedPlatform === p ? 'bg-white text-black' : 'bg-surface-dark text-white hover:bg-white/10 ring-1 ring-white/10'
              }`}
            >
              {p === 'bioscope' ? 'Bioscope+' : p === 'hoichoi' ? 'Hoichoi' : p === 'chorki' ? 'Chorki' : p}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-5 pt-6 pb-12 space-y-6">
        
        {/* Hoisted Recommended Pack */}
        {recommendedPack && (
          <div ref={el => { cardRefs.current[recommendedPack.id] = el; }}>
            <h2 className="text-[14px] font-bold text-amber uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Crown size={16} /> Most Popular
            </h2>
            <PackCard pack={recommendedPack} onSelect={() => handlePackSelect(recommendedPack.id)} />
          </div>
        )}

        {/* Filtered Packs */}
        {filteredPacks.length > 0 ? (
          <div className="space-y-4">
            {filteredPacks.map(p => (
              <div key={p.id} ref={el => { cardRefs.current[p.id] = el; }}>
                <PackCard pack={p} onSelect={() => handlePackSelect(p.id)} />
              </div>
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
