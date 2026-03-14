const { execSync } = require('child_process');
const path = require('path');

const argv = process.argv.slice(2);
const nameIndex = argv.findIndex((a) => a === '-n' || a === '--name');
const name = nameIndex !== -1 && argv[nameIndex + 1] ? argv[nameIndex + 1] : 'Migration';
const outPath = path.join('src', 'migrations', name);

execSync(
  `npx typeorm-ts-node-commonjs migration:generate ${outPath} -d src/data-source.ts`,
  { stdio: 'inherit' }
);
