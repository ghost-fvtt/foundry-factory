import chalk from 'chalk';

import { ValidatedCLIOptions } from './options';
import createAdditionalDirectories from './steps/create-additional-directories';
import createFilesFromTemplates from './steps/create-files-from-templates';
import createProgrammaticFiles from './steps/create-programmatic-files';
import createWorkingDir from './steps/create-working-dir';
import executePostInstallationCommands from './steps/execute-post-installation-commands';
import getPreset from './steps/get-preset';
import initializeGit from './steps/initialize-git';
import installDependencies from './steps/install-dependencies';
import selectTypeIfNeeded from './steps/select-type-if-needed';
import { version } from './utils/version';

export default async (
  name: string,
  targetDirectory: string,
  validatedCLIOptions: ValidatedCLIOptions,
): Promise<void> => {
  console.log(chalk.bold(chalk.cyan(`Foundry Factory ${version}`)));

  const options = await selectTypeIfNeeded(validatedCLIOptions);
  await createWorkingDir(targetDirectory, options);
  const preset = await getPreset(name, options);
  await createProgrammaticFiles(targetDirectory, preset);
  await createFilesFromTemplates(name, targetDirectory, options, preset);
  await createAdditionalDirectories(targetDirectory, preset);
  await installDependencies(targetDirectory, options, preset);
  await initializeGit(targetDirectory, options);
  await executePostInstallationCommands(targetDirectory, preset);
};
