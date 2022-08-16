import path from 'path';

import type { TargetFilePath, TemplateFilePath } from '../preset';
import type { GhostGulpRollupOptions } from './ghost-gulp-rollup-preset';

export const getTemplateFiles = async (
  packageId: string,
  ghostGulpRollupOptions: GhostGulpRollupOptions,
): Promise<Record<TargetFilePath, TemplateFilePath>> => {
  const templateDirectory = 'ghost-gulp-rollup';
  const sourceFileExtension = ghostGulpRollupOptions.useTypeScript ? '.ts' : '.js';

  return {
    ...getConfigTemplateFiles(ghostGulpRollupOptions, templateDirectory),
    ...getSourceTemplateFiles(packageId, templateDirectory, sourceFileExtension),
    ...getTestTemplateFiles(ghostGulpRollupOptions, templateDirectory),
    ...getCICDTemplateFiles(ghostGulpRollupOptions, templateDirectory),
  };
};

function getConfigTemplateFiles(
  { useLinting, useTesting, useTypeScript }: GhostGulpRollupOptions,
  templateDirectory: string,
): Record<TargetFilePath, TemplateFilePath> {
  const configFileNames = [
    '.editorconfig',
    '.gitignore',
    '.gulp.json',
    '.nvmrc',
    'foundryconfig.json',
    'gulpfile.mjs',
    'README.md',
    'rollup.config.mjs',
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

function getSourceTemplateFiles(packageId: string, templateDirectory: string, sourceFileExtension: string) {
  const relativeSourceDirectory = path.join('src', 'module');
  const templateFileNames = ['entryPoint.njk', 'preloadTemplates.njk', 'settings.njk'];

  return Object.fromEntries(
    templateFileNames
      .map((templateFileName) => path.join(relativeSourceDirectory, templateFileName))
      .map((templateFilePath) => [
        getNameForSourceTemplate(templateFilePath, sourceFileExtension, packageId),
        path.join(templateDirectory, templateFilePath),
      ]),
  );
}

function getNameForSourceTemplate(fileName: string, sourceFileExtension: string, packageId: string): string {
  return fileName.replace('entryPoint.njk', `${packageId}.njk`).replace('.njk', sourceFileExtension);
}

function getTestTemplateFiles({ useTypeScript, useTesting }: GhostGulpRollupOptions, templateDirectory: string) {
  if (!useTesting) {
    return {};
  }
  const testTemplateFiles: [string, string][] = [[`example.test.${useTypeScript ? 'ts' : 'js'}`, 'example.test.njk']];

  if (useTypeScript) {
    testTemplateFiles.push(['tsconfig.json', 'tsconfig.json.njk']);
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
