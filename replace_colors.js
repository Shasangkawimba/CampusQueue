const fs = require('fs');
const path = require('path');

const files = [
  'client/src/pages/admin/Dashboard.jsx',
  'client/src/pages/admin/Login.jsx',
  'client/src/pages/QueueStatus.jsx',
];

const replacements = [
  { from: /bg-\[#fcfcfc\] dark:bg-\[#0a0a0a\]/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-white dark:bg-\[#000000\]/g, to: 'bg-slate-50 dark:bg-slate-950' },
  { from: /bg-white dark:bg-\[#111111\]/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-white dark:bg-\[#0a0a0a\]/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-white dark:bg-\[#111\]/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-white dark:bg-black/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-black dark:bg-white/g, to: 'bg-indigo-600 dark:bg-indigo-500' },
  { from: /text-white dark:text-black/g, to: 'text-white' },
  { from: /text-black dark:text-white/g, to: 'text-slate-900 dark:text-slate-50' },
  { from: /border-black\/10 dark:border-white\/10/g, to: 'border-slate-200 dark:border-slate-800' },
  { from: /border-black\/5 dark:border-white\/10/g, to: 'border-slate-200 dark:border-slate-800' },
  { from: /border-black\/5 dark:border-white\/5/g, to: 'border-slate-200 dark:border-slate-800' },
  { from: /bg-black\/5 dark:bg-white\/5/g, to: 'bg-slate-100 dark:bg-slate-800' },
  { from: /bg-black\/5 dark:bg-white\/10/g, to: 'bg-slate-100 dark:bg-slate-800' },
  { from: /hover:bg-black\/5 dark:hover:bg-white\/5/g, to: 'hover:bg-slate-100 dark:hover:bg-slate-800' },
  { from: /hover:bg-black\/5 dark:hover:bg-white\/10/g, to: 'hover:bg-slate-100 dark:hover:bg-slate-800' },
  { from: /hover:bg-black\/10 dark:hover:bg-white\/10/g, to: 'hover:bg-slate-200 dark:hover:bg-slate-700' },
  { from: /hover:bg-black\/10 dark:hover:bg-white\/20/g, to: 'hover:bg-slate-200 dark:hover:bg-slate-700' },
  { from: /text-black\/30 dark:text-white\/30/g, to: 'text-slate-400 dark:text-slate-500' },
  { from: /text-black\/40 dark:text-white\/40/g, to: 'text-slate-500 dark:text-slate-400' },
  { from: /text-black\/50 dark:text-white\/50/g, to: 'text-slate-500 dark:text-slate-400' },
  { from: /text-black\/60 dark:text-white\/60/g, to: 'text-slate-600 dark:text-slate-400' },
  { from: /text-black\/70 dark:text-white\/70/g, to: 'text-slate-600 dark:text-slate-300' },
  { from: /text-black\/80 dark:text-white\/80/g, to: 'text-slate-700 dark:text-slate-200' },
  { from: /text-black\/90 dark:text-white\/90/g, to: 'text-slate-800 dark:text-slate-100' },
  { from: /bg-black\/\[0.02\] dark:bg-white\/\[0.02\]/g, to: 'bg-slate-50 dark:bg-slate-800/50' },
  { from: /hover:text-black dark:hover:text-white/g, to: 'hover:text-slate-900 dark:hover:text-slate-50' },
  { from: /border-black\/30 dark:border-white\/30/g, to: 'border-slate-300 dark:border-slate-600' },
  { from: /placeholder-black\/30 dark:placeholder-white\/30/g, to: 'placeholder-slate-400 dark:placeholder-slate-500' },
  { from: /bg-black\/50 dark:bg-black\/80/g, to: 'bg-slate-900/50 dark:bg-slate-900/80' },
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
