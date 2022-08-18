// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { GhostGulpRollupPreset } from './ghost-gulp-rollup/ghost-gulp-rollup-preset';
import { LeagueJSPreset } from './league-js/league-js-preset';

import type { PresetConstructor } from './preset';

export type PresetKey = 'ghost-gulp-rollup' | 'league-js';

export const presets: Record<PresetKey, PresetConstructor> = {
  'ghost-gulp-rollup': GhostGulpRollupPreset,
  'league-js': LeagueJSPreset,
};

export const defaultPreset: PresetConstructor = GhostGulpRollupPreset;
