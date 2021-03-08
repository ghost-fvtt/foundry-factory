import { GulpRollupPreset } from './gulp-rollup/gulp-rollup-preset';
import { LeagueJSPreset } from './league-js/league-js-preset';
import { PresetConstructor } from './preset';

export const presets: Record<string, PresetConstructor> = {
  'gulp-rollup': GulpRollupPreset,
  'league-js': LeagueJSPreset,
};

export const defaultPreset: PresetConstructor = GulpRollupPreset;

export type PresetKey = keyof typeof presets;
