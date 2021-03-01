import { GulpRollupPreset } from './gulp-rollup/gulp-rollup-preset';
import { PresetConstructor } from './preset';

export const presets: Record<string, PresetConstructor> = { 'gulp-rollup': GulpRollupPreset };

export const defaultPreset: PresetConstructor = GulpRollupPreset;

export type PresetKey = keyof typeof presets;
