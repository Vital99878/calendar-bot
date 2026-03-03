// scripts/commitlint-formatter.cjs

const ALLOWED_TYPES = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
];

const ALLOWED_SCOPES = [
  'tooling', 'repo', 'config', 'ci',
  'app', 'router',
  'api', 'query', 'mocks',
  'shared', 'ui', 'entities', 'features', 'widgets', 'pages',
  'docs',
];

module.exports = function format(report = {}) {
  const results = Array.isArray(report.results) ? report.results : [];
  const hasProblems = results.some(
    (r) => (r.errors && r.errors.length) || (r.warnings && r.warnings.length),
  );
  if (!hasProblems) return '';

  let out = '';
  for (const r of results) {
    const input = r?.input ?? '';
    out += `⧗   Введено: ${input}\n`;
    out += `✖   Сообщение коммита не соответствует требуемому формату.\n\n`;

    out += `Как правильно:\n`;
    out += `  Формат: <тип>(<scope>)?: <краткое описание>\n`;
    out += `  Пример: feat(api): добавить http client\n\n`;

    out += `Типы: ${ALLOWED_TYPES.join(', ')}\n`;
    out += `Scope (если указан): ${ALLOWED_SCOPES.join(', ')}\n\n`;

    out += `Примеры:\n`;
    out += `  chore(tooling): настроить husky и commitlint\n`;
    out += `  feat(api): добавить http client\n`;
    out += `  fix(query): исправить обработку 401\n`;
    out += `  docs(repo): обновить README\n\n`;
  }

  return out;
};
