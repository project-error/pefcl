#!/usr/bin/env node

const { writeFileSync, readdirSync } = require('fs');

const output = 'locales/index.ts';
const input = 'locales';

const rawLanguages = readdirSync(input);
const languages = rawLanguages.filter((lng) => lng !== 'index.ts');

const importData = [];
const exportData = [];

/* Add export line */
exportData.push('export default {');

languages.forEach((lng) => {
  const language = lng.replace('-', '');

  importData.push(`import ${language} from './${lng}/default.json';`);
  exportData.push(`  ${language},`);
});

/* Add spacing after imports */
importData.push(`\n`);

/* Add closing bracket for exports & ending line */
exportData.push('};');
exportData.push('');

writeFileSync(output, importData.join('\n') + exportData.join('\n'));
