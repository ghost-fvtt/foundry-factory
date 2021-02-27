import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

import { Options } from '../options';
import { getFileTypeForCSSPreprocessor } from '../utils/css-preprocessor';
import { rootPath } from '../utils/file-utils.js';

export default async (options: Options): Promise<void> => {
  const fileType = getFileTypeForCSSPreprocessor(options.css);
  const styleFileName = `${options.name}.${fileType}`;
  const spinner = ora(`Creating ${chalk.green(styleFileName)}`).start();

  try {
    const styleTemplateFile = path.resolve(rootPath, 'template', 'src', 'styles', `entryPoint.${fileType}`);
    const styleFile = path.resolve(options.projectDirectory, 'src', 'styles', styleFileName);
    fs.copyFileSync(styleTemplateFile, styleFile);
  } catch (err) {
    spinner.fail(chalk.red(`Failed to create ${styleFileName}`));
    throw err;
  }
  spinner.succeed(chalk.green(`Created ${styleFileName}`));
};
