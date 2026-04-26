import { useApp } from '../contexts/AppContext';
import { Home, Clapperboard, Flame, User } from 'lucide-react';

const navItems = [
  { icon: Home,         label: 'Home',       screen: 'home' },
  { icon: Clapperboard, label: 'Microdrama', screen: 'microdrama' },
  { icon: Flame,        label: 'New',        screen: null },
  { icon: User,         label: 'Account',    screen: null },
];

export default function BottomNavbar() {
  const { screen, setScreen } = useApp();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/10 backdrop-blur-[60px]">
      <div className="flex items-center justify-between px-4 h-[56px]"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        {navItems.map((item) => {
          const isActive = item.screen === screen;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => item.screen && setScreen(item.screen)}
              className="flex flex-col items-center justify-center gap-[2px] w-[44px] h-[44px] cursor-pointer"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.5}
                className={isActive ? 'text-white' : 'text-text-muted'}
                fill={isActive ? 'white' : 'none'}
              />
              <span className={`text-[10px] ${isActive ? 'font-semibold text-white' : 'text-text-muted'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-center pb-2 pt-1">
        <div className="w-[134px] h-[5px] bg-white rounded-full" />
      </div>
    </div>
  );
}
