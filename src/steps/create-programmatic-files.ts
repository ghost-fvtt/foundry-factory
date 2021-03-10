import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

import { Preset } from '../presets/preset';

export default async (targetDirectory: string, preset: Preset): Promise<void> => {
  if (preset.getProgrammaticFiles) {
    const spinner = ora(`Creating programmatic files`).start();
    try {
      const programmaticFiles = await preset.getProgrammaticFiles();
      for (const file of Object.entries(programmaticFiles)) {
        const targetFile = path.resolve(targetDirectory, file[0]);
        const targetFileDirectory = path.dirname(targetFile);
        await fs.ensureDir(targetFileDirectory);
        fs.writeFileSync(targetFile, file[1]);
      }
    } catch (err) {
      spinner.fail(chalk.red('Failed to create programmatic files'));
      throw err;
    }

    spinner.succeed(chalk.green('Created programmatic files'));
  }
};
