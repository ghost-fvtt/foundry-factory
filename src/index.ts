import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

import createProject from './create-project';
import { CLIOptions, validateOptions as validateCLIOptions } from './options';
import { rootPath } from './utils/file-utils';

const version: string = JSON.parse(fs.readFileSync(path.resolve(rootPath, 'package.json')).toString()).version;

const program = new Command();

program
  .version(version, '-v, --version', 'show the current version of Create Foundry Project 2')
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('-s, --system', 'create a system instead of a module', false)
  .option('-t, --typescript', 'configure the project to use TypeScript', false)
  .option('-l, --lint', 'configure the project to use linting (ESLint)', false)
  .option('--test', 'configure the project to use testing (Jest)', false)
  .option('--css <preprocessor>', "configure the project to use a CSS preprocessor ('less', 'sass')")
  .option('-f, --force', 'overwrite data in the project directory if it already exists', false)
  .option('--no-deps', 'skip installing project dependencies', true)
  .option('--no-git', 'skip initializing Git repository', true)
  .action((projectDir: string, options: CLIOptions, program: Command) => {
    if (validateCLIOptions(options, program)) {
      const projectDirectory = path.resolve(projectDir);
      const name = path.basename(projectDirectory);

      createProject({ ...options, projectDirectory, name });
    }
  });

program.parse(process.argv);
