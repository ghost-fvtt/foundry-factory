import { ValidatedCLIOptions } from './options';
import createFilesFromTemplates from './steps/create-files-from-templates';
import createProgrammaticFiles from './steps/create-programmatic-files';
import createWorkingDir from './steps/create-working-dir';
import getPreset from './steps/get-preset';
import selectTypeIfNeeded from './steps/select-type-if-needed';

export default async (
  name: string,
  targetDirectory: string,
  validatedCLIOptions: ValidatedCLIOptions,
): Promise<void> => {
  const options = await selectTypeIfNeeded(validatedCLIOptions);
  await createWorkingDir(targetDirectory, options);
  const preset = await getPreset(name, options);
  await createProgrammaticFiles(name, targetDirectory, options, preset);
  await createFilesFromTemplates(name, targetDirectory, options, preset);
};
