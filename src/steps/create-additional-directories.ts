import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { Options } from '../options';

import { Preset } from '../presets/preset';

export default async (targetDirectory: string, { git }: Options, preset: Preset): Promise<void> => {
  const spinner = ora(`Creating additional directories`).start();
  try {
    const additionalDirectories = await preset.getAdditionalDirectories();
    for (const directory of additionalDirectories) {
      const directoryToCreate = path.resolve(targetDirectory, directory);
      await fs.ensureDir(directoryToCreate);
      if (git && fs.readdirSync(directoryToCreate).length === 0) {
        fs.createFileSync(path.resolve(directoryToCreate, '.gitkeep'));
      }
    }
  } catch (err) {
    spinner.fail(chalk.red('Failed to create additional directories'));
    throw err;
  }

  spinner.succeed(chalk.green('Created additional directories'));
};
