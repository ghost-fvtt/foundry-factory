import chalk from 'chalk';
import { exec } from 'child_process';
import ora from 'ora';
import { promisify } from 'util';

import { Options } from '../options';

const execAsync = promisify(exec);

export default async (targetDirectory: string, options: Options): Promise<void> => {
  if (!options.git) {
    return;
  }
  const spinner = ora('Initializing git repository').start();
  try {
    await execAsync('git --version');
  } catch (err) {
    spinner.warn(chalk.yellow('Skipped initializing git repository because git does not seem to be installed'));
    options.git = false;
    return;
  }
  try {
    try {
      await execAsync('git rev-parse --show-toplevel', { cwd: targetDirectory });
      spinner.succeed(chalk.green('Existing git repository detected.'));
      return;
    } catch (err) {
      await execAsync('git init', { cwd: targetDirectory });
    }
  } catch (err) {
    spinner.fail(chalk.red('Failed to initialize git repository'));
    throw err;
  }
  spinner.succeed(chalk.green('Initialized new git repository'));
};
