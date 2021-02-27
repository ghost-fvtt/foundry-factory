import { Options } from './options';
import createWorkingDir from './steps/create-working-dir';
import createPackageJSON from './steps/create-package-json';
import createSourceDirectories from './steps/create-source-directories';
import createManifestJSON from './steps/create-manifest-json';
import createTemplateJSONIfNeeded from './steps/create-template-json-if-needed';
import createSource from './steps/create-source';
import createStyles from './steps/create-styles';
import createConfig from './steps/create-config';
import createTestIfNeeded from './steps/create-test-if-needed';

export default async (options: Options): Promise<void> => {
  await createWorkingDir(options);
  await createPackageJSON(options);
  await createSourceDirectories(options);
  await createManifestJSON(options);
  await createTemplateJSONIfNeeded(options);
  await createSource(options);
  await createStyles(options);
  await createTestIfNeeded(options);
  await createConfig(options);
};
