import { resolve } from 'path';
import { readFileSync, existsSync, writeFileSync, watchFile } from 'fs';

export function readFile(path: string) {
  const source = resolve(process.cwd(), path);

  if (!existsSync(source)) {
    console.error(`The file "${path}" has not been found.`);
    return process.exit(1);
  } else {
    return readFileSync(source, 'utf8');
  }
}

export function writeFile(path: string, content: string, override = false) {
  const target = resolve(process.cwd(), path);

  if (!override && existsSync(target)) {
    console.error(`The file "${path}" already exists.`);
    process.exit(1);
  } else {
    writeFileSync(target, content, 'utf8');
  }
}

export function watch(path: string, cb: (content: string) => void) {
  const target = resolve(process.cwd(), path);
  watchFile(target, () => {
    const content = readFile(target);
    cb(content);
  });
}
