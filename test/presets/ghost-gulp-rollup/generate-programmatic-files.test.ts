// SPDX-FileCopyrightText: 2022 Johannes Loher
// SPDX-FileCopyrightText: 2022 David Archibald
//
// SPDX-License-Identifier: MIT

import { describe, expect, it } from '@jest/globals';

import {
  generateManifest,
  generatePackage,
  generateTemplate,
} from '../../../src/presets/ghost-gulp-rollup/generate-programmatic-files';

import type { Options } from '../../../src/options';

describe('generatePackageJSON', () => {
  const defaultName = 'name-of-the-project';

  const defaultOptions: Options = {
    type: 'module',
    preset: 'ghost-gulp-rollup',
    default: false,
    config: true,
    force: false,
    git: false,
    deps: true,
    packageManager: 'npm',
  };

  const defaultRollupOptions = {
    useTypeScript: false,
    useLinting: false,
    useTesting: false,
    styleType: 'css' as const,
    cicd: 'github' as const,
  };

  it('includes the name given in the options', () => {
    const _package = generatePackage(defaultName, defaultOptions, defaultRollupOptions);

    expect(_package.name).toBe('name-of-the-project');
  });

  it('includes all static properties', () => {
    const _package = generatePackage(defaultName, defaultOptions, defaultRollupOptions);

    expect(_package.private).toBe(true);
    expect(_package.description).toBe('<description of the package>');
    expect(_package.license).toBe(
      '<please choose an appropriate license. https://choosealicense.com/ is a great place to get more information if you are unsure>',
    );
    expect(_package.homepage).toBe('<optionally the URL to your repository or another homepage>');
    expect(_package.repository).toEqual({ type: 'git', url: '<optionally the URL to your repository>' });
    expect(_package.bugs).toEqual({ url: '<optionally the URL to your issues list>' });
    expect(_package.contributors).toEqual([{ name: '<your name>', email: '<optionally your e-mail address>' }]);
    expect(_package.devDependencies).toEqual({});
    expect(_package.type).toEqual('module');
  });

  describe('with cicd not selected', () => {
    const noCICDOptions = { ...defaultRollupOptions, cicd: false as const };
    it('includes version', () => {
      const _package = generatePackage(defaultName, defaultOptions, noCICDOptions);

      expect(_package.version).toBe('0.0.0');
    });
  });

  describe('with cicd selected', () => {
    const cicdOptions = { ...defaultRollupOptions, useCICD: false };
    it('does not include version', () => {
      const _package = generatePackage(defaultName, defaultOptions, cicdOptions);

      expect(_package.version).toBeUndefined;
    });
  });

  describe('with lint not selected', () => {
    const noLintingOptions = { ...defaultRollupOptions, useLinting: false };

    it('does not generate lint or format scripts', () => {
      const _package = generatePackage(defaultName, defaultOptions, noLintingOptions);

      expect(_package.scripts.lint).toBeUndefined();
      expect(_package.scripts['lint:fix']).toBeUndefined();
      expect(_package.scripts.format).toBeUndefined();
    });

    it('does not generate a lint-staged configuration', () => {
      const _package = generatePackage(defaultName, defaultOptions, noLintingOptions);

      expect(_package['lint-staged']).toBeUndefined();
    });
  });

  describe('with lint selected', () => {
    const lintingOptions = { ...defaultRollupOptions, useLinting: true };

    describe('and typescript selected', () => {
      const typescriptOptions = { ...lintingOptions, useTypeScript: true };

      it('generates typecheck script', () => {
        const _package = generatePackage(defaultName, defaultOptions, typescriptOptions);
        expect(_package.scripts.typecheck).toBe('tsc --noEmit');
      });

      it('generates lint scripts that lint ts, js, cjs, and mjs', () => {
        const _package = generatePackage(defaultName, defaultOptions, typescriptOptions);

        expect(_package.scripts.lint).toBe('eslint --ext .ts,.js,.cjs,.mjs .');
        expect(_package.scripts['lint:fix']).toBe('eslint --ext .ts,.js,.cjs,.mjs --fix .');
      });

      describe('and not git initialization', () => {
        it('does not generate a lint-staged configuration', () => {
          const _package = generatePackage(defaultName, { ...defaultOptions, git: false }, lintingOptions);
          expect(_package['lint-staged']).toBeUndefined();
        });
      });

      describe('and no CSS preprocessor selected', () => {
        const cssOptions = { ...typescriptOptions, styleType: 'css' as const };

        it('generates a format script that formats ts, js, cjs, mjs, json, and css', () => {
          const _package = generatePackage(defaultName, defaultOptions, cssOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(ts|js|cjs|mjs|json|yml|css)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for ts, js, cjs, mjs, json, and css', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, cssOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(ts|js|cjs|mjs)': 'eslint --fix',
              '*.(json|yml|css)': 'prettier --write',
            });
          });
        });
      });

      describe('and less selected as CSS preprocessor', () => {
        const lessOptions = {
          ...typescriptOptions,
          styleType: 'less' as const,
        };

        it('generates a format script that formats ts, js, cjs, json, and less', () => {
          const _package = generatePackage(defaultName, defaultOptions, lessOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(ts|js|cjs|mjs|json|yml|less)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for ts, js, cjs, json, and less', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, lessOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(ts|js|cjs|mjs)': 'eslint --fix',
              '*.(json|yml|less)': 'prettier --write',
            });
          });
        });
      });

      describe('and sass selected as CSS preprocessor', () => {
        const sassOptions = {
          ...typescriptOptions,
          styleType: 'scss' as const,
        };

        it('generates a format script that formats ts, js, cjs, json, and scss', () => {
          const _package = generatePackage(defaultName, defaultOptions, sassOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(ts|js|cjs|mjs|json|yml|scss)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for ts, js, cjs, json, and scss', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, sassOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(ts|js|cjs|mjs)': 'eslint --fix',
              '*.(json|yml|scss)': 'prettier --write',
            });
          });
        });
      });
    });

    describe('and typescript not selected', () => {
      const noTypescriptOptions = { ...lintingOptions, useTypeScript: false };

      it('generates lint scripts that lint js and cjs', () => {
        const _package = generatePackage(defaultName, defaultOptions, noTypescriptOptions);

        expect(_package.scripts.lint).toBe('eslint --ext .js,.cjs,.mjs .');
        expect(_package.scripts['lint:fix']).toBe('eslint --ext .js,.cjs,.mjs --fix .');
      });

      describe('and no CSS preprocessor selected', () => {
        const cssOptions = {
          ...noTypescriptOptions,
          styleType: 'css' as const,
        };

        it('generates a format script that formats ts, js, cjs, json, and css', () => {
          const _package = generatePackage(defaultName, defaultOptions, cssOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(js|cjs|mjs|json|yml|css)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for js, cjs, json, and css', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, cssOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(js|cjs|mjs)': 'eslint --fix',
              '*.(json|yml|css)': 'prettier --write',
            });
          });
        });
      });

      describe('and less selected as CSS preprocessor', () => {
        const lessOptions = {
          ...noTypescriptOptions,
          styleType: 'less' as const,
        };

        it('generates a format script that formats ts, js, cjs, json, and less', () => {
          const _package = generatePackage(defaultName, defaultOptions, lessOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(js|cjs|mjs|json|yml|less)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for js, cjs, json, and less', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, lessOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(js|cjs|mjs)': 'eslint --fix',
              '*.(json|yml|less)': 'prettier --write',
            });
          });
        });
      });

      describe('and sass selected as CSS preprocessor', () => {
        const sassOptions = {
          ...noTypescriptOptions,
          styleType: 'scss' as const,
        };

        it('generates a format script that formats ts, js, cjs, json, and scss', () => {
          const _package = generatePackage(defaultName, defaultOptions, sassOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(js|cjs|mjs|json|yml|scss)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for js, cjs, json, and scss', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, sassOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(js|cjs|mjs)': 'eslint --fix',
              '*.(json|yml|scss)': 'prettier --write',
            });
          });
        });
      });
    });
  });

  describe('with test selected', () => {
    const testOptions = { ...defaultRollupOptions, useTesting: true };

    it('generates test scripts', () => {
      const _package = generatePackage(defaultName, defaultOptions, testOptions);

      expect(_package.scripts.test).toBe('jest');
      expect(_package.scripts['test:watch']).toBe('jest --watch');
      expect(_package.scripts['test:ci']).toBe('jest --ci --reporters=default --reporters=jest-junit');
    });
  });

  describe('with test not selected', () => {
    const noTestOptions = { ...defaultRollupOptions, useTesting: false };

    it('generates no test scripts', () => {
      const _package = generatePackage(defaultName, defaultOptions, noTestOptions);

      expect(_package.scripts.test).toBeUndefined();
      expect(_package.scripts['test:watch']).toBeUndefined();
      expect(_package.scripts['test:ci']).toBeUndefined();
    });
  });
});

