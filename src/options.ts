import type { Command } from 'commander';
import chalk from 'chalk';

import type { PresetKey } from './presets/presets';

export interface CLIOptions {
  type?: 'module' | 'system';
  preset?: PresetKey;
  default: boolean;
  config: boolean;
  force: boolean;
  deps: boolean;
  git: boolean;
  packageManager: typeof packageManagers[number];
}

export const packageManagers = ['npm', 'yarn', 'yarn2'] as const;

interface PresetOptions extends CLIOptions {
  preset: PresetKey;
  default: false;
}

interface DefaultOptions extends CLIOptions {
  preset?: undefined;
  default: true;
}

interface RegularOptions extends CLIOptions {
  preset?: undefined;
  default: boolean;
}

export type ValidatedCLIOptions = PresetOptions | DefaultOptions | RegularOptions;

export type Options = ValidatedCLIOptions & { type: 'module' | 'system' };

export function validateOptions(options: CLIOptions, program: Command): options is ValidatedCLIOptions {
  if (options.default && options.preset !== undefined) {
    console.error(chalk.red("The 'preset' and 'default' options are mutually exclusive"));
    program.help();
  }
  return true;
}
