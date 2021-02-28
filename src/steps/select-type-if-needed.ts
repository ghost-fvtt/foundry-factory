import inquirer from 'inquirer';

import { Options, ValidatedCLIOptions } from '../options';

export default async (validatedCLIOptions: ValidatedCLIOptions): Promise<Options> => {
  if (validatedCLIOptions.type !== undefined) {
    return validatedCLIOptions as Options;
  }
  const { type }: { type: 'module' | 'system' } = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: 'Please select whether to create a module or a system:',
      choices: [
        { name: 'Module', value: 'module' },
        { name: 'System', value: 'system' },
      ],
    },
  ]);
  return { ...validatedCLIOptions, type: type };
};
