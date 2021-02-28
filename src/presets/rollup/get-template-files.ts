import path from 'path';

import { TargetFilePath, TemplateFilePath } from '../preset';
import { RollupOptions } from './rollup-preset';

export default async (
  name: string,
  rollupOptions: RollupOptions,
): Promise<Record<TargetFilePath, TemplateFilePath>> => {
  const templateDirectory = 'rollup';
  const sourceFileExtension = rollupOptions.useTypeScript ? '.ts' : '.js';

  return {
    ...getConfigTemplateFiles(rollupOptions, templateDirectory),
    ...getSourceTemplateFiles(name, templateDirectory, sourceFileExtension),
    ...getTestTemplateFiles(rollupOptions, templateDirectory),
  };
};

function getConfigTemplateFiles(
  { useLinting, useTesting, useTypeScript }: RollupOptions,
  templateDirectory: string,
): Record<TargetFilePath, TemplateFilePath> {
  const configFileNames = [
    'rollup.config.js',
    'README.md',
    '.editorconfig',
    '.nvmrc',
    '.gitignore',
    'gulpfile.js',
    'foundryconfig.json',
  ];

  if (useTesting) {
    configFileNames.push('jest.config.js');
  }

  if (useTypeScript) {
    configFileNames.push('tsconfig.json');
  }

  if (useLinting) {
    configFileNames.push('.eslintignore', '.prettierignore', '.prettierrc.js', '.eslintrc.js');
    if (useTypeScript) {
      configFileNames.push('tsconfig.eslint.json');
    }
  }

  const configTemplateFiles = configFileNames.map((configFileName) => [
    configFileName,
    path.join(templateDirectory, `${configFileName}.njk`),
  ]);
  return Object.fromEntries(configTemplateFiles);
}

function getSourceTemplateFiles(name: string, templateDirectory: string, sourceFileExtension: string) {
  const relativeSourceDirectory = path.join('src', 'module');
  const templateFileNames = ['entryPoint.njk', 'preloadTemplates.njk', 'settings.njk'];

  return Object.fromEntries(
    templateFileNames
      .map((templateFileName) => path.join(relativeSourceDirectory, templateFileName))
      .map((templateFilePath) => [
        getNameForSourceTemplate(templateFilePath, sourceFileExtension, name),
        path.join(templateDirectory, templateFilePath),
      ]),
  );
}

function getNameForSourceTemplate(fileName: string, sourceFileExtension: string, name: string): string {
  return fileName.replace('entryPoint.njk', `${name}.njk`).replace('.njk', sourceFileExtension);
}

function getTestTemplateFiles({ useTypeScript, useTesting }: RollupOptions, templateDirectory: string) {
  if (!useTesting) {
    return {};
  }
  const testTemplateFiles: [string, string][] = [[`example.test.${useTypeScript ? 'ts' : 'js'}`, 'example.test.njk']];

  if (useTypeScript) {
    testTemplateFiles.push(['tsconfig.test.json', 'tsconfig.test.json.njk']);
  }
  return Object.fromEntries(
    testTemplateFiles.map((pair) => [path.join('test', pair[0]), path.join(templateDirectory, 'test', pair[1])]),
  );
}
