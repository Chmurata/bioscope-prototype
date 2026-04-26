import { useState } from 'react';

const genres = ['All', 'Romance', 'Thriller', 'Comedy', 'Action', 'Drama', 'Fantasy'];

export default function GenreFilter({ onFilter }) {
  const [active, setActive] = useState('All');

  const handleSelect = (genre) => {
    setActive(genre);
    onFilter?.(genre);
  };

  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleSelect(genre)}
          className={`flex-shrink-0 px-[14px] py-[6px] rounded-[16px] text-[12px] font-medium cursor-pointer transition-colors duration-150
            ${active === genre
              ? 'bg-pill-active text-bg'
              : 'bg-pill-inactive text-text-secondary'
            }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
