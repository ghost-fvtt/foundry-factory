import { Options } from '../../options';
import { Preset } from '../preset';
import path from 'path';

export class LeagueJSPreset implements Preset {
  protected name: string;
  protected options: Options;

  constructor(name: string, options: Options) {
    this.name = name;
    this.options = options;
  }

  async getProgrammaticFiles(): Promise<Record<string, string>> {
    return {};
  }

  async getTemplateFiles(): Promise<Record<string, string>> {
    return Object.fromEntries(
      [
        'README.md',
        'module.json',
        'LICENSE',
        path.join('styles', 'module.css'),
        path.join('scripts', 'module.js'),
        path.join('scripts', 'lib', 'lib.js'),
        path.join('languages', 'en.json'),
        path.join('.github', 'workflows', 'main.yml'),
      ].map((file) => [file, path.join('league-js', `${file}.njk`)]),
    );
  }

  async getTemplateVariables(): Promise<Record<string, unknown>> {
    return {};
  }

  async getAdditionalDirectories(): Promise<string[]> {
    return [];
  }

  async getDependencies(): Promise<string[]> {
    return [];
  }

  async getDevDependencies(): Promise<string[]> {
    return [];
  }

  async getPostInstallationCommands(): Promise<string[]> {
    return [];
  }

  static async create(name: string, options: Options): Promise<LeagueJSPreset> {
    return new LeagueJSPreset(name, options);
  }

  static async createDefault(name: string, options: Options): Promise<LeagueJSPreset> {
    return new LeagueJSPreset(name, options);
  }

  static supports(options: Options): boolean {
    return options.type === 'module';
  }

  static readonly presetName = 'League Basic JS Module Template';

  static readonly documentationLink = 'https://git.io/JqIwx';
}
