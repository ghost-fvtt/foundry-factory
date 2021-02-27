import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

import { Options } from '../options';

export default async ({ projectDirectory, system }: Options): Promise<void> => {
  if (!system) {
    return;
  }
  const templateFileName = 'template.json';
  const spinner = ora(`Creating ${chalk(templateFileName)}`).start();

  try {
    const template = generateTemplate();
    await fs.writeJSON(path.resolve(projectDirectory, 'src', templateFileName), template, { spaces: 2 });
  } catch (err) {
    spinner.fail(chalk.red(`Failed to create ${templateFileName}`));
    throw err;
  }
  spinner.succeed(chalk.green(`Created ${templateFileName}`));
};

export function generateTemplate(): Template {
  return {
    Actor: {
      types: [],
      templates: {},
    },
    Item: {
      types: [],
      templates: {},
    },
  };
}

interface Entity {
  types: string[];
  templates: Record<string, unknown>;
  [key: string]: unknown;
}

interface Template {
  Actor: Entity;
  Item: Entity;
}
