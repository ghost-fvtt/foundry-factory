import chalk from 'chalk';
import { exec } from 'child_process';
import ora from 'ora';
import { promisify } from 'util';

import { Preset } from '../presets/preset';

const execAsync = promisify(exec);

export default async (targetDirectory: string, preset: Preset): Promise<void> => {
  const spinner = ora('Executing post installation commands').start();
  try {
    const postInstallationCommands = await preset.getPostInstallationCommands();
    for (const command of postInstallationCommands) {
      await execAsync(command, {
        cwd: targetDirectory,
      });
    }
  } catch (err) {
    spinner.fail(chalk.red('Failed to execute post installation commands'));
    throw err;
  }
  spinner.succeed(chalk.green('Executed post installation commands'));
};
