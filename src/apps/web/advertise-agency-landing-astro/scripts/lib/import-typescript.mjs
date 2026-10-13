// Load production TypeScript contracts for Node-based content regression tests.
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';

const modules = new Map();
export async function moduleURL(path) {
  const absolute = resolve(path);
  if (modules.has(absolute)) return modules.get(absolute);
  const source = await readFile(absolute, 'utf8');
  if (absolute.endsWith('.json')) {
    const code = `export default ${JSON.stringify(JSON.parse(source))};`;
    const url = `data:text/javascript;base64,${Buffer.from(code)
      .toString('base64')}`;
    modules.set(absolute, url);
    return url;
  }
  let code = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText;
  const imports = [...code.matchAll(/from ['"]([^'"]+)['"]/g)];
  for (const match of imports) {
    const specifier = match[1];
    // Match the application aliases; JSON modules expose the actual fixture.
    const localPath = specifier.startsWith('@/data/')
      ? resolve('data', specifier.slice('@/data/'.length))
      : specifier.startsWith('@/')
        ? resolve('src', specifier.slice(2))
        : specifier.startsWith('.')
          ? resolve(dirname(absolute), specifier) : undefined;
    const url = localPath
      ? await moduleURL(localPath.endsWith('.json')
        ? localPath : `${localPath}.ts`)
      : import.meta.resolve(specifier);
    code = code.replace(match[0], `from ${JSON.stringify(url)}`);
  }
  const url = `data:text/javascript;base64,${Buffer.from(code)
    .toString('base64')}`;
  modules.set(absolute, url);
  return url;
}
