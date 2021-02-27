import chalk from 'chalk';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import ora from 'ora';
import path from 'path';

import { Options } from '../options';
import { getFilesRecursively, rootPath } from '../utils/file-utils';

export default async (options: Options): Promise<void> => {
  const spinner = ora('Creating source files').start();

  try {
    const fileExtension = options.typescript ? '.ts' : '.js';
    const templateDirectory = path.resolve(rootPath, 'template');
    const sourceTemplateDirectory = path.resolve(templateDirectory, 'src', 'module');
    const sourceDirectory = path.resolve(options.projectDirectory, 'src', 'module');

    const templateVariables = {
      type: options.system ? 'system' : 'module',
      language: options.typescript ? 'TypeScript' : 'JavaScript',
      name: options.name,
      shortTitle: options.name,
      longTitle: options.name,
      typescript: options.typescript,
    };

    await renderTemplates(sourceDirectory, sourceTemplateDirectory, fileExtension, options.name, templateVariables);
  } catch (err) {
    spinner.fail(chalk.red('Failed to create source files'));
    throw err;
  }
  spinner.succeed(chalk.green('Created source files'));
};

async function renderTemplates(
  sourceDirectory: string,
  sourceTemplateDirectory: string,
  fileExtension: string,
  projectName: string,
  templateVariables: Record<string, unknown>,
) {
  nunjucks.configure(sourceTemplateDirectory);
  for await (const template of getFilesRecursively(sourceTemplateDirectory)) {
    const sourceFilePath = getNameForTemplate(template, fileExtension, projectName).replace(
      sourceTemplateDirectory,
      sourceDirectory,
    );
    const renderedTemplate = nunjucks.render(template, templateVariables);
    const directory = path.dirname(sourceFilePath);
    if (!fs.existsSync(directory)) {
      await fs.mkdirs(directory);
    }
    fs.writeFileSync(sourceFilePath, renderedTemplate);
  }
}

function getNameForTemplate(templateName: string, fileExtension: string, projectName: string): string {
  const targetFileName = templateName === 'entryPoint.njk' ? `${projectName}.njk` : templateName;
  return targetFileName.replace('.njk', fileExtension);
}
