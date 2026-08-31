import { PAYMENT_METHODS } from '../data/paymentMethods';

// Expanded payment method picker — light theme, matches the production bKash-style SDK screen.
// bKash highlighted at top (filled radio), thin separator, remaining methods below.
export default function PaymentMethodList({ value, onChange, allowedMethods, theme = 'light' }) {
  const availableMethods = allowedMethods 
    ? PAYMENT_METHODS.filter(m => allowedMethods.includes(m.id))
    : PAYMENT_METHODS;
    
  if (availableMethods.length === 0) return null;

  const [primary, ...rest] = availableMethods;

  return (
    <div>
      <h4 className={`text-[15px] font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-card'}`}>Select Payment Method</h4>

      {/* Highlighted primary (bKash) */}
      <MethodRow
        method={primary}
        selected={value === primary.id}
        highlight
        theme={theme}
        onSelect={() => onChange?.(primary.id)}
      />

      {theme === 'light' && <div className="h-px bg-divider-light mb-1 mt-4" />}

      {/* Rest */}
      <div>
        {rest.map((m) => (
          <MethodRow
            key={m.id}
            method={m}
            selected={value === m.id}
            theme={theme}
            onSelect={() => onChange?.(m.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MethodRow({ method, selected, highlight, theme, onSelect }) {
  const isDark = theme === 'dark';
  
  const baseBg = isDark 
    ? (selected ? 'bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]' : 'bg-[var(--color-surface-raised)] border border-white/10')
    : (highlight ? 'bg-select-tint' : 'hover:bg-black/[0.02]');
    
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 rounded-[8px] px-3 py-3 text-left cursor-pointer transition-all mb-2 ${baseBg}`}
    >
      {/* Brand tile */}
      <div
        className="w-[48px] h-[32px] rounded-[4px] flex items-center justify-center shrink-0 ring-1 ring-black/10 overflow-hidden p-1"
        style={{ background: method.tileBg }}
      >
        {method.logo ? (
          <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
        ) : (
          <span
            className="leading-none font-bold"
            style={{
              color: method.wordmarkColor,
              fontSize: method.wordmarkSize,
              letterSpacing: '-0.02em',
            }}
          >
            {method.wordmark}
          </span>
        )}
      </div>

      {/* Name */}
      <span className={`flex-1 text-[14px] font-bold ${isDark ? 'text-white' : 'text-card'}`}>{method.name}</span>

      {/* Radio */}
      <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 border ${
        isDark
          ? (selected ? 'border-[var(--color-cyan)]' : 'border-white/30')
          : (selected ? 'border-select-blue bg-white' : 'border-outline-light bg-white')
      }`}>
        {selected && <div className={`w-[10px] h-[10px] rounded-full ${isDark ? 'bg-[var(--color-cyan)]' : 'bg-select-blue'}`} />}
      </div>
    </button>
  );
}
