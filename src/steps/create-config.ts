import chalk from 'chalk';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import ora from 'ora';
import path from 'path';

import { Options } from '../options';
import { getFileTypeForCSSPreprocessor } from '../utils/css-preprocessor';
import { rootPath } from '../utils/file-utils';

const templatePath = path.resolve(rootPath, 'template');

export default async (options: Options): Promise<void> => {
  const spinner = ora('Creating configuration files').start();

  try {
    await createTemplatedConfigsConfig(options);
  } catch (err) {
    spinner.fail(chalk.red('Failed to create configuration files'));
    throw err;
  }
  spinner.succeed(chalk.green('Created configuration files'));
};

async function createTemplatedConfigsConfig(options: Options) {
  nunjucks.configure(templatePath);

  const entryPoint = path.join('src', 'module', `${options.name}${options.typescript ? '.ts' : '.js'}`);
  const templateVariables = {
    ...options,
    type: options.system ? 'system' : 'module',
    entryPoint,
    stylesExtension: `.${getFileTypeForCSSPreprocessor(options.css)}`,
    sourceFileExtension: options.typescript ? '.ts' : '.js',
  };

  const configFileNames = ['rollup.config.js', 'README.md', '.editorconfig', '.nvmrc', '.gitignore', 'gulpfile.js'];

  if (options.test) {
    configFileNames.push('jest.config.js');
  }

  if (options.typescript) {
    configFileNames.push('tsconfig.json');
  }

  if (options.lint) {
    configFileNames.push('.eslintignore', '.prettierignore', '.prettierrc.js', '.eslintrc.js');
    if (options.typescript) {
      configFileNames.push('tsconfig.eslint.json');
    }
  }

  for (const configFileName of configFileNames) {
    const configFile = path.resolve(options.projectDirectory, configFileName);
    const configTemplateName = `${configFileName}.njk`;
    const renderedConfig = nunjucks.render(configTemplateName, templateVariables);
    fs.writeFileSync(configFile, renderedConfig);
  }
}
