const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'client', 'public', 'logo.png');
const logoData = fs.readFileSync(logoPath);
const base64Logo = logoData.toString('base64');

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect x="5" y="5" width="90" height="90" rx="22" fill="#ffffff" filter="url(#shadow)" stroke="#e5e5e5" stroke-width="1" />
  <image href="data:image/png;base64,${base64Logo}" x="8" y="8" width="84" height="84" />
</svg>
`;

fs.writeFileSync(path.join(__dirname, 'client', 'public', 'favicon.svg'), svgContent.trim());
console.log('Created favicon.svg successfully.');
