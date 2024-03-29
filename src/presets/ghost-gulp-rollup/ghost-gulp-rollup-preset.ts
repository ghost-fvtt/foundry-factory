// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import inquirer from 'inquirer';
import path from 'path';

import type { Options } from '../../options';
import type { Preset, TargetFilePath, TemplateFilePath } from '../preset';
import { generateProgrammaticFiles } from './generate-programmatic-files';
import { getTemplateFiles } from './get-template-files';

export class GhostGulpRollupPreset implements Preset {
  protected packageId: string;
  protected options: Options;
  protected ghostGulpRollupOptions: GhostGulpRollupOptions;

  constructor(packageId: string, options: Options, ghostGulpRollupOptions: GhostGulpRollupOptions) {
    this.packageId = packageId;
    this.options = options;
    this.ghostGulpRollupOptions = ghostGulpRollupOptions;
  }

  async getProgrammaticFiles(): Promise<Record<TargetFilePath, string>> {
    return generateProgrammaticFiles(this.packageId, this.options, this.ghostGulpRollupOptions);
  }

  async getTemplateFiles(): Promise<Record<TargetFilePath, TemplateFilePath>> {
    return getTemplateFiles(this.packageId, this.ghostGulpRollupOptions);
  }

  async getTemplateVariables(): Promise<Record<string, unknown>> {
    const eslintPlugins = [];
    if (this.ghostGulpRollupOptions.useTypeScript) {
      eslintPlugins.push("'@typescript-eslint'");
    }
    if (this.ghostGulpRollupOptions.useTesting) {
      eslintPlugins.push("'jest'");
    }
    return { ...this.ghostGulpRollupOptions, eslintPlugins };
  }

  async getAdditionalDirectories(): Promise<string[]> {
    return ['assets', 'fonts', 'lang', 'packs'].map((directory) => path.join('src', directory)).concat('dist');
  }

  async getDependencies(): Promise<string[]> {
    return [];
  }

  async getDevDependencies(): Promise<string[]> {
    let devDependencies = [
      '@rollup/plugin-node-resolve',
      '@rollup/stream',
      'fs-extra',
      'gulp',
      'gulp-sourcemaps',
      'rollup@2',
      'vinyl-buffer',
      'vinyl-source-stream',
      'yargs',
    ];
    if (this.ghostGulpRollupOptions.useTypeScript) {
      devDependencies = devDependencies.concat([
        '@league-of-foundry-developers/foundry-vtt-types',
        '@rollup/plugin-typescript',
        'tslib',
        'typescript',
      ]);
    }
    if (this.ghostGulpRollupOptions.useLinting) {
      devDependencies = devDependencies.concat([
        'eslint',
        'eslint-config-prettier',
        'eslint-plugin-prettier',
        'prettier',
      ]);

      if (this.options.git) {
        devDependencies = devDependencies.concat(['husky', 'lint-staged']);
      }

      if (this.ghostGulpRollupOptions.useTypeScript) {
        devDependencies = devDependencies.concat('@typescript-eslint/eslint-plugin', '@typescript-eslint/parser');
      } else {
        devDependencies = devDependencies.concat('@typhonjs-fvtt/eslint-config-foundry.js');
      }

      if (this.ghostGulpRollupOptions.useTesting) {
        devDependencies = devDependencies.concat('eslint-plugin-jest');
      }
    }
    if (this.ghostGulpRollupOptions.useTesting) {
      devDependencies = devDependencies.concat(['jest', 'jest-environment-jsdom', 'jest-junit']);

      if (this.ghostGulpRollupOptions.useTypeScript) {
        devDependencies = devDependencies.concat(['ts-jest']);
      }
    }
    if (this.ghostGulpRollupOptions.styleType === 'less') {
      devDependencies = devDependencies.concat(['gulp-less', 'less@3']);
    }
    if (this.ghostGulpRollupOptions.styleType === 'scss') {
      devDependencies = devDependencies.concat(['gulp-dart-sass']);
    }
    return devDependencies;
  }

