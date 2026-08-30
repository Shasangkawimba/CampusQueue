const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Change dark accent color
css = css.replace(/--color-accent-dark: #00F0FF; \/\* Neon Cyan \*\//, '--color-accent-dark: #3B82F6; /* Luminous Azure */');

// Change dark mode grid colors (rgba for Cyan was 0, 240, 255) to Azure (59, 130, 246)
css = css.replace(/rgba\(0, 240, 255/g, 'rgba(59, 130, 246');

// Change glass-panel border radius from 0px to 16px
css = css.replace(/border-radius: 0px; \/\* Brutalist sharp corners \*\//g, 'border-radius: 16px; /* Soft aesthetic corners */');

fs.writeFileSync(cssPath, css);
console.log('CSS updated successfully');
