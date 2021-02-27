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
  if (!options.test) {
    return;
  }
  const spinner = ora('Creating test files').start();

  try {
    await createTemplatedTestFiles(options);
  } catch (err) {
    spinner.fail(chalk.red('Failed to create test files'));
    throw err;
  }
  spinner.succeed(chalk.green('Created test files'));
};

function createTemplatedTestFiles(options: Options) {
  nunjucks.configure(path.resolve(templatePath, 'test'));

  const templateVariables = {
    typescript: options.typescript,
  };

  const testFilesAndTemplates = [
    { template: 'example.test.njk', target: `example.test.${options.typescript ? 'ts' : 'js'}` },
  ];

  if (options.typescript) {
    testFilesAndTemplates.push({ template: 'tsconfig.test.json.njk', target: 'tsconfig.test.json' });
  }
  const testDirectory = path.resolve(options.projectDirectory, 'test');

  if (!fs.existsSync(testDirectory)) {
    fs.mkdirsSync(testDirectory);
  }

  for (const testFileNameAndTemplate of testFilesAndTemplates) {
    const testFile = path.resolve(testDirectory, testFileNameAndTemplate.target);
    const renderedConfig = nunjucks.render(testFileNameAndTemplate.template, templateVariables);
    fs.writeFileSync(testFile, renderedConfig);
  }
}
