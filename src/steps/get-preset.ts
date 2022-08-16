import chalk from 'chalk';
import inquirer from 'inquirer';

import { defaultPreset, presets } from '../presets/presets';

import type { Options } from '../options';
import type { Preset, PresetConstructor } from '../presets/preset';

export const getPreset = async (packageId: string, options: Options): Promise<Preset> => {
  try {
    const presetConstructor = await getPresetConstructor(options);
    if (options.config) {
      return presetConstructor.create(packageId, options);
    } else {
      return presetConstructor.createDefault(packageId, options);
    }
  } catch (err) {
    console.error(chalk.red(err));
    throw err;
  }
};

async function getPresetConstructor(options: Options): Promise<PresetConstructor> {
  if (options.default) {
    return defaultPreset;
  } else if (options.preset) {
    const preset = presets[options.preset];
    if (!preset.supports(options)) {
      throw new Error(`Preset ${options.preset} does not support the currently selected options.`);
    }
    return presets[options.preset];
  }

  const { preset }: { preset: PresetConstructor } = await inquirer.prompt([
    {
      name: 'preset',
      type: 'list',
      message: 'Please pick a preset (links point to the documentation of the preset):',
      choices: Object.values(presets)
        .filter((preset) => preset.supports(options))
        .map((cls) => {
          const name = cls.presetName + (cls.documentationLink ? ` – ${cls.documentationLink}` : '');
          return {
            name,
            value: cls,
            short: cls.presetName,
          };
        }),
    },
  ]);
  return preset;
}
