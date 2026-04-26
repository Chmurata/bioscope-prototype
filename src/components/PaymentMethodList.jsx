import { PAYMENT_METHODS } from '../data/paymentMethods';

// Expanded payment method picker — light theme, matches the production bKash-style SDK screen.
// bKash highlighted at top (filled radio), thin separator, remaining methods below.
export default function PaymentMethodList({ value, onChange }) {
  const [primary, ...rest] = PAYMENT_METHODS;

  return (
    <div>
      <h4 className="text-[15px] font-bold text-[#1A1A1A] mb-4">Payment Method</h4>

      {/* Highlighted primary (bKash) */}
      <MethodRow
        method={primary}
        selected={value === primary.id}
        highlight
        onSelect={() => onChange?.(primary.id)}
      />

      {/* Saved-card ghost checkbox */}
      <div className="flex items-center gap-2 pl-1 py-2.5 mb-1">
        <div className="w-[16px] h-[16px] rounded-[3px] ring-1 ring-[#9DA4AE] bg-transparent" />
        <span className="text-[13px] text-[#6B7280]">Saved by bKash</span>
      </div>

      <div className="h-px bg-[#E5E7EB] mb-1" />

      {/* Rest */}
      <div>
        {rest.map((m) => (
          <MethodRow
            key={m.id}
            method={m}
            selected={value === m.id}
            onSelect={() => onChange?.(m.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MethodRow({ method, selected, highlight, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 rounded-[8px] px-3 py-3 text-left cursor-pointer transition-all ${
        highlight ? 'bg-[#E7EFFF]' : 'hover:bg-black/[0.02]'
      }`}
    >
      {/* Brand tile */}
      <div
        className="w-[40px] h-[28px] rounded-[4px] flex items-center justify-center shrink-0 ring-1 ring-black/10"
        style={{ background: method.tileBg }}
      >
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
      </div>

      {/* Name */}
      <span className="flex-1 text-[15px] font-semibold text-[#1A1A1A]">{method.name}</span>

      {/* Radio */}
      <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 ring-1 ${
        selected ? 'ring-[#1E40E8] bg-white' : 'ring-[#9DA4AE] bg-white'
      }`}>
        {selected && <div className="w-[10px] h-[10px] rounded-full bg-[#1E40E8]" />}
      </div>
    </button>
  );
}
