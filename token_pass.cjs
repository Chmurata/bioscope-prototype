const fs = require('fs');
const glob = require('glob');

const replacements = [
  { hex: '#00BBFF', token: 'cyan' },
  { hex: '#FF9900', token: 'amber' },
  { hex: '#0A090B', token: 'dark' },
  { hex: '#1E2224', token: 'surface-dark' },
  { hex: '#FF2E93', token: 'pink' },
  { hex: '#0055A5', token: 'gp-blue' },
  // some lowercase variants
  { hex: '#00bbff', token: 'cyan' },
  { hex: '#ff9900', token: 'amber' },
  { hex: '#0a090b', token: 'dark' },
  { hex: '#1e2224', token: 'surface-dark' },
  { hex: '#ff2e93', token: 'pink' },
  { hex: '#0055a5', token: 'gp-blue' }
];

const files = glob.sync('src/**/*.{jsx,js}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  replacements.forEach(({ hex, token }) => {
    // Replace class instances like bg-[#00BBFF] -> bg-cyan
    const classRegex = new RegExp(`(bg|text|border|ring|border-t|from|to)-\\[${hex}\\]`, 'g');
    content = content.replace(classRegex, `$1-${token}`);
    
    const classOpacityRegex = new RegExp(`(bg|text|border|ring|border-t|from|to)-\\[${hex}\\]/([0-9]+)`, 'g');
    content = content.replace(classOpacityRegex, `$1-${token}/$2`);
    
    // Replace shadow colors like shadow-[0_0_20px_rgba(0,187,255,0.4)] wait this is hard to regex reliably
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
