import { readdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { URL } from 'url';

export async function* getFilesRecursively(directory: string): AsyncGenerator<string> {
  const dirents = await readdir(directory, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(directory, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFilesRecursively(res);
    } else {
      yield res;
    }
  }
}

export const projectRootPath = resolve(dirname(new URL(import.meta.url).pathname), '..', '..');
