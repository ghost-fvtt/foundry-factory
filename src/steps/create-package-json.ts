import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

import { Options } from '../options';

export default async (options: Options): Promise<void> => {
  const spinner = ora(`Creating ${chalk.green('package.json')}`).start();

  const _package = generatePackage(options);

  try {
    await fs.writeJSON(path.join(options.projectDirectory, 'package.json'), _package, { spaces: 2 });
  } catch (err) {
    spinner.fail(chalk.red('Failed to create package.json'));
    throw err;
  }

  spinner.succeed(chalk.green('Created package.json'));
};

export function generatePackage(options: Options): Package {
  const codeFileTypes = options.typescript ? ['ts', 'js'] : ['js'];
  const codeFileExtensions = codeFileTypes.map((fileType) => `.${fileType}`);
  const stylesFileType = getFileTypeForCSSPreprocessor(options.css);

  const updateFoundryVTTTypesScript = options.typescript
    ? 'npm install --save-dev github:League-of-Foundry-Developers/foundry-vtt-types#foundry-0.7.9'
    : undefined;

  const lintScript = options.lint ? `eslint --ext ${codeFileExtensions.join(',')} .` : undefined;
  const lintFixScript = options.lint ? `eslint --ext ${codeFileExtensions.join(',')} --fix .` : undefined;
  const formatScript = options.lint
    ? `prettier --write './**/*.(${codeFileTypes.join('|')}|json|${stylesFileType})'`
    : undefined;

  const testScript = options.test ? 'jest' : undefined;
  const testCIScript = options.test ? 'jest --ci --reporters=default --reporters=jest-junit' : undefined;

  const lintStagedConfiguration = options.lint
    ? { [`*.(${codeFileTypes.join('|')})`]: 'eslint --fix', [`*.(json|${stylesFileType})`]: 'prettier --write' }
    : undefined;

  return {
    private: true,
    name: options.name,
    version: '0.0.0',
    description: '',
    license: '',
    homepage: '',
    repository: {
      type: 'git',
      url: '',
    },
    bugs: {
      url: '',
    },
    contributors: [
      {
        name: '',
        email: '',
      },
    ],
    scripts: {
      build: 'gulp build',
      'build:watch': 'gulp watch',
      'link-project': 'gulp link',
      clean: 'gulp clean && gulp link --clean',
      updateFoundryVTTTypes: updateFoundryVTTTypesScript,
      'bump-version': 'gulp bumpVersion',
      lint: lintScript,
      'lint:fix': lintFixScript,
      format: formatScript,
      test: testScript,
      'test:ci': testCIScript,
    },
    devDependencies: {},
    'lint-staged': lintStagedConfiguration,
  };
}

interface Package {
  private: true;
  name: string;
  version: string;
  description: string;
  license: string;
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  bugs: {
    url: string;
  };
  contributors: [
    {
      name: string;
      email: string;
    },
  ];
  scripts: {
    build: string;
    'build:watch': string;
    'link-project': string;
    clean: string;
    updateFoundryVTTTypes?: string;
    'bump-version': string;
    lint?: string;
    'lint:fix'?: string;
    format?: string;
    test?: string;
    'test:ci'?: string;
  };
  devDependencies: Record<string, never>;
  'lint-staged'?: Partial<Record<string, string>>;
}

function getFileTypeForCSSPreprocessor(preprocessor: 'less' | 'sass' | undefined) {
  switch (preprocessor) {
    case 'less':
      return 'less';
    case 'sass':
      return 'scss';
    case undefined:
      return 'css';
    default:
      throw new Error(`Unsupported CSS preprocessor ${preprocessor}`);
  }
}