  async getPostInstallationCommands(): Promise<string[]> {
    const npx = this.options.packageManager === 'npm' ? 'npx' : 'yarn';
    const huskyCommand =
      this.options.packageManager === 'npm' && process.platform === 'win32'
        ? path.join('.', 'node_modules', '.bin', 'husky')
        : `${npx} husky`;
    const npmRun = this.options.packageManager === 'npm' ? 'npm run' : 'yarn';

    return this.ghostGulpRollupOptions.useLinting && this.options.deps && this.options.git
      ? [`${huskyCommand} install`, `${huskyCommand} add .husky/pre-commit "${npx} lint-staged"`, `${npmRun} format`]
      : [];
  }

  static async create(packageId: string, options: Options): Promise<GhostGulpRollupPreset> {
    const choices = [
      {
        name: 'TypeScript',
        value: 'typescript',
      },
      { name: 'Linter & Formatter (ESLint & Prettier)', value: 'linter', checked: true },
      { name: 'Unit Testing (Jest)', value: 'test' },
      {
        name: 'CSS Pre-processor (Less/SCSS)',
        value: 'cssPreProcessor',
      },
    ];
    if (options.git) {
      choices.push({
        name: 'CI/CD Pipeline (GitHub/GitLab)',
        value: 'useCICD',
        checked: true,
      });
    }
    const { features }: { features: string[] } = await inquirer.prompt([
      {
        name: 'features',
        type: 'checkbox',
        message: 'Check the features needed for your project:',
        choices,
      },
    ]);
    const useTypeScript = features.find((it) => it === 'typescript') !== undefined;
    const useLinting = features.find((it) => it === 'linter') !== undefined;
    const useTesting = features.find((it) => it === 'test') !== undefined;
    const useCssPreProcessor = features.find((it) => it === 'cssPreProcessor') !== undefined;
    const styleType = await getStyleType(useCssPreProcessor);
    const useCICD = features.find((it) => it === 'useCICD') !== undefined;
    const cicd = useCICD ? await getCICDType() : false;

    return new GhostGulpRollupPreset(packageId, options, { useTypeScript, useLinting, useTesting, styleType, cicd });
  }

  static async createDefault(packageId: string, options: Options): Promise<GhostGulpRollupPreset> {
    return new GhostGulpRollupPreset(packageId, options, GhostGulpRollupPreset.getDefaultRollupOptions(options));
  }

  static supports(): boolean {
    return true;
  }

  static readonly presetName = "ghost's Gulp + Rollup Preset";

  static readonly documentationLink = 'https://git.io/JZMc0';

  private static getDefaultRollupOptions(options: Options) {
    return {
      useTypeScript: false,
      useLinting: true,
      useTesting: false,
      styleType: 'css' as const,
      cicd: options.git ? ('github' as const) : (false as const),
    };
  }
}

async function getStyleType(useCssPreProcessor: boolean): Promise<GhostGulpRollupOptions['styleType']> {
  if (!useCssPreProcessor) {
    return 'css';
  }
  const { styleType }: { styleType: 'less' | 'scss' } = await inquirer.prompt([
    {
      name: 'styleType',
      type: 'list',
      message: 'Pick a CSS pre-processor:',
      choices: [
        { name: 'SCSS', value: 'scss' },
        { name: 'Less', value: 'less' },
      ],
    },
  ]);
  return styleType;
}

async function getCICDType(): Promise<'github' | 'gitlab'> {
  const { cicd }: { cicd: 'github' | 'gitlab' } = await inquirer.prompt([
    {
      name: 'cicd',
      type: 'list',
      message: 'Pick a CI/CD type:',
      choices: [
        { name: 'GitHub', value: 'github' },
        { name: 'GitLab', value: 'gitlab' },
      ],
    },
  ]);
  return cicd;
}

export interface GhostGulpRollupOptions {
  useTypeScript: boolean;
  useLinting: boolean;
  useTesting: boolean;
  styleType: 'css' | 'less' | 'scss';
  cicd: false | 'github' | 'gitlab';
}
