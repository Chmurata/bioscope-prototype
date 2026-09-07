import { useState, useMemo } from 'react';
import { ArrowLeft, ChevronRight, Ticket, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { vouchers, BRAND_ACCENTS } from '../data/vouchers';
import { formatUsd, formatBdt } from '../utils/currency';
import VoucherPurchaseSheet from '../components/VoucherPurchaseSheet';
import OwnedVoucherDetailSheet from '../components/OwnedVoucherDetailSheet';

const FALLBACK_ACCENT = '#4664F5';
const accentOf = (brand) => BRAND_ACCENTS[brand] || FALLBACK_ACCENT;

// Hex + alpha, so one brand hue can carry both a card wash and a row tint.
const tint = (hex, alpha) => `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;

export default function VoucherStorefrontScreen() {
  const { goBack, ownedVouchers, voucherTab, setVoucherTab } = useApp();
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedOwned, setSelectedOwned] = useState(null);

  // Buying and owning are the same object, so they stay under one menu entry
  // and split with a segment instead of a second row in the profile.
  const owned = ownedVouchers || [];
  const showingMine = voucherTab === 'mine' && !selectedBrand;

  // One entry per brand, carrying its cheapest denomination and how many SKUs it has.
  const brands = useMemo(() => {
    const map = vouchers.reduce((acc, v) => {
      if (!acc[v.brand]) {
        acc[v.brand] = { brand: v.brand, logo: v.logo, category: v.category, minFaceValue: v.faceValue, minPrice: v.price, count: 1 };
      } else {
        acc[v.brand].count += 1;
        if (v.price < acc[v.brand].minPrice) {
          acc[v.brand].minPrice = v.price;
          acc[v.brand].minFaceValue = v.faceValue;
        }
      }
      return acc;
    }, {});
    return Object.values(map);
  }, []);

  // The rail needs a rule, not a hand-picked list, or it is just a second grid.
  // Cheapest way in is the rule, and the caption says so on screen.
  const featured = useMemo(
    () => [...brands].sort((a, b) => a.minPrice - b.minPrice).slice(0, 3),
    [brands]
  );

  const groupedBrands = useMemo(() => {
    return brands.reduce((acc, b) => {
      if (!acc[b.category]) acc[b.category] = [];
      acc[b.category].push(b);
      return acc;
    }, {});
  }, [brands]);

  const brandProducts = useMemo(
    () => (selectedBrand ? vouchers.filter(v => v.brand === selectedBrand) : []),
    [selectedBrand]
  );

  return (
    <div className="absolute inset-0 bg-dark flex flex-col overflow-hidden z-40">
      {/* Header — one line, no divider. The reassurance sits under it once. */}
      <div className="shrink-0 bg-dark px-4 pt-10 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => (selectedBrand ? setSelectedBrand(null) : goBack())} className="cursor-pointer">
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-[20px] font-bold text-white tracking-tight">
            {selectedBrand || 'Vouchers'}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 mt-2 pl-9">
          <Zap size={12} className="text-cyan" fill="currentColor" />
          <span className="text-[11px] text-white/55">Code delivered instantly after payment</span>
        </div>
      </div>

      {!selectedBrand && (
        <div className="shrink-0 px-4 pb-1">
          <div className="flex gap-1 p-1 rounded-full bg-surface-dark ring-1 ring-white/[0.08]">
            {[
              { key: 'store', label: 'Store' },
              { key: 'mine', label: `My vouchers${owned.length ? ` · ${owned.length}` : ''}` },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setVoucherTab(t.key)}
                className={`flex-1 h-[30px] rounded-full text-[12px] font-bold transition-colors cursor-pointer ${
                  voucherTab === t.key ? 'bg-white text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        {showingMine ? (
          owned.length > 0 ? (
            <div className="pt-4 px-4 space-y-2">
              {owned.map(v => {
                const product = vouchers.find(p => p.id === v.productId);
                if (!product) return null;
                const hex = accentOf(product.brand);
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedOwned(v)}
                    className="w-full h-[76px] px-3.5 rounded-[12px] ring-1 ring-white/[0.08] flex items-center gap-3.5 text-left cursor-pointer transition-[filter] active:brightness-125"
                    style={{ backgroundImage: `linear-gradient(90deg, ${tint(hex, 0.18)} 0%, ${tint(hex, 0.05)} 55%, ${tint(hex, 0.02)} 100%)` }}
                  >
                    <div
                      className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center shrink-0 ring-1 ring-white/10"
                      style={{ backgroundColor: tint(hex, 0.18) }}
                    >
                      {product.logo && <img src={product.logo} alt={product.brand} className="w-[26px] h-[26px] object-contain" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[14px] font-bold text-white leading-tight truncate">{product.brand} {formatUsd(product.faceValue)} Voucher</span>
                      <span className={`block text-[11px] mt-1 font-medium ${
                        v.state === 'unredeemed' ? 'text-cyan' : v.state === 'expired' ? 'text-error' : 'text-white/55'
                      }`}>
                        {v.state === 'unredeemed' ? 'Ready to redeem' : v.state === 'expired' ? 'Expired' : 'Redeemed'}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-white/35 shrink-0" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="pt-10 px-8 flex flex-col items-center text-center">
              <div className="w-[52px] h-[52px] rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Ticket size={24} className="text-white/30" />
              </div>
              <span className="text-[15px] font-bold text-white mb-1">Your locker is empty</span>
              <p className="text-[12px] text-white/50 mb-5">Codes you buy land here, ready to redeem.</p>
              <button
                onClick={() => setVoucherTab('store')}
                className="h-[36px] px-5 bg-white/10 hover:bg-white/20 text-white text-[13px] font-bold rounded-full cursor-pointer transition-colors"
              >
                Browse the store
              </button>
            </div>
          )
        ) : !selectedBrand ? (
          <>
            {/* Featured rail */}
            <div className="pt-4 pb-6">
              <h2 className="px-4 mb-3 text-[18px] font-bold text-white leading-none">Quick picks</h2>
              <div className="overflow-x-auto no-scrollbar flex gap-3 px-4 py-1 scroll-pl-4 snap-x snap-mandatory">
                {featured.map(b => {
                  const hex = accentOf(b.brand);
                  return (
                    <button
                      key={b.brand}
                      onClick={() => setSelectedBrand(b.brand)}
                      className="snap-start shrink-0 w-[132px] h-[176px] rounded-[14px] ring-1 ring-white/10 p-3 flex flex-col justify-between text-left cursor-pointer active:scale-[0.98] transition-transform"
                      style={{ backgroundImage: `linear-gradient(158deg, ${tint(hex, 0.38)} 0%, ${tint(hex, 0.12)} 46%, #0A090B 100%)` }}
                    >
                      {b.logo ? (
                        <img src={b.logo} alt={b.brand} className="h-[30px] w-[76px] object-contain object-left" />
                      ) : (
                        <span className="text-[13px] font-bold text-white">{b.brand}</span>
                      )}
                      <div>
                        <span className="block text-[12px] font-medium text-white/70 leading-tight">{b.brand}</span>
                        <span className="block text-[17px] font-bold text-white leading-none mt-1">From {formatUsd(b.minFaceValue)}</span>
                        <span className="block text-[11px] text-white/50 mt-0.5">{formatBdt(b.minPrice)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand wall — full-bleed rows, tinted with the brand's own hue */}
            {Object.entries(groupedBrands).map(([category, items]) => {
              return (
                <div key={category} className="mb-6 px-4">
                  <h2 className="text-[18px] font-bold text-white leading-none mb-3">{category}</h2>
                  <div className="space-y-2">
                    {items.map(b => {
                      const hex = accentOf(b.brand);
                      return (
                        <button
                          key={b.brand}
                          onClick={() => setSelectedBrand(b.brand)}
                          className="w-full h-[80px] px-3.5 rounded-[12px] ring-1 ring-white/[0.08] flex items-center gap-3.5 text-left cursor-pointer transition-[filter] active:brightness-125"
                          style={{ backgroundImage: `linear-gradient(90deg, ${tint(hex, 0.20)} 0%, ${tint(hex, 0.06)} 55%, ${tint(hex, 0.02)} 100%)` }}
                        >
                          <div
                            className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center shrink-0 ring-1 ring-white/10"
                            style={{ backgroundColor: tint(hex, 0.18) }}
                          >
                            {b.logo ? (
                              <img src={b.logo} alt={b.brand} className="w-[30px] h-[30px] object-contain" />
                            ) : (
                              <span className="text-[13px] font-bold text-white">{b.brand.charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-[15px] font-bold text-white leading-tight truncate">{b.brand}</span>
                            <span className="block text-[11px] text-white/55 mt-1">
                              From {formatBdt(b.minPrice)} · {b.count} {b.count === 1 ? 'option' : 'options'}
                            </span>
                          </div>
                          <ChevronRight size={18} className="text-white/35 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          /* Brand products — 2-column denomination grid, accent behind the mark */
          <div className="pt-4 px-4 grid grid-cols-2 gap-3">
            {brandProducts.map(v => {
              const hex = accentOf(v.brand);
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoucherId(v.id)}
                  className="rounded-[14px] ring-1 ring-white/10 p-4 flex flex-col text-left cursor-pointer active:scale-[0.98] transition-transform"
                  style={{ backgroundImage: `linear-gradient(158deg, ${tint(hex, 0.30)} 0%, ${tint(hex, 0.10)} 46%, #0A090B 100%)` }}
                >
                  <div
                    className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center shrink-0 ring-1 ring-white/10 mb-3"
                    style={{ backgroundColor: tint(hex, 0.22) }}
                  >
                    {v.logo && <img src={v.logo} alt={v.brand} className="w-[26px] h-[26px] object-contain" />}
                  </div>
                  <span className="text-[24px] font-bold text-white leading-none tabular-nums">{formatUsd(v.faceValue)}</span>
                  <span className="block text-[11px] text-white/50 mt-1.5">Voucher</span>
                  <span className="block text-[13px] font-bold text-white/80 tabular-nums mt-3">{formatBdt(v.price)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <VoucherPurchaseSheet
        voucherId={selectedVoucherId}
        onClose={() => setSelectedVoucherId(null)}
      />

      <OwnedVoucherDetailSheet
        voucherInstance={selectedOwned}
        onClose={() => setSelectedOwned(null)}
      />
    </div>
  );
}
