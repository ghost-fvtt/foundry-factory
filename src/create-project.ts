import { Options } from './options.js';
import createWorkingDir from './steps/create-working-dir.js';
import createPackageJSON from './steps/create-package-json.js';

export default async (options: Options): Promise<void> => {
  await createWorkingDir(options);
  await createPackageJSON(options);
};
