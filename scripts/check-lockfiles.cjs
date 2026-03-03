/* scripts/check-lockfiles.js */
const fs = require('fs');

const forbidden = [
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
  'bun.lockb',
];

const found = forbidden.filter((f) => fs.existsSync(f));

if (found.length > 0) {
  console.error('\n❌ В репозитории найдены запрещённые lock-файлы:');
  for (const f of found) console.error(' - ' + f);
  console.error('\nИспользуй только pnpm. Удали эти файлы и повтори команду.\n');
  process.exit(1);
}

console.log('✅ Lockfiles OK (pnpm-only).');
