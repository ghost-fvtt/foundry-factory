// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import chalk from 'chalk';
import { exec } from 'child_process';
import ora from 'ora';
import { promisify } from 'util';

import type { Options } from '../options';
import type { Preset } from '../presets/preset';

const execAsync = promisify(exec);

export const installDependencies = async (
  targetDirectory: string,
  { deps, packageManager }: Options,
  preset: Preset,
): Promise<void> => {
  if (!deps || (!preset.getDependencies && !preset.getDevDependencies)) {
    return;
  }
  const spinner = ora('Installing dependencies').start();
  try {
    const dependencies = preset.getDependencies ? await preset.getDependencies() : [];
    const devDependencies = preset.getDevDependencies ? await preset.getDevDependencies() : [];

    switch (packageManager) {
      case 'npm': {
        await installWithNPM(targetDirectory, dependencies, devDependencies);
        break;
      }
      case 'yarn': {
        await installWithYarn(targetDirectory, dependencies, devDependencies);
        break;
      }
      case 'yarn2': {
        await installWithYarn2(targetDirectory, dependencies, devDependencies);
        break;
      }
    }
  } catch (err) {
    spinner.fail(chalk.red('Failed to install dependencies'));
    throw err;
  }
  spinner.succeed(chalk.green('Installed dependencies'));
};

async function installWithNPM(
  targetDirectory: string,
  dependencies: string[],
  devDependencies: string[],
): Promise<void> {
  const baseCommand = ['npm', 'install', '--loglevel', 'error'];

  if (dependencies.length > 0) {
    await execAsync(baseCommand.concat(['--save']).concat(dependencies).join(' '), {
      cwd: targetDirectory,
    });
  }
  if (devDependencies.length > 0) {
    await execAsync(baseCommand.concat(['--save-dev']).concat(devDependencies).join(' '), {
      cwd: targetDirectory,
    });
  }
}

async function installWithYarn(
  targetDirectory: string,
  dependencies: string[],
  devDependencies: string[],
): Promise<void> {
  const baseCommand = ['yarn', 'add'];

  if (dependencies.length > 0) {
    await execAsync(baseCommand.concat(dependencies).join(' '), {
      cwd: targetDirectory,
    });
  }
  if (devDependencies.length > 0) {
    await execAsync(baseCommand.concat(['--dev']).concat(devDependencies).join(' '), {
      cwd: targetDirectory,
    });
  }
}

async function installWithYarn2(
  targetDirectory: string,
  dependencies: string[],
  devDependencies: string[],
): Promise<void> {
  await execAsync('yarn set version stable', {
    cwd: targetDirectory,
  });

  const baseCommand = ['yarn', 'add'];

  if (dependencies.length > 0) {
    await execAsync(baseCommand.concat(dependencies).join(' '), {
      cwd: targetDirectory,
    });
  }
  if (devDependencies.length > 0) {
    await execAsync(baseCommand.concat(['--dev']).concat(devDependencies).join(' '), {
      cwd: targetDirectory,
    });
  }
}
