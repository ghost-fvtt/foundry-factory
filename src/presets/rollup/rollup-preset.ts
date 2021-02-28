import inquirer from 'inquirer';

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
    return getTemplateFiles(this.name, this.options, this.rollupOptions);
  }

  async getTemplateVariables(): Promise<Record<string, unknown>> {
    return { ...this.rollupOptions };
  }

  async getEmptyDirectories(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  async getDependencies(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  async getDevDependencies(): Promise<string[]> {
    throw new Error('Method not implemented.');
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
