import path from 'path';

import type { Options } from '../../options';
import type { TargetFilePath } from '../preset';
import type { GhostGulpRollupOptions } from './ghost-gulp-rollup-preset';

export default (
  name: string,
  options: Options,
  ghostGulpRollupOptions: GhostGulpRollupOptions,
): Record<TargetFilePath, string> => {
  const programmaticFiles: Record<string, string> = {};

  programmaticFiles['package.json'] = JSON.stringify(
    generatePackage(name, options, ghostGulpRollupOptions),
    undefined,
    2,
  );
  programmaticFiles[path.join('src', `${options.type}.json`)] = JSON.stringify(
    generateManifest(name, options, ghostGulpRollupOptions),
    undefined,
    2,
  );
  if (options.type === 'system') {
    programmaticFiles[path.join('src', 'template.json')] = JSON.stringify(generateTemplate(), undefined, 2);
  }
  programmaticFiles[path.join('src', 'styles', `${name}.${ghostGulpRollupOptions.styleType}`)] =
    generateStyle(ghostGulpRollupOptions);
  programmaticFiles[path.join('src', 'lang', 'en.json')] = JSON.stringify({}, undefined, 2);

  return programmaticFiles;
};

export function generatePackage(
  name: string,
  options: Options,
  ghostGulpRollupOptions: GhostGulpRollupOptions,
): Package {
  const codeFileTypes = ghostGulpRollupOptions.useTypeScript ? ['ts', 'js'] : ['js'];
  const codeFileExtensions = codeFileTypes.map((fileType) => `.${fileType}`);

  const lintScript = ghostGulpRollupOptions.useLinting ? `eslint --ext ${codeFileExtensions.join(',')} .` : undefined;
  const lintFixScript = ghostGulpRollupOptions.useLinting
    ? `eslint --ext ${codeFileExtensions.join(',')} --fix .`
    : undefined;
  const formatScript = ghostGulpRollupOptions.useLinting
    ? `prettier --write "./**/*.(${codeFileTypes.join('|')}|json|yml|${ghostGulpRollupOptions.styleType})"`
    : undefined;

  const testScript = ghostGulpRollupOptions.useTesting ? 'jest' : undefined;
  const testWatchScript = ghostGulpRollupOptions.useTesting ? 'jest --watch' : undefined;
  const testCIScript = ghostGulpRollupOptions.useTesting
    ? 'jest --ci --reporters=default --reporters=jest-junit'
    : undefined;
  const postinstallScript = ghostGulpRollupOptions.useLinting && options.git ? 'husky install' : undefined;

  const lintStagedConfiguration =
    ghostGulpRollupOptions.useLinting && options.git
      ? {
          [`*.(${codeFileTypes.join('|')})`]: 'eslint --fix',
          [`*.(json|yml|${ghostGulpRollupOptions.styleType})`]: 'prettier --write',
        }
      : undefined;

  return {
    private: true,
    name,
    version: ghostGulpRollupOptions.useCICD ? undefined : '0.0.0',
    description: '',
    license: '',
    homepage: '',
    repository: {
      type: 'git',
      url: '',
    },
    bugs: {
      url: '',
    },
    contributors: [
      {
        name: '',
        email: '',
      },
    ],
    scripts: {
      build: 'gulp build',
      'build:watch': 'gulp watch',
      'link-project': 'gulp link',
      clean: 'gulp clean',
      'clean:link': 'gulp link --clean',
      lint: lintScript,
      'lint:fix': lintFixScript,
      format: formatScript,
      test: testScript,
      'test:watch': testWatchScript,
      'test:ci': testCIScript,
      postinstall: postinstallScript,
    },
    devDependencies: {},
    'lint-staged': lintStagedConfiguration,
  };
}

interface Package {
  private: true;
  name: string;
  version?: string;
  description: string;
  license: string;
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  bugs: {
    url: string;
  };
  contributors: [
    {
      name: string;
      email: string;
    },
  ];
  scripts: {
    build: string;
    'build:watch': string;
    'link-project': string;
    clean: string;
    'clean:link': string;
    lint?: string;
    'lint:fix'?: string;
    format?: string;
    test?: string;
    'test:watch'?: string;
    'test:ci'?: string;
    postinstall?: string;
  };
  devDependencies: Record<string, never>;
  'lint-staged'?: Partial<Record<string, string>>;
}

export function generateManifest(name: string, { type }: Options, { useCICD }: GhostGulpRollupOptions): Manifest {
  const baseManifest = {
    name: name,
    title: name,
    description: '',
    version: useCICD ? 'This is auto replaced' : '0.0.0',
    author: '<your name>',
    authors: [
      {
        name: '<your name>',
        email: '<optionally your e-mail address>',
        discord: '<optionally your discord username>',
      },
    ],
    minimumCoreVersion: '9.238',
    compatibleCoreVersion: '9',
    scripts: [],
    esmodules: [`module/${name}.js`],
    styles: [`styles/${name}.css`],
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
    url: useCICD ? 'This is auto replaced' : '',
    manifest: useCICD ? 'This is auto replaced' : '',
    download: useCICD ? 'This is auto replaced' : 'https://host/path/to/0.0.0.zip',
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

  return type === 'system' ? { ...baseManifest, ...systemManifestProps } : { ...baseManifest, ...moduleManifestProps };
}

interface Author {
  name: string;
  email?: string;
  url?: string;
  discord?: string;
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

function generateStyle({ styleType }: GhostGulpRollupOptions) {
  const less = String.raw`/* ---------------------------- */
/*             Less             */
/* This is your Less entry file */
/* ---------------------------- */
`;
  const scss = String.raw`/* ---------------------------- */
/*             Sass             */
/* This is your Sass entry file */
/* ---------------------------- */
`;
  const css = String.raw`/* ------------------------------------ */
/*                 CSS                  */
/*         Add your styles here         */
/* ------------------------------------ */
`;
  return { less, scss, css }[styleType];
}
