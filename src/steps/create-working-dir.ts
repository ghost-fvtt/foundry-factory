import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { Options } from '../options';

export default async ({ projectDirectory, force }: Options): Promise<void> => {
  const spinner = ora('Initializing working directory').start();

  try {
    if (fs.existsSync(projectDirectory)) {
      const content = await fs.readdir(projectDirectory);
      if (content.length !== 0) {
        if (force) {
          spinner.warn(chalk.yellow(`The specified path ${chalk.green(projectDirectory)} is not empty`));
          console.log(chalk.yellow("  '--force' was set, existing files will be lost"));
          console.log(chalk.yellow('  Overwriting...'));
          await fs.emptyDir(projectDirectory);
        } else {
          spinner.fail(chalk.red(`The specified path ${chalk.green(projectDirectory)} is not empty`));
          console.error(chalk.red(`  Use ${chalk.blueBright('-f, --force')} to overwrite an existing directory`));
          console.error(chalk.red('  Aborting...'));
          throw new Error('The specified path is not empty');
        }
      }
    }
    await fs.ensureDir(projectDirectory);
  } catch (err) {
    spinner.fail(chalk.red('Failed to create working directory'));
    throw err;
  }

  spinner.succeed(chalk.green('Created working directory'));
};
