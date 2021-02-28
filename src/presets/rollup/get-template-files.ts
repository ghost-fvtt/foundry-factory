import path from 'path';

import { Options } from '../../options';
import { getFilesRecursively, rootPath } from '../../utils/file-utils';
import { TargetFilePath, TemplateFilePath } from '../preset';
import { RollupOptions } from './rollup-preset';

export default async (
  name: string,
  options: Options,
  rollupOptions: RollupOptions,
): Promise<Record<TargetFilePath, TemplateFilePath>> => {
  const templateDirectory = path.resolve(rootPath, 'template', 'rollup');
  const sourceFileExtension = rollupOptions.useTypeScript ? '.ts' : '.js';

  return {
    ...getConfigTemplateFiles(rollupOptions, templateDirectory),
    ...(await getSourceTemplateFiles(name, templateDirectory, sourceFileExtension)),
    ...getTestTemplateFiles(rollupOptions, templateDirectory),
  };
};

function getConfigTemplateFiles(
  { useLinting, useTesting, useTypeScript }: RollupOptions,
  templateDirectory: string,
): Record<TargetFilePath, TemplateFilePath> {
  const configFileNames = ['rollup.config.js', 'README.md', '.editorconfig', '.nvmrc', '.gitignore', 'gulpfile.js'];

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
    path.resolve(templateDirectory, `${configFileName}.njk`),
  ]);
  return Object.fromEntries(configTemplateFiles);
}

async function getSourceTemplateFiles(name: string, templateDirectory: string, sourceFileExtension: string) {
  const sourceTemplateFiles: [TargetFilePath, TemplateFilePath][] = [];
  const sourceTemplateDirectory = path.resolve(templateDirectory, 'src', 'module');
  for await (const templateFileName of getFilesRecursively(sourceTemplateDirectory)) {
    const sourceFileName = getNameForSourceTemplate(templateFileName, sourceFileExtension, name).replace(
      `${templateDirectory}/`,
      '',
    );
    sourceTemplateFiles.push([sourceFileName, templateFileName]);
  }
  return Object.fromEntries(sourceTemplateFiles);
}

function getNameForSourceTemplate(templateFileName: string, sourceFileExtension: string, name: string): string {
  return templateFileName.replace('entryPoint.njk', `${name}.njk`).replace('.njk', sourceFileExtension);
}

function getTestTemplateFiles({ useTypeScript, useTesting }: RollupOptions, templateDirectory: string) {
  if (!useTesting) {
    return {};
  }
  const testTemplateFiles: [string, string][] = [[`example.test.${useTypeScript ? 'ts' : 'js'}`, 'example.test.njk']];

  if (useTypeScript) {
    testTemplateFiles.push(['tsconfig.test.json', 'tsconfig.test.json.njk']);
  }
  const result = Object.fromEntries(
    testTemplateFiles.map((pair) => [path.join('test', pair[0]), path.resolve(templateDirectory, 'test', pair[1])]),
  );
  console.log(result);
  return result;
}
