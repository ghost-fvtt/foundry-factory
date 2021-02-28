import { RollupPreset } from './rollup/rollup-preset';

export const presets = { rollup: { name: 'Rollup', cls: RollupPreset } };

export const defaultPreset = RollupPreset;

export type PresetKey = keyof typeof presets;
