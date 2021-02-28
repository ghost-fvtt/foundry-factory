import path from 'path';
import fs from 'fs-extra';

import { rootPath } from './file-utils';

export const version: string = JSON.parse(fs.readFileSync(path.resolve(rootPath, 'package.json')).toString()).version;
