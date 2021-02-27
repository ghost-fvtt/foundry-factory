import { readdir } from 'fs/promises';
import { resolve } from 'path';

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
