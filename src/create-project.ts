import { Options } from './options.js';
import createWorkingDir from './steps/create-working-dir.js';
import createPackageJSON from './steps/create-package-json.js';
import createSourceDirectories from './steps/create-source-directories.js';
import createManifestJSON from './steps/create-manifest-json.js';
import createTemplateJSONIfNeeded from './steps/create-template-json-if-needed.js';

export default async (options: Options): Promise<void> => {
  await createWorkingDir(options);
  await createPackageJSON(options);
  await createSourceDirectories(options);
  await createManifestJSON(options);
  await createTemplateJSONIfNeeded(options);
};
