import path from 'path';

import type { TargetFilePath, TemplateFilePath } from '../preset';
import type { GhostGulpRollupOptions } from './ghost-gulp-rollup-preset';

export default async (
  name: string,
  ghostGulpRollupOptions: GhostGulpRollupOptions,
): Promise<Record<TargetFilePath, TemplateFilePath>> => {
  const templateDirectory = 'ghost-gulp-rollup';
  const sourceFileExtension = ghostGulpRollupOptions.useTypeScript ? '.ts' : '.js';

  return {
    ...getConfigTemplateFiles(ghostGulpRollupOptions, templateDirectory),
    ...getSourceTemplateFiles(name, templateDirectory, sourceFileExtension),
    ...getTestTemplateFiles(ghostGulpRollupOptions, templateDirectory),
    ...getCICDTemplateFiles(ghostGulpRollupOptions, templateDirectory),
  };
};

function getConfigTemplateFiles(
  { useLinting, useTesting, useTypeScript }: GhostGulpRollupOptions,
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
    configFileNames.push('.eslintignore', '.prettierignore', '.prettierrc.cjs', '.eslintrc.cjs');
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

function getTestTemplateFiles({ useTypeScript, useTesting }: GhostGulpRollupOptions, templateDirectory: string) {
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

function getCICDTemplateFiles({ cicd }: GhostGulpRollupOptions, templateDirectory: string) {
  switch (cicd) {
    case false: {
      return {};
    }
    case 'github': {
      const workflowFileNames = ['checks.yml', 'release.yml'].map((workflow) =>
        path.join('.github', 'workflows', workflow),
      );
      const wokflowTemplateFiles = workflowFileNames.map((wokflowFileName) => [
        wokflowFileName,
        path.join(templateDirectory, `${wokflowFileName}.njk`),
      ]);
      return Object.fromEntries(wokflowTemplateFiles);
    }
    case 'gitlab': {
      const fileName = '.gitlab-ci.yml';
      const templateFile = path.join(templateDirectory, `${fileName}.njk`);
      return { [fileName]: templateFile };
    }
  }
}
