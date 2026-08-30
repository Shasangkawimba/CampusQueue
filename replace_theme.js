const fs = require('fs');
const path = require('path');

const files = [
  'client/src/pages/TakeQueue.jsx',
  'client/src/pages/admin/Dashboard.jsx',
  'client/src/pages/admin/Login.jsx',
  'client/src/pages/QueueStatus.jsx',
];

const replacements = [
  { from: /bg-slate-50/g, to: 'bg-bg-light' },
  { from: /dark:bg-slate-950/g, to: 'dark:bg-bg-dark' },
  { from: /bg-slate-900/g, to: 'bg-bg-dark' },
  { from: /dark:bg-slate-50/g, to: 'dark:bg-bg-light' },
  { from: /text-slate-900/g, to: 'text-text-light' },
  { from: /dark:text-slate-50/g, to: 'dark:text-text-dark' },
  { from: /text-slate-50/g, to: 'text-text-dark' },
  { from: /dark:text-slate-900/g, to: 'dark:text-text-light' },
  { from: /bg-indigo-600/g, to: 'bg-accent' },
  { from: /hover:bg-indigo-700/g, to: 'hover:bg-text-light' },
  { from: /dark:bg-indigo-500/g, to: 'dark:bg-accent-dark' },
  { from: /text-indigo-600/g, to: 'text-accent' },
  { from: /dark:text-indigo-400/g, to: 'dark:text-accent-dark' },
  { from: /border-slate-200/g, to: 'border-text-light/15' },
  { from: /dark:border-slate-800/g, to: 'dark:border-text-dark/15' },
  { from: /border-slate-300/g, to: 'border-text-light/30' },
  { from: /dark:border-slate-600/g, to: 'dark:border-text-dark/30' },
  { from: /bg-slate-100/g, to: 'bg-text-light/5' },
  { from: /dark:bg-slate-800/g, to: 'dark:bg-text-dark/5' },
  { from: /hover:bg-slate-100/g, to: 'hover:bg-text-light/5' },
  { from: /dark:hover:bg-slate-800/g, to: 'dark:hover:bg-text-dark/5' },
  { from: /bg-slate-200/g, to: 'bg-text-light/10' },
  { from: /dark:bg-slate-700/g, to: 'dark:bg-text-dark/10' },
  { from: /hover:bg-slate-200/g, to: 'hover:bg-text-light/10' },
  { from: /dark:hover:bg-slate-700/g, to: 'dark:hover:bg-text-dark/10' },
  { from: /text-slate-600/g, to: 'text-text-muted-light' },
  { from: /dark:text-slate-400/g, to: 'dark:text-text-muted-dark' },
  { from: /text-slate-500/g, to: 'text-text-light/50' },
  { from: /dark:text-slate-500/g, to: 'dark:text-text-dark/50' },
  { from: /text-slate-400/g, to: 'text-text-light/40' },
  { from: /dark:text-slate-300/g, to: 'dark:text-text-dark/70' },
  { from: /text-slate-700/g, to: 'text-text-light/80' },
  { from: /dark:text-slate-200/g, to: 'dark:text-text-dark/80' },
  { from: /text-slate-800/g, to: 'text-text-light/90' },
  { from: /dark:text-slate-100/g, to: 'dark:text-text-dark/90' },
  { from: /placeholder-slate-400/g, to: 'placeholder-text-light/40' },
  { from: /dark:placeholder-slate-500/g, to: 'dark:placeholder-text-dark/40' },
  { from: /bg-slate-900\/50/g, to: 'bg-bg-dark/50' },
  { from: /dark:bg-slate-900\/80/g, to: 'dark:bg-bg-dark/80' },
  { from: /dark:bg-slate-800\/50/g, to: 'dark:bg-text-dark/10' },
  { from: /dark:hover:bg-slate-800\/50/g, to: 'dark:hover:bg-text-dark/10' },
  { from: /dark:hover:bg-slate-800\/30/g, to: 'dark:hover:bg-text-dark/5' },
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
  });
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
