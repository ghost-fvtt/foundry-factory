import { Command, Option } from 'commander';
import path from 'path';

import createProject from './create-project';
import { CLIOptions, validateOptions as validateOptions } from './options';
import { presets } from './presets/presets';
import { version } from './utils/version';

const program = new Command();

program
  .version(version, '-v, --version', 'Show the version number of Create Foundry VTT Project')
  .addOption(new Option('-t, --type <type>', 'Create a project of this type').choices(['module', 'system']))
  .addOption(new Option('-p, --preset <preset>', 'Use this preset').choices(Object.keys(presets)))
  .option('-d, --default', 'Use the default preset', false)
  .option(
    '-n, --no-config',
    'Skip the configuration prompts of the selected preset and use its default configuration',
    true,
  )
  .option('-f, --force', 'Overwrite target directory if it exists', false)
  .option('--no-deps', 'Skip installing project dependencies', true)
  .option('--no-git', 'Skip git initialization', true)
  .arguments('<project-directory>')
  .action(async (projectDirectory: string, options: CLIOptions, program: Command) => {
    if (validateOptions(options, program)) {
      const targetDirectory = path.resolve(projectDirectory);
      const name = path.basename(targetDirectory);
      createProject(name, targetDirectory, options);
    }
  });

program.parse(process.argv);
