import chalk from 'chalk';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import ora from 'ora';
import path from 'path';

import { rootPath } from '../utils/file-utils';

import type { Options } from '../options';
import type { Preset } from '../presets/preset';

export const createFilesFromTemplates = async (
  packageId: string,
  targetDirectory: string,
  options: Options,
  preset: Preset,
): Promise<void> => {
  if (preset.getTemplateFiles) {
    const spinner = ora(`Creating files from templates`).start();
    try {
      const templateFiles = await preset.getTemplateFiles();
      const templateVariables = {
        packageId,
        ...options,
        ...(preset.getTemplateVariables ? await preset.getTemplateVariables() : {}),
      };
      const templateDirectory = path.resolve(rootPath, 'template');

      nunjucks.configure(templateDirectory);

      for (const file of Object.entries(templateFiles)) {
        const targetFile = path.resolve(targetDirectory, file[0]);
        const targetFileDirectory = path.dirname(targetFile);
        await fs.ensureDir(targetFileDirectory);
        const renderedTemplate = nunjucks.render(file[1], templateVariables);
        fs.writeFileSync(targetFile, renderedTemplate);
      }
    } catch (err) {
      spinner.fail(chalk.red('Failed to create files from templates'));
      throw err;
    }

    spinner.succeed(chalk.green('Created files from templates'));
  }
};