describe('generateManifest', () => {
  const defaultName = 'name-of-the-project';
  const defaultOptions: Options = {
    type: 'module',
    default: false,
    config: true,
    force: false,
    deps: true,
    git: true,
    packageManager: 'npm',
  };

  const defaultRollupOptions = {
    useTypeScript: false,
    useLinting: false,
    useTesting: false,
    styleType: 'css' as const,
    cicd: 'github' as const,
  };

  describe('with type system', () => {
    const systemOptions = { ...defaultOptions, type: 'system' as const };

    it('generates the default system.json', () => {
      const manifest = generateManifest(defaultName, systemOptions, defaultRollupOptions);

      expect(manifest).toEqual({
        id: 'name-of-the-project',
        title: '<human readable title for name-of-the-project>',
        description: '<description of the package>',
        version: 'This is auto replaced',
        authors: [
          {
            name: '<your name>',
            email: '<optionally your e-mail address>',
            discord: '<optionally your discord username>',
          },
        ],
        compatibility: {
          minimum: '10',
          verified: '10',
        },
        scripts: [],
        esmodules: [`module/name-of-the-project.js`],
        styles: [`styles/name-of-the-project.css`],
        packs: [],
        relationships: { conflicts: [], requires: [] },
        languages: [
          {
            lang: 'en',
            name: 'English',
            path: 'lang/en.json',
          },
        ],
        socket: false,
        url: 'This is auto replaced',
        manifest: 'This is auto replaced',
        download: 'This is auto replaced',
        license:
          '<please choose an appropriate license. https://choosealicense.com/ is a great place to get more information if you are unsure>',
        readme: '<optionally the URL to your readme>',
        bugs: '<optionally the URL to your issue list>',
        changelog: '<optionally the URL to your changelog>',
        background: '<optionally a relative filepath to a background image to use for worlds created with this system>',
        initiative: '<inititative roll formula for your system>',
        gridDistance: 1,
        gridUnits: 'm',
        primaryTokenAttribute: '<optionally the attribute to use as primary resource in tokens by default>',
        secondaryTokenAttribute: '<optionally the attribute to use as secondary resource in tokens by default>',
      });
    });
  });

  describe('with type module', () => {
    const systemOptions = { ...defaultOptions, type: 'module' as const };

    it('generates the default module.json', () => {
      const manifest = generateManifest(defaultName, systemOptions, defaultRollupOptions);

      expect(manifest).toEqual({
        id: 'name-of-the-project',
        title: '<human readable title for name-of-the-project>',
        description: '<description of the package>',
        version: 'This is auto replaced',
        authors: [
          {
            name: '<your name>',
            email: '<optionally your e-mail address>',
            discord: '<optionally your discord username>',
          },
        ],
        bugs: '<optionally the URL to your issue list>',
        changelog: '<optionally the URL to your changelog>',
        compatibility: {
          minimum: '10',
          verified: '10',
        },
        scripts: [],
        esmodules: ['module/name-of-the-project.js'],
        styles: ['styles/name-of-the-project.css'],
        packs: [],
        readme: '<optionally the URL to your readme>',
        relationships: { conflicts: [], requires: [], systems: [] },
        languages: [
          {
            lang: 'en',
            name: 'English',
            path: 'lang/en.json',
          },
        ],
        socket: false,
        url: 'This is auto replaced',
        manifest: 'This is auto replaced',
        download: 'This is auto replaced',
        license:
          '<please choose an appropriate license. https://choosealicense.com/ is a great place to get more information if you are unsure>',
        library: false,
      });
    });
  });
});

describe('generateTemplate', () => {
  it('generates the default template', () => {
    const template = generateTemplate();

    expect(template).toEqual({
      Actor: {
        types: [],
        templates: {},
      },
      Item: {
        types: [],
        templates: {},
      },
    });
  });
});
