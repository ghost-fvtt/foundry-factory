import { dirname, resolve } from 'path';
import { URL } from 'url';

export const rootPath = resolve(dirname(new URL(import.meta.url).pathname), '..');
