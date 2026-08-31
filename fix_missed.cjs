const fs = require('fs');

const replacements = [
  // 1. Comments in SubscribeSheet.jsx
  { file: 'src/components/SubscribeSheet.jsx', from: /#212628/g, to: 'bg-card-light' },
  { file: 'src/components/SubscribeSheet.jsx', from: /#373A3D/g, to: 'border-dark' },
  { file: 'src/components/SubscribeSheet.jsx', from: /#2A2A2A/g, to: 'text-invert-dark' },
  { file: 'src/components/SubscribeSheet.jsx', from: /#0A090B/g, to: 'base-black' },
  { file: 'src/components/PlanCard.jsx', from: /#7A7A7A/g, to: 'text-quaternary' },
  { file: 'src/components/PlanCard.jsx', from: /#D2D6DB/g, to: 'text-tertiary' },
  { file: 'src/components/PlanCard.jsx', from: /#FFFFFF/g, to: 'base-white' },

  // 2. Data files & arbitrary strings
  { file: 'src/data/paymentMethods.js', from: /'#FFFFFF'/g, to: "'var(--color-base-white)'" },

  // 3. Out of scope art direction -> rgb()
  { file: 'src/screens/MicroDramaScreen.jsx', from: /#2a1e3d/g, to: 'rgb(42,30,61)' },
  { file: 'src/screens/MicroDramaScreen.jsx', from: /#3a1f14/g, to: 'rgb(58,31,20)' },
  { file: 'src/screens/MicroDramaScreen.jsx', from: /#1f3a2a/g, to: 'rgb(31,58,42)' },
  { file: 'src/screens/MicroDramaScreen.jsx', from: /#2a2a3e/g, to: 'rgb(42,42,62)' },
  { file: 'src/screens/MicroDramaScreen.jsx', from: /#3d1f1f/g, to: 'rgb(61,31,31)' },
  
  { file: 'src/components/PlanCard.jsx', from: /#1E2A6B/g, to: 'rgb(30,42,107)' },
  { file: 'src/components/PlanCard.jsx', from: /#111A42/g, to: 'rgb(17,26,66)' },
  { file: 'src/components/PlanCard.jsx', from: /#0A0F28/g, to: 'rgb(10,15,40)' },
  { file: 'src/components/PlanCard.jsx', from: /#050813/g, to: 'rgb(5,8,19)' },

  { file: 'src/components/home/HeroTopBar.jsx', from: /#3a2c2c/g, to: 'rgb(58,44,44)' },

  // 4. Missed mappings (often in SVG fill or strings)
  { file: 'src/components/home/HeroCarousel.jsx', from: /#2a2a2a/g, to: 'var(--color-text-invert-dark)' },
  { file: 'src/components/home/PosterRail.jsx', from: /#0A090B/g, to: 'var(--color-base-black)' },
  { file: 'src/components/home/PosterRail.jsx', from: /#E11D48/g, to: 'var(--color-error-primary)' }, // rose-600 map to error
  { file: 'src/components/DoubleTapHeart.jsx', from: /#ff3b5c/g, to: 'var(--color-error-primary)' },
  { file: 'src/components/EpisodeTransition.jsx', from: /#4085F4/g, to: 'var(--color-primary-200)' },
  { file: 'src/components/DramaSheet.jsx', from: /#2A2A2A/g, to: 'var(--color-text-invert-dark)' },
];

replacements.forEach(({ file, from, to }) => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(from, to);
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Fixed ${file}`);
  }
});
