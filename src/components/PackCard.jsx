import { useState, useEffect } from 'react';
import { Clock, Flame, Timer } from 'lucide-react';
import OTTLogoStrip from './OTTLogoStrip';
import { PAYMENT_LOGOS } from '../assets/payment-logos';
import { useApp } from '../contexts/AppContext';

const paymentIcons = {
  balance: { type: 'text', label: 'Mobile Balance' },
  bkash: { type: 'image', src: PAYMENT_LOGOS.bkash },
  nagad: { type: 'image', src: PAYMENT_LOGOS.nagad },
  card: { type: 'image', src: PAYMENT_LOGOS.visa } // represent card with visa for now
};

export default function PackCard({ pack, onSelect }) {
  const { activeCampaign } = useApp();
  const isRecommended = pack.recommended;
  
  const campaign = (activeCampaign && activeCampaign.packId === pack.id) ? activeCampaign : null;
  const isTimer = campaign?.type === 'timer';
  const isWindow = campaign?.type === 'window';

  // A window offer is only live inside its hours. Outside them it still shows —
  // upcoming so the user knows to come back, ended so a stale badge isn't
  // mistaken for a live price — but the discount only applies while active.
  const windowState = isWindow ? (campaign.windowState || 'active') : null;
  const windowIsLive = windowState === 'active';
  const campaignApplies = campaign && (!isWindow || windowIsLive);
  
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isTimer || !campaign.expiresAt) return;
    
    const updateTimer = () => {
      const diff = campaign.expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    
    updateTimer();
    const int = setInterval(updateTimer, 1000);
    return () => clearInterval(int);
  }, [isTimer, campaign?.expiresAt]);

  const baseBg = isRecommended
    ? 'bg-[image:var(--gradient-recommended)]'
    : 'bg-surface-dark';

  const ring = campaign ? 'ring-2 ring-pink' : 'ring-1 ring-white/10';

  const displayPrice = campaignApplies ? pack.price - campaign.discount : pack.price;
  const struckPrice = campaign ? pack.price : pack.originalPrice;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(pack.id)}
      className={`w-full text-left rounded-[16px] p-5 relative transition-all flex flex-col cursor-pointer active:scale-[0.99] ${baseBg} ${ring}`}
    >
      {/* Badges Container */}
      {(pack.badge || campaign) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {pack.badge && !campaign && (
            <div className="bg-white/10 ring-1 ring-white/20 px-2.5 py-1 rounded-[6px]">
              <span className="text-[10px] font-bold text-white uppercase tracking-wide leading-none">{pack.badge}</span>
            </div>
          )}
          
          {campaign && (
            <div className={`px-2.5 py-1 rounded-[6px] flex items-center gap-1.5 ${campaignApplies ? 'bg-gradient-to-r from-pink to-campaign-accent shadow-[0_0_12px_rgba(255,46,147,0.3)]' : 'bg-surface-dark ring-1 ring-white/20'}`}>
              {isTimer ? <Timer size={12} className={campaignApplies ? 'text-white' : 'text-white/50'} /> : isWindow ? <Clock size={12} className={campaignApplies ? 'text-white' : 'text-white/50'} /> : <Flame size={12} className={campaignApplies ? 'text-white' : 'text-white/50'} />}
              <span className={`text-[11px] font-bold whitespace-nowrap leading-none tracking-wide ${campaignApplies ? 'text-white' : 'text-white/50'}`}>
                {isWindow ? (
                  windowState === 'upcoming'
                    ? `Starts ${campaign.windowLabel?.split('–')[0]?.trim() || 'soon'}`
                    : windowState === 'ended'
                      ? `${campaign.label} ended`
                      : `${campaign.label} • ends ${campaign.windowLabel?.split('–')[1]?.trim() || 'soon'}`
                ) : (
                  <>{campaign.label}{isTimer && ` • ${timeLeft}`}</>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      <h3 className="text-[18px] font-bold text-white leading-[24px] mb-2">{pack.title}</h3>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock size={14} className="text-icon-subtle" strokeWidth={2} />
          <span className="text-[14px] text-white font-medium">{pack.duration}</span>
        </div>
        {pack.telcoValue && (
          <div className="bg-cyan/15 ring-1 ring-cyan/30 px-2 py-0.5 rounded-full shrink-0">
            <span className="text-[11px] font-bold text-cyan-light">{pack.telcoValue}</span>
          </div>
        )}
      </div>

      <p className="text-[12px] text-white/80 leading-[18px] mb-3">{pack.coverage}</p>

      {pack.providers?.length > 0 && (
        <div className="mb-3">
          <OTTLogoStrip brands={pack.providers} size={24} cols={10} />
        </div>
      )}

      <div className="pt-1 flex flex-col gap-3">
        <div className="flex items-end gap-1.5">
          {struckPrice && (
            <span className="text-[14px] font-medium text-white/50 line-through tabular-nums leading-none mb-0.5">
              ৳{struckPrice}
            </span>
          )}
          <span className={`text-[28px] font-bold tabular-nums leading-none tracking-tight ${campaign ? 'text-pink' : 'text-white'}`}>
            ৳{displayPrice}
          </span>
          <span className="text-[13px] text-white/70 font-medium leading-none mb-0.5">
            {pack.priceUnit}
          </span>
        </div>

        {pack.payWith?.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1 bg-white/5 px-2.5 py-1.5 rounded-[8px] w-fit">
            {pack.payWith.map(method => {
              const icon = paymentIcons[method];
              if (!icon) return null;
              return (
                <div key={method} className="flex items-center justify-center grayscale-[0.3] opacity-80 mix-blend-screen">
                  {icon.type === 'image' ? (
                    <img src={icon.src} alt={method} className="h-[12px] object-contain brightness-0 invert opacity-70" />
                  ) : (
                    <span className="text-[9px] font-bold text-white/70 uppercase leading-none">{icon.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </button>
  );
}
