import chalk from 'chalk';
import { exec } from 'child_process';
import ora from 'ora';
import { promisify } from 'util';

import { Options } from '../options';
import { Preset } from '../presets/preset';

const execAsync = promisify(exec);

export default async (targetDirectory: string, { deps }: Options, preset: Preset): Promise<void> => {
  if (!deps) {
    return;
  }
  const spinner = ora('Installing dependencies').start();
  try {
    const dependencies = await preset.getDependencies();
    const devDependencies = await preset.getDevDependencies();
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
  } catch (err) {
    spinner.fail(chalk.red('Failed to install dependencies'));
    throw err;
  }
  spinner.succeed(chalk.green('Installed dependencies'));
};
