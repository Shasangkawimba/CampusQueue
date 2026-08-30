const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/rgba\(17,\s*17,\s*17,\s*0\.1\)/g, 'rgba(17, 17, 17, 0.04)');
css = css.replace(/rgba\(0,\s*240,\s*255,\s*0\.12\)/g, 'rgba(0, 240, 255, 0.05)');

fs.writeFileSync(cssPath, css);
console.log('CSS updated successfully');
