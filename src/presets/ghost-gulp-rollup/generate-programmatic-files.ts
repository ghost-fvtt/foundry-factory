import path from 'path';

import type { Options } from '../../options';
import type { TargetFilePath } from '../preset';
import type { GhostGulpRollupOptions } from './ghost-gulp-rollup-preset';

export const generateProgrammaticFiles = (
  packageId: string,
  options: Options,
  ghostGulpRollupOptions: GhostGulpRollupOptions,
): Record<TargetFilePath, string> => {
  const programmaticFiles: Record<string, string> = {};

  programmaticFiles['package.json'] = JSON.stringify(
    generatePackage(packageId, options, ghostGulpRollupOptions),
    undefined,
    2,
  );
  programmaticFiles[path.join('src', `${options.type}.json`)] = JSON.stringify(
    generateManifest(packageId, options, ghostGulpRollupOptions),
    undefined,
    2,
  );
  if (options.type === 'system') {
    programmaticFiles[path.join('src', 'template.json')] = JSON.stringify(generateTemplate(), undefined, 2);
  }
  programmaticFiles[path.join('src', 'styles', `${packageId}.${ghostGulpRollupOptions.styleType}`)] =
    generateStyle(ghostGulpRollupOptions);
  programmaticFiles[path.join('src', 'lang', 'en.json')] = JSON.stringify({}, undefined, 2);

  return programmaticFiles;
};

export function generatePackage(
  packageId: string,
  options: Options,
  ghostGulpRollupOptions: GhostGulpRollupOptions,
): Package {
  const codeFileTypes = ghostGulpRollupOptions.useTypeScript ? ['ts', 'js', 'cjs', 'mjs'] : ['js', 'cjs', 'mjs'];
  const codeFileExtensions = codeFileTypes.map((fileType) => `.${fileType}`);

  const typecheckScript = ghostGulpRollupOptions.useTypeScript ? `tsc --noEmit` : undefined;
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
    name: packageId,
    version: ghostGulpRollupOptions.cicd ? undefined : '0.0.0',
    description: '<description of the package>',
    license:
      '<please choose an appropriate license. https://choosealicense.com/ is a great place to get more information if you are unsure>',
    homepage: '<optionally the URL to your repository or another homepage>',
    repository: {
      type: 'git',
      url: '<optionally the URL to your repository>',
    },
    bugs: {
      url: '<optionally the URL to your issues list>',
    },
    contributors: [
      {
        name: '<your name>',
        email: '<optionally your e-mail address>',
      },
    ],
    type: 'module',
    scripts: {
      build: 'gulp build',
      'build:watch': 'gulp watch',
      'link-project': 'gulp link',
      clean: 'gulp clean',
      'clean:link': 'gulp link --clean',
      typecheck: typecheckScript,
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
  type: 'module' | 'commonjs';
  scripts: {
    build: string;
    'build:watch': string;
    'link-project': string;
    clean: string;
    'clean:link': string;
    typecheck?: string;
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

export function generateManifest(packageId: string, { type }: Options, { cicd }: GhostGulpRollupOptions): Manifest {
  const baseManifest = {
    id: packageId,
    title: `<human readable title for ${packageId}>`,
    description: '<description of the package>',
    authors: [
      {
        name: '<your name>',
        email: '<optionally your e-mail address>',
        discord: '<optionally your discord username>',
      },
    ],
    url: cicd ? 'This is auto replaced' : '',
    license:
      '<please choose an appropriate license. https://choosealicense.com/ is a great place to get more information if you are unsure>',
    readme: '<optionally the URL to your readme>',
    bugs: '<optionally the URL to your issue list>',
    changelog: '<optionally the URL to your changelog>',
    version: cicd ? 'This is auto replaced' : '0.0.0',
    compatibility: {
      minimum: '10',
      verified: '10',
    },
    scripts: [],
    esmodules: [`module/${packageId}.js`],
    styles: [`styles/${packageId}.css`],
    packs: [],
    languages: [
      {
        lang: 'en',
        name: 'English',
        path: 'lang/en.json',
      },
    ],
    relationships: {
      ...(type !== 'system' ? { systems: [] } : {}),
      requires: [],
      conflicts: [],
    },
    socket: false,
    manifest: cicd ? 'This is auto replaced' : '',
    download: cicd ? 'This is auto replaced' : 'https://host/path/to/0.0.0.zip',
  };

  const moduleManifestProps = {
    library: false,
  };

  const systemManifestProps = {
    background: '<optionally a relative filepath to a background image to use for worlds created with this system>',
    initiative: '<inititative roll formula for your system>',
    gridDistance: 1,
    gridUnits: 'm',
    primaryTokenAttribute: '<optionally the attribute to use as primary resource in tokens by default>',
    secondaryTokenAttribute: '<optionally the attribute to use as secondary resource in tokens by default>',
  };

  return { ...baseManifest, ...(type === 'system' ? systemManifestProps : moduleManifestProps) };
}

interface PackageCompatibility {
  minimum?: string;
  verified?: string;
  maximum?: string;
}

interface RelatedPackage<PackageType extends 'world' | 'system' | 'module' = 'world' | 'system' | 'module'> {
  id: string;
  type: PackageType;
  manifest?: string;
  compatibility?: PackageCompatibility;
  reason?: string;
}

interface Author {
  name: string;
  email?: string;
  url?: string;
  discord?: string;
  flags?: Record<string, unknown>;
}

interface Media {
  type?: string;
  url?: string;
  caption?: string;
  loop?: boolean;
  thumbnail?: string;
  flags?: Record<string, unknown>;
}

interface Pack {
  name: string;
  path: string;
  label: string;
  private?: boolean;
  type: 'Actor' | 'Cards' | 'Item' | 'JournalEntry' | 'Macro' | 'Playlist' | 'RollTable' | 'Scene' | 'Adventure';
  system?: string;
  flags?: Record<string, unknown>;
}

interface Language {
  lang: string;
  name?: string;
  path: string;
  system?: string;
  module?: string;
  flags?: Record<string, unknown>;
}

interface Relationships {
  systems?: RelatedPackage<'system'>[];
  requires?: RelatedPackage[];
  conflicts?: RelatedPackage[];
  flags?: Record<string, unknown>;
}

interface BasePackage {
  id: string;
  title?: string;
  description?: string;
  authors?: Author[];
  url?: string;
  license?: string;
  readme?: string;
  bugs?: string;
  changelog?: string;
  flags?: Record<string, unknown>;
  media?: Media[];
  version?: string;
  compatibility?: PackageCompatibility;
  scripts?: string[];
  esmodules?: string[];
  styles?: string[];
  languages?: Language[];
  packs?: Pack[];
  relationships?: Relationships;
  socket?: boolean;
  manifest?: string;
  download?: string;
  protected?: boolean;
}

interface BaseModule extends BasePackage {
  coreTranslation?: boolean;
  library?: boolean;
}

interface BaseSystem extends BasePackage {
  background?: string;
  initiative?: string;
  gridDistance?: number;
  gridUnits?: string;
  primaryTokenAttribute?: string;
  secondaryTokenAttribute?: string;
}

type Manifest = BaseModule | BaseSystem;

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

interface SystemDefintion {
  types: string[];
  templates: Record<string, unknown>;
  [key: string]: unknown;
}

interface Template {
  Actor: SystemDefintion;
  Item: SystemDefintion;
  Cards?: SystemDefintion;
  Card?: SystemDefintion;
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
