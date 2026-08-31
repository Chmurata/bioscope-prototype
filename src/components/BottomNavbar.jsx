import { useApp } from '../contexts/AppContext';
import {
  HomeIcon as HomeOutline,
  FilmIcon as FilmOutline,
  PlayCircleIcon as PlayOutline,
  FireIcon as FireOutline,
  UserIcon as UserOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  FilmIcon as FilmSolid,
  PlayCircleIcon as PlaySolid,
  FireIcon as FireSolid,
  UserIcon as UserSolid,
} from '@heroicons/react/24/solid';

const navItems = [
  { outline: HomeOutline,  solid: HomeSolid,  label: 'Home',       screen: 'home' },
  { outline: FilmOutline,  solid: FilmSolid,  label: 'Microdrama', screen: 'microdrama' },
  { outline: PlayOutline,  solid: PlaySolid,  label: 'Shorts',     screen: 'shorts' },
  { outline: FireOutline,  solid: FireSolid,  label: 'New',        screen: null },
  { outline: UserOutline,  solid: UserSolid,  label: 'Account',    screen: 'voucher-store' },
];

export default function BottomNavbar() {
  const { screen, setScreen } = useApp();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/10 backdrop-blur-[60px]">
      <div className="flex items-center justify-between px-4 h-[56px]"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        {navItems.map((item) => {
          const isActive = item.screen === screen;
          const Icon = isActive ? item.solid : item.outline;
          return (
            <button
              key={item.label}
              onClick={() => item.screen && setScreen(item.screen)}
              className="flex flex-col items-center justify-center gap-[2px] w-[44px] h-[44px] cursor-pointer"
            >
              <Icon className={`w-[22px] h-[22px] ${isActive ? 'text-white' : 'text-text-muted'}`} />
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
