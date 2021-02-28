import inquirer from 'inquirer';
import path from 'path';

import { Options } from '../../options';
import { Preset, TargetFilePath, TemplateFilePath } from '../preset';
import generateProgrammaticFiles from './generate-programmatic-files';
import getTemplateFiles from './get-template-files';

export class RollupPreset implements Preset {
  protected name: string;
  protected options: Options;
  protected rollupOptions: RollupOptions;

  constructor(name: string, options: Options, rollupOptions: RollupOptions) {
    this.name = name;
    this.options = options;
    this.rollupOptions = rollupOptions;
  }

  async getProgrammaticFiles(): Promise<Record<TargetFilePath, string>> {
    return generateProgrammaticFiles(this.name, this.options, this.rollupOptions);
  }

  async getTemplateFiles(): Promise<Record<TargetFilePath, TemplateFilePath>> {
    return getTemplateFiles(this.name, this.rollupOptions);
  }

  async getTemplateVariables(): Promise<Record<string, unknown>> {
    return { ...this.rollupOptions };
  }

  async getAdditionalDirectories(): Promise<string[]> {
    return ['assets', 'fonts', 'lang', 'packs'].map((directory) => path.join('src', directory));
  }

  async getDependencies(): Promise<string[]> {
    return [];
  }

  async getDevDependencies(): Promise<string[]> {
    let devDependencies = ['@rollup/plugin-node-resolve', 'chalk', 'fs-extra', 'gulp', 'rollup', 'semver', 'yargs'];
    if (this.rollupOptions.useTypeScript) {
      devDependencies = devDependencies.concat([
        'foundry-vtt-types@github:League-of-Foundry-Developers/foundry-vtt-types#906f1cef577eac1fae22103b5875c13fbb08addf',
        'rollup-plugin-typescript2',
        'tslib',
        'typescript',
      ]);
    }
    if (this.rollupOptions.useLinting) {
      devDependencies = devDependencies.concat([
        'eslint',
        'eslint-config-prettier',
        'eslint-plugin-prettier',
        'husky',
        'lint-staged',
        'prettier',
      ]);

      if (this.rollupOptions.useTypeScript) {
        devDependencies = devDependencies.concat('@typescript-eslint/eslint-plugin', '@typescript-eslint/parser');
      }
    }
    if (this.rollupOptions.useTesting) {
      devDependencies = devDependencies.concat(['jest', 'jest-junit']);

      if (this.rollupOptions.useTypeScript) {
        devDependencies = devDependencies.concat(['@types/jest', 'ts-jest']);
      }
    }
    if (this.rollupOptions.styleType === 'less') {
      devDependencies = devDependencies.concat(['gulp-less', 'less@3']);
    }
    if (this.rollupOptions.styleType === 'scss') {
      devDependencies = devDependencies.concat(['gulp-sass', 'sass']);
    }
    return devDependencies;
  }

  async getPostInstallationCommands(): Promise<string[]> {
    return this.rollupOptions.useLinting ? ['npm exec husky init'] : [];
  }

  static async create(name: string, options: Options): Promise<RollupPreset> {
    const { features }: { features: string[] } = await inquirer.prompt([
      {
        name: 'features',
        type: 'checkbox',
        message: 'Check the features needed for your project:',
        choices: [
          {
            name: 'TypeScript',
            value: 'typescript',
          },
          { name: 'Linter / Formatter', value: 'linter', checked: true },
          { name: 'Unit Testing', value: 'test' },
          {
            name: 'CSS Pre-processor',
            value: 'cssPreProcessor',
          },
        ],
      },
    ]);
    const useTypeScript = features.find((it) => it === 'typescript') !== undefined;
    const useLinting = features.find((it) => it === 'linter') !== undefined;
    const useTesting = features.find((it) => it === 'test') !== undefined;
    const useCssPreProcessor = features.find((it) => it === 'cssPreProcessor') !== undefined;
    const styleType = await getStyleType(useCssPreProcessor);

    return new RollupPreset(name, options, { useTypeScript, useLinting, useTesting, styleType });
  }

  static async createDefault(name: string, options: Options): Promise<RollupPreset> {
    return new RollupPreset(name, options, RollupPreset.defaultRollupOptions);
  }

  private static defaultRollupOptions = {
    useTypeScript: false,
    useLinting: true,
    useTesting: false,
    styleType: 'css' as const,
  };
}

async function getStyleType(useCssPreProcessor: boolean): Promise<RollupOptions['styleType']> {
  if (!useCssPreProcessor) {
    return 'css';
  }
  const { styleType }: { styleType: 'less' | 'scss' } = await inquirer.prompt([
    {
      name: 'styleType',
      type: 'list',
      message: 'Pick a CSS pre-processor',
      choices: [
        { name: 'Sass (.scss)', value: 'scss' },
        { name: 'Less', value: 'less' },
      ],
    },
  ]);
  return styleType;
}

export interface RollupOptions {
  useTypeScript: boolean;
  useLinting: boolean;
  useTesting: boolean;
  styleType: 'css' | 'less' | 'scss';
}
