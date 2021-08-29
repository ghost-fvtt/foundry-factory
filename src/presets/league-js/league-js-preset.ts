import path from 'path';

import type { Options } from '../../options';
import type { Preset } from '../preset';

export class LeagueJSPreset implements Preset {
  protected name: string;
  protected options: Options;

  constructor(name: string, options: Options) {
    this.name = name;
    this.options = options;
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
