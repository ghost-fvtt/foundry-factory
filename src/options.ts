import type { Command } from 'commander';
import chalk from 'chalk';

export interface CLIOptions {
  system: boolean;
  typescript: boolean;
  lint: boolean;
  test: boolean;
  css?: string;
  force: boolean;
  deps: boolean;
  git: boolean;
}

export interface ValidatedCLIOptions extends CLIOptions {
  css?: 'less' | 'sass';
}

export function validateOptions(options: CLIOptions, program: Command): options is ValidatedCLIOptions {
  if (options.css !== undefined && !['less', 'sass'].includes(options.css)) {
    console.error(chalk.red("Only 'less' or 'sass' may be specified as css preprocessor!"));
    program.help();
  }
  return true;
}

export interface Options extends ValidatedCLIOptions {
  name: string;
  projectDirectory: string;
}
