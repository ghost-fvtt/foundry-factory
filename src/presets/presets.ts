import { GhostGulpRollupPreset } from './ghost-gulp-rollup/ghost-gulp-rollup-preset';
import { LeagueJSPreset } from './league-js/league-js-preset';
import { PresetConstructor } from './preset';

export const presets: Record<string, PresetConstructor> = {
  'ghost-gulp-rollup': GhostGulpRollupPreset,
  'league-js': LeagueJSPreset,
};

export const defaultPreset: PresetConstructor = GhostGulpRollupPreset;

export type PresetKey = keyof typeof presets;
