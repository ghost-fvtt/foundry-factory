#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import { URL } from 'url';
import path from 'path';

import createProject from './create-project.js';
import { CLIOptions, validateOptions as validateCLIOptions } from './options.js';

const version = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)).toString()).version;

const program = new Command();

program
  .version(version, '-v, --version', 'Checks the current version of Foundry Project Creator')
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('-s, --system', 'Create a system instead of a module', false)
  .option('-t, --typescript', 'Configures the project to use TypeScript', false)
  .option('-l, --lint', 'Configures the project to use linting', false)
  .option('--test', 'Configures the project to use testing', false)
  .option('--css <preprocessor>', 'Configures the project to use a CSS preprocessor ("less", "sass")')
  .option('-f, --force', 'Overwrite an existing project directory', false)
  .option('--no-deps', 'Skip installing project dependencies', true)
  .option('--no-git', 'Skip initializing Git repository', true)
  .action((projectDir: string, options: CLIOptions, program: Command) => {
    if (validateCLIOptions(options, program)) {
      const projectDirectory = path.resolve(projectDir);
      const name = path.basename(projectDirectory);

      createProject({ ...options, projectDirectory, name });
    }
  });

program.parse(process.argv);
