import inquirer from 'inquirer';

import { Options } from '../options';
import { Preset, PresetConstructor } from '../presets/preset';
import { defaultPreset, presets } from '../presets/presets';

export default async (name: string, options: Options): Promise<Preset> => {
  const presetConstructor = await getPresetConstructor(options);
  if (options.config) {
    return presetConstructor.create(name, options);
  } else {
    return presetConstructor.createDefault(name, options);
  }
};

async function getPresetConstructor(options: Options): Promise<PresetConstructor> {
  if (options.default) {
    return defaultPreset;
  } else if (options.preset) {
    return presets[options.preset];
  }

  const { preset }: { preset: PresetConstructor } = await inquirer.prompt([
    {
      name: 'preset',
      type: 'list',
      message: 'Please pick a preset (links point to the documentation of the preset):',
      choices: Object.values(presets).map((cls) => {
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
