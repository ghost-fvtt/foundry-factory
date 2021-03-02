import { Options } from '../../../src/options';
import {
  generateManifest,
  generatePackage,
  generateTemplate,
} from '../../../src/presets/gulp-rollup/generate-programmatic-files';

describe('generatePackageJSON', () => {
  const defaultName = 'name-of-the-project';

  const defaultOptions: Options = {
    type: 'module',
    preset: 'gulp-rollup',
    default: false,
    config: true,
    force: false,
    git: false,
    deps: true,
  };

  const defaultRollupOptions = {
    useTypeScript: false,
    useLinting: false,
    useTesting: false,
    styleType: 'css' as const,
  };

  it('includes the name given in the options', () => {
    const _package = generatePackage(defaultName, defaultOptions, defaultRollupOptions);

    expect(_package.name).toBe('name-of-the-project');
  });

  it('includes all static properties', () => {
    const _package = generatePackage(defaultName, defaultOptions, defaultRollupOptions);

    expect(_package.private).toBe(true);
    expect(_package.version).toBe('0.0.0');
    expect(_package.description).toBe('');
    expect(_package.license).toBe('');
    expect(_package.homepage).toBe('');
    expect(_package.repository).toEqual({ type: 'git', url: '' });
    expect(_package.bugs).toEqual({ url: '' });
    expect(_package.contributors).toEqual([{ name: '', email: '' }]);
    expect(_package.devDependencies).toEqual({});
  });

  describe('with typescript selected', () => {
    const typescriptOptions = { ...defaultRollupOptions, useTypeScript: true };

    it('generates the updateFoundryVTTType script if typescript is selected', () => {
      const _package = generatePackage(defaultName, defaultOptions, typescriptOptions);

      expect(_package.scripts.updateFoundryVTTTypes).toBe(
        'npm install --save-dev github:League-of-Foundry-Developers/foundry-vtt-types#foundry-0.7.9',
      );
    });
  });

  describe('with typescript not selected', () => {
    const noTypescriptOptions = { ...defaultRollupOptions, useTypeScript: false };

    it('does not generate the updateFoundryVTTType script if typescript is not selected', () => {
      const _package = generatePackage(defaultName, defaultOptions, noTypescriptOptions);

      expect(_package.scripts.updateFoundryVTTTypes).toBeUndefined();
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

      it('generates lint scripts that lint ts and js', () => {
        const _package = generatePackage(defaultName, defaultOptions, typescriptOptions);

        expect(_package.scripts.lint).toBe('eslint --ext .ts,.js .');
        expect(_package.scripts['lint:fix']).toBe('eslint --ext .ts,.js --fix .');
      });

      describe('and not git initialization', () => {
        it('does not generate a lint-staged configuration', () => {
          const _package = generatePackage(defaultName, { ...defaultOptions, git: false }, lintingOptions);
          console.log(defaultOptions);
          expect(_package['lint-staged']).toBeUndefined();
        });
      });

      describe('and no CSS preprocessor selected', () => {
        const cssOptions = { ...typescriptOptions, styleType: 'css' as const };

        it('generates a format script that formats ts, js, json, and css', () => {
          const _package = generatePackage(defaultName, defaultOptions, cssOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(ts|js|json|css)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for ts, js, json, and css', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, cssOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(ts|js)': 'eslint --fix',
              '*.(json|css)': 'prettier --write',
            });
          });
        });
      });

      describe('and less selected as CSS preprocessor', () => {
        const lessOptions = { ...typescriptOptions, styleType: 'less' as const };

        it('generates a format script that formats ts, js, json, and less', () => {
          const _package = generatePackage(defaultName, defaultOptions, lessOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(ts|js|json|less)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for ts, js, json, and less', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, lessOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(ts|js)': 'eslint --fix',
              '*.(json|less)': 'prettier --write',
            });
          });
        });
      });

      describe('and sass selected as CSS preprocessor', () => {
        const sassOptions = { ...typescriptOptions, styleType: 'scss' as const };

        it('generates a format script that formats ts, js, json, and scss', () => {
          const _package = generatePackage(defaultName, defaultOptions, sassOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(ts|js|json|scss)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for ts, js, json, and scss', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, sassOptions);

            expect(_package['lint-staged']).toEqual({
              '*.(ts|js)': 'eslint --fix',
              '*.(json|scss)': 'prettier --write',
            });
          });
        });
      });
    });

    describe('and typescript not selected', () => {
      const noTypescriptOptions = { ...lintingOptions, useTypeScript: false };

      it('generates lint scripts that lint js', () => {
        const _package = generatePackage(defaultName, defaultOptions, noTypescriptOptions);

        expect(_package.scripts.lint).toBe('eslint --ext .js .');
        expect(_package.scripts['lint:fix']).toBe('eslint --ext .js --fix .');
      });

      describe('and no CSS preprocessor selected', () => {
        const cssOptions = { ...noTypescriptOptions, styleType: 'css' as const };

        it('generates a format script that formats ts, js, json, and css', () => {
          const _package = generatePackage(defaultName, defaultOptions, cssOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(js|json|css)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for js, json, and css', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, cssOptions);

            expect(_package['lint-staged']).toEqual({ '*.(js)': 'eslint --fix', '*.(json|css)': 'prettier --write' });
          });
        });
      });

      describe('and less selected as CSS preprocessor', () => {
        const lessOptions = { ...noTypescriptOptions, styleType: 'less' as const };

        it('generates a format script that formats ts, js, json, and less', () => {
          const _package = generatePackage(defaultName, defaultOptions, lessOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(js|json|less)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for js, json, and less', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, lessOptions);

            expect(_package['lint-staged']).toEqual({ '*.(js)': 'eslint --fix', '*.(json|less)': 'prettier --write' });
          });
        });
      });

      describe('and sass selected as CSS preprocessor', () => {
        const sassOptions = { ...noTypescriptOptions, styleType: 'scss' as const };

        it('generates a format script that formats ts, js, json, and scss', () => {
          const _package = generatePackage(defaultName, defaultOptions, sassOptions);

          expect(_package.scripts.format).toBe('prettier --write "./**/*.(js|json|scss)"');
        });

        describe('and git initialization', () => {
          it('generates a lint-staged configuration for js, json, and scss', () => {
            const _package = generatePackage(defaultName, { ...defaultOptions, git: true }, sassOptions);

            expect(_package['lint-staged']).toEqual({ '*.(js)': 'eslint --fix', '*.(json|scss)': 'prettier --write' });
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
  const defaultOptions = {
    type: 'module' as const,
    default: false,
    config: true,
    force: false,
    deps: true,
    git: true,
  };

  describe('with system set', () => {
    const systemOptions = { ...defaultOptions, type: 'system' as const };

    it('generates the default system.json', () => {
      const manifest = generateManifest(defaultName, systemOptions);

      expect(manifest).toEqual({
        name: 'name-of-the-project',
        title: 'name-of-the-project',
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
        esmodules: [`module/name-of-the-project.js`],
        styles: [`styles/name-of-the-project.css`],
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
        initiative: '',
        gridDistance: 1,
        gridUnits: '',
        primaryTokenAttribute: '',
        secondaryTokenAttribute: '',
      });
    });
  });

  describe('with system not set', () => {
    const systemOptions = { ...defaultOptions, type: 'module' as const };

    it('generates the default module.json', () => {
      const manifest = generateManifest(defaultName, systemOptions);

      expect(manifest).toEqual({
        name: 'name-of-the-project',
        title: 'name-of-the-project',
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
        esmodules: [`module/name-of-the-project.js`],
        styles: [`styles/name-of-the-project.css`],
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
        system: [],
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
