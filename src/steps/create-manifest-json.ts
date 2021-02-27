import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

import { Options } from '../options';

export default async (options: Options): Promise<void> => {
  const manifestFileName = options.system ? 'system.json' : 'module.json';
  const spinner = ora(`Creating ${chalk.green(manifestFileName)}`).start();

  try {
    const manifest = generateManifest(options);
    await fs.writeJSON(path.resolve(options.projectDirectory, 'src', manifestFileName), manifest, { spaces: 2 });
  } catch (err) {
    spinner.fail(chalk.red(`Failed to create ${manifestFileName}`));
    throw err;
  }
  spinner.succeed(chalk.green(`Created ${manifestFileName}`));
};

export function generateManifest({ name, system }: Options): Manifest {
  const baseManifest = {
    name: name,
    title: name,
    description: '',
    version: '0.0.0',
    author: '',
    authors: [
      {
        name: '',
        email: '',
      },
    ],
    minimumCoreVersion: '0.7.9',
    compatibleCoreVersion: '0.7.9',
    scripts: [],
    esmodules: [`module/${name}.js`],
    styles: [`styles/${name}.js`],
    packs: [],
    dependencies: [],
    languages: [
      {
        lang: 'en',
        name: 'English',
        path: 'lang/en.json',
      },
    ],
    socket: false,
    url: '',
    manifest: '',
    download: 'https://host/path/to/0.0.0.zip',
    license: '',
    readme: '',
    bugs: '',
    changelog: '',
  };

  const moduleManifestProps = {
    system: [],
    library: false,
  };

  const systemManifestProps = {
    initiative: '',
    gridDistance: 1,
    gridUnits: '',
    primaryTokenAttribute: '',
    secondaryTokenAttribute: '',
  };

  return system ? { ...baseManifest, ...systemManifestProps } : { ...baseManifest, ...moduleManifestProps };
}

interface Author {
  name: string;
  email?: string;
  url?: string;
}

interface Pack {
  name: string;
  label: string;
  system: string;
  module: string;
  path: string;
  entity: 'Actor' | 'Item' | 'JournalEntry' | 'Macro' | 'Playlist' | 'RollTable' | 'Scene';
}

interface Dependency {
  name: string;
  type?: 'module' | 'system' | 'world';
  manifest?: string;
}

interface Language {
  lang: string;
  name: string;
  path: string;
}

interface BaseManifest {
  name: string;
  title: string;
  description: string;
  version: string;
  author: string;
  authors?: Author[];
  minimumCoreVersion: string;
  compatibleCoreVersion?: string;
  scripts?: string[];
  esmodules?: string[];
  styles?: string[];
  packs?: Pack[];
  dependencies?: Dependency[];
  languages?: Language[];
  socket?: boolean;
  url?: string;
  manifest?: string;
  download?: string;
  license?: string;
  readme?: string;
  bugs?: string;
  changelog?: string;
}

interface ModuleManifest extends BaseManifest {
  system?: string | string[];
  library?: boolean;
}

interface SystemManifest extends BaseManifest {
  initiative?: string;
  gridDistance?: number;
  gridUnits?: string;
  primaryTokenAttribute?: string;
  secondaryTokenAttribute?: string;
}

type Manifest = ModuleManifest | SystemManifest;
