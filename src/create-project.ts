// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import chalk from 'chalk';

import { version } from './utils/version';

import type { ValidatedCLIOptions } from './options';
import { getPreset } from './steps/get-preset';
import { selectTypeIfNeeded } from './steps/select-type-if-needed';
import { createWorkingDir } from './steps/create-working-dir';
import { initializeGit } from './steps/initialize-git';
import { createProgrammaticFiles } from './steps/create-programmatic-files';
import { createFilesFromTemplates } from './steps/create-files-from-templates';
import { createAdditionalDirectories } from './steps/create-additional-directories';
import { installDependencies } from './steps/install-dependencies';
import { executePostInstallationCommands } from './steps/execute-post-installation-commands';

export const createProject = async (
  packageId: string,
  targetDirectory: string,
  validatedCLIOptions: ValidatedCLIOptions,
): Promise<void> => {
  console.log(chalk.bold(chalk.cyan(`Foundry Factory ${version}`)));

  try {
    const options = await selectTypeIfNeeded(validatedCLIOptions);
    await createWorkingDir(targetDirectory, options);
    await initializeGit(targetDirectory, options);
    const preset = await getPreset(packageId, options);
    await createProgrammaticFiles(targetDirectory, preset);
    await createFilesFromTemplates(packageId, targetDirectory, options, preset);
    await createAdditionalDirectories(targetDirectory, preset);
    await installDependencies(targetDirectory, options, preset);
    await executePostInstallationCommands(targetDirectory, preset);
  } catch (err) {
    console.error(chalk.red(`Failed to create project at ${targetDirectory}`));
    console.error(chalk.red(err));
    process.exit(1);
  }
};
