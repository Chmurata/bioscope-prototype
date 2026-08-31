import { useState, useMemo } from 'react';
import { ArrowLeft, Gamepad2, Headphones, Tv } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { vouchers } from '../data/vouchers';
import VoucherPurchaseSheet from '../components/VoucherPurchaseSheet';

const CATEGORY_ICONS = {
  'Streaming': <Tv size={16} className="text-white/70" />,
  'Music': <Headphones size={16} className="text-white/70" />,
  'Games': <Gamepad2 size={16} className="text-white/70" />
};

export default function VoucherStorefrontScreen() {
  const { goBack } = useApp();
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Group brands by category for V1
  const groupedBrands = useMemo(() => {
    const brandMap = vouchers.reduce((acc, v) => {
      if (!acc[v.brand]) {
        acc[v.brand] = { brand: v.brand, logo: v.logo, category: v.category, minPrice: v.price };
      } else {
        if (v.price < acc[v.brand].minPrice) acc[v.brand].minPrice = v.price;
      }
      return acc;
    }, {});
    
    return Object.values(brandMap).reduce((acc, b) => {
      if (!acc[b.category]) acc[b.category] = [];
      acc[b.category].push(b);
      return acc;
    }, {});
  }, []);

  const brandProducts = useMemo(() => {
    return selectedBrand ? vouchers.filter(v => v.brand === selectedBrand) : [];
  }, [selectedBrand]);

  return (
    <div className="absolute inset-0 bg-dark flex flex-col overflow-hidden z-40">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 shrink-0 bg-dark border-b border-white/10">
        <button onClick={goBack} className="cursor-pointer">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div>
          <h1 className="text-[18px] font-bold text-white leading-tight">Digital Vouchers</h1>
          <span className="text-[13px] text-white/60">Buy codes for your favourite apps</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-12">
        {!selectedBrand ? (
          // V1: Storefront
          Object.entries(groupedBrands).map(([category, items]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {CATEGORY_ICONS[category]}
                <h2 className="text-[16px] font-bold text-white uppercase tracking-wider">{category}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {items.map(b => (
                  <button 
                    key={b.brand}
                    onClick={() => setSelectedBrand(b.brand)}
                    className="bg-surface-dark ring-1 ring-white/10 rounded-[12px] p-4 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors aspect-square"
                  >
                    {b.logo ? (
                      <img src={b.logo} alt={b.brand} className="w-[60px] h-[60px] object-contain mb-3" />
                    ) : (
                      <span className="text-[15px] font-bold text-white mb-2">{b.brand}</span>
                    )}
                    <span className="text-[12px] text-white/50 font-medium">From ৳{b.minPrice}</span>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          // V2: Product List for Brand
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <button onClick={() => setSelectedBrand(null)} className="cursor-pointer bg-white/10 p-1.5 rounded-full">
                <ArrowLeft size={18} className="text-white" />
              </button>
              <h2 className="text-[18px] font-bold text-white">{selectedBrand} Vouchers</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {brandProducts.map(v => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVoucherId(v.id)}
                  className="bg-surface-dark ring-1 ring-white/10 rounded-[12px] p-3 text-left flex flex-col cursor-pointer hover:bg-white/5 transition-colors"
                >
                  {v.logo ? (
                    <img src={v.logo} alt={v.brand} className="h-6 w-auto object-contain mb-2 self-start" />
                  ) : (
                    <span className="text-[13px] font-bold text-white mb-1">{v.brand}</span>
                  )}
                  <span className="text-[11px] text-white/60 mb-3 leading-tight h-[28px]">{v.product}</span>
                  <div className="mt-auto">
                    <span className="text-[15px] font-bold text-cyan block">৳{v.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <VoucherPurchaseSheet 
        voucherId={selectedVoucherId} 
        onClose={() => setSelectedVoucherId(null)} 
      />
    </div>
  );
}
