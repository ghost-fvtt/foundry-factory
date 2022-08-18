// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import path from 'path';

import type { Options } from '../../options';
import type { Preset } from '../preset';

export class LeagueJSPreset implements Preset {
  protected packageId: string;
  protected options: Options;

  constructor(packageId: string, options: Options) {
    this.packageId = packageId;
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

  static async create(packageId: string, options: Options): Promise<LeagueJSPreset> {
    return new LeagueJSPreset(packageId, options);
  }

  static async createDefault(PackageId: string, options: Options): Promise<LeagueJSPreset> {
    return new LeagueJSPreset(PackageId, options);
  }

  static supports(options: Options): boolean {
    return options.type === 'module';
  }

  static readonly presetName = 'League Basic JS Module Template';

  static readonly documentationLink = 'https://git.io/JqIwx';
}
