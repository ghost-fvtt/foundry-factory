// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { dirname, resolve } from 'path';
import { URL, fileURLToPath } from 'url';

export const rootPath = resolve(dirname(fileURLToPath(new URL(import.meta.url))), '..');
