import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

import { Options } from '../options';

export default async ({ projectDirectory }: Options): Promise<void> => {
  const spinner = ora('Creating source directories').start();

  try {
    const directories = ['assets', 'fonts', 'lang', 'module', 'packs', 'styles', 'templates'].map((directory) =>
      path.join('src', directory),
    );

    for (const directory of directories) {
      await fs.mkdirs(path.resolve(projectDirectory, directory));
    }
  } catch (err) {
    spinner.fail(chalk.red('Failed to create source directories'));
    throw err;
  }

  spinner.succeed(chalk.green('Created source directories'));
};
