import { GulpRollupPreset } from './gulp-rollup/gulp-rollup-preset';

export const presets = { 'gulp-rollup': { name: 'Gulp + Rollup', cls: GulpRollupPreset } };

export const defaultPreset = GulpRollupPreset;

export type PresetKey = keyof typeof presets;
