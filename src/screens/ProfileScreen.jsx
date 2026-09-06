import {
  ListVideo, History, FileVideo, Heart, User, ShieldCheck,
  MonitorSmartphone, SlidersHorizontal, Star, HelpCircle,
  MessageSquare, LogOut, Bell, Pencil, Plus, ChevronRight, Ticket,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

// Avatar art is a placeholder — the real profile pictures come from the account
// service, so this only has to read as "a person" at 56px.
function Avatar({ size = 56, name = 'Roy' }) {
  return (
    <div
      className="rounded-full bg-[image:linear-gradient(135deg,#FF2E93_0%,#FF9900_100%)] flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="font-bold text-black" style={{ fontSize: size * 0.42 }}>
        {name.charAt(0)}
      </span>
    </div>
  );
}

export default function ProfileScreen() {
  const { setScreen, SCREENS, setVoucherTab } = useApp();

  // Sign Out is last and separated because it is the only destructive row.
  const rows = [
    { icon: ListVideo, label: 'My List' },
    { icon: History, label: 'Watch History' },
    { icon: FileVideo, label: 'Rent' },
    { icon: Heart, label: 'Liked Content' },
    { icon: User, label: 'My Account' },
    { icon: ShieldCheck, label: 'Payment & Subscription', onClick: () => setScreen(SCREENS.PAYMENT) },
    { icon: Ticket, label: 'Vouchers', badge: 'New', onClick: () => { setVoucherTab('store'); setScreen(SCREENS.VOUCHER_STORE); } },
    { icon: MonitorSmartphone, label: 'Connect TV & Devices' },
    { icon: SlidersHorizontal, label: 'App Settings' },
    { icon: Star, label: 'Rate us' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: MessageSquare, label: 'Send Feedback' },
    { icon: LogOut, label: 'Sign Out', danger: true },
  ];

  return (
    <div className="absolute inset-0 bg-dark flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),var(--spacing-topsafe))] pb-4 shrink-0">
        <h1 className="text-[24px] font-bold text-white tracking-tight">Account</h1>
        <button className="cursor-pointer p-1">
          <Bell size={22} className="text-white" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-[100px]">
        {/* Profile switcher */}
        <div className="flex items-start justify-center gap-3 mb-3">
          <div className="w-[100px] h-[100px] rounded-[12px] ring-2 ring-white flex flex-col items-center justify-center gap-2">
            <Avatar size={52} />
            <span className="text-[13px] font-medium text-white">Roy</span>
          </div>
          <button className="w-[100px] h-[100px] rounded-[12px] bg-surface-dark ring-1 ring-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer">
            <div className="w-[52px] h-[52px] rounded-full bg-white/8 flex items-center justify-center">
              <Plus size={24} className="text-white/70" strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-medium text-white">Add User</span>
          </button>
        </div>

        <button className="flex items-center justify-center gap-2 w-full py-2 mb-4 cursor-pointer">
          <Pencil size={15} className="text-white/70" strokeWidth={1.5} />
          <span className="text-[14px] text-white/80">Manage Profiles</span>
        </button>

        {/* Menu */}
        <div className="space-y-2">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <button
                key={row.label}
                onClick={row.onClick}
                className={`w-full h-[52px] px-4 rounded-[10px] bg-surface-dark ring-1 flex items-center gap-3 cursor-pointer transition-colors hover:bg-white/8 ${
                  row.danger ? 'ring-error/40' : 'ring-white/8'
                }`}
              >
                <Icon size={20} strokeWidth={1.5} className={row.danger ? 'text-error' : 'text-white/80'} />
                <span className={`flex-1 text-left text-[15px] ${row.danger ? 'text-error font-medium' : 'text-white'}`}>
                  {row.label}
                </span>
                {row.badge && (
                  <span className="h-[18px] px-1.5 rounded-full bg-cyan flex items-center">
                    <span className="text-[10px] font-bold text-black uppercase tracking-wide leading-none">{row.badge}</span>
                  </span>
                )}
                {!row.danger && <ChevronRight size={18} className="text-white/40" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
