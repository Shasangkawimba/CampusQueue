const fs = require('fs');
const path = require('path');

const files = [
  'client/src/pages/TakeQueue.jsx',
  'client/src/pages/admin/Dashboard.jsx',
  'client/src/pages/admin/Login.jsx',
  'client/src/pages/QueueStatus.jsx',
];

const replacements = [
  { from: /text-text-dark0/g, to: 'text-text-dark/50' },
  { from: /bg-white/g, to: 'bg-bg-light' },
  { from: /text-text-light\/500/g, to: 'text-text-light/50' },
  { from: /text-text-light0/g, to: 'text-text-light/50' },
  { from: /bg-bg-light\/5/g, to: 'bg-bg-light' },
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
  });
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned ${file}`);
});
