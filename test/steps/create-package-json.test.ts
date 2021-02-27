import { generatePackage } from '../../src/steps/create-package-json';

describe('generatePackageJSON', () => {
  const defaultOptions = {
    name: 'name-of-the-project',
    projectDirectory: '',
    system: false,
    typescript: false,
    lint: false,
    test: false,
    css: undefined,
    force: false,
    deps: true,
    git: true,
  };

  it('includes the name given in the options', () => {
    const _package = generatePackage(defaultOptions);

    expect(_package.name).toBe('name-of-the-project');
  });

  it('includes all static properties', () => {
    const _package = generatePackage(defaultOptions);

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
    const typescriptOptions = { ...defaultOptions, typescript: true };

    it('generates the updateFoundryVTTType script if typescript is selected', () => {
      const _package = generatePackage(typescriptOptions);

      expect(_package.scripts.updateFoundryVTTTypes).toBe(
        'npm install --save-dev github:League-of-Foundry-Developers/foundry-vtt-types#foundry-0.7.9',
      );
    });
  });

  describe('with typescript not selected', () => {
    const noTypescriptOptions = { ...defaultOptions, typescript: false };

    it('does not generate the updateFoundryVTTType script if typescript is not selected', () => {
      const _package = generatePackage(noTypescriptOptions);

      expect(_package.scripts.updateFoundryVTTTypes).toBeUndefined();
    });
  });

  describe('with lint not selected', () => {
    const noLintingOptions = { ...defaultOptions, lint: false };

    it('does not generate lint or format scripts', () => {
      const _package = generatePackage(noLintingOptions);

      expect(_package.scripts.lint).toBeUndefined();
      expect(_package.scripts['lint:fix']).toBeUndefined();
      expect(_package.scripts.format).toBeUndefined();
    });

    it('does not generate a lint-staged configuration', () => {
      const _package = generatePackage(noLintingOptions);

      expect(_package['lint-staged']).toBeUndefined();
    });
  });

  describe('with lint selected', () => {
    const lintingOptions = { ...defaultOptions, lint: true };

    describe('and typescript selected', () => {
      const typescriptOptions = { ...lintingOptions, typescript: true };

      it('generates lint scripts that lint ts and js', () => {
        const _package = generatePackage(typescriptOptions);

        expect(_package.scripts.lint).toBe('eslint --ext .ts,.js .');
        expect(_package.scripts['lint:fix']).toBe('eslint --ext .ts,.js --fix .');
      });

      describe('and no CSS preprocessor selected', () => {
        const cssOptions = { ...typescriptOptions, css: undefined };

        it('generates a format script that formats ts, js, json, and css', () => {
          const _package = generatePackage(cssOptions);

          expect(_package.scripts.format).toBe("prettier --write './**/*.(ts|js|json|css)'");
        });

        it('generates a lint-staged configuration for ts, js, json, and css', () => {
          const _package = generatePackage(cssOptions);

          expect(_package['lint-staged']).toEqual({ '*.(ts|js)': 'eslint --fix', '*.(json|css)': 'prettier --write' });
        });
      });

      describe('and less selected as CSS preprocessor', () => {
        const lessOptions = { ...typescriptOptions, css: 'less' as const };

        it('generates a format script that formats ts, js, json, and less', () => {
          const _package = generatePackage(lessOptions);

          expect(_package.scripts.format).toBe("prettier --write './**/*.(ts|js|json|less)'");
        });

        it('generates a lint-staged configuration for ts, js, json, and less', () => {
          const _package = generatePackage(lessOptions);

          expect(_package['lint-staged']).toEqual({ '*.(ts|js)': 'eslint --fix', '*.(json|less)': 'prettier --write' });
        });
      });

      describe('and sass selected as CSS preprocessor', () => {
        const sassOptions = { ...typescriptOptions, css: 'sass' as const };

        it('generates a format script that formats ts, js, json, and scss', () => {
          const _package = generatePackage(sassOptions);

          expect(_package.scripts.format).toBe("prettier --write './**/*.(ts|js|json|scss)'");
        });

        it('generates a lint-staged configuration for ts, js, json, and scss', () => {
          const _package = generatePackage(sassOptions);

          expect(_package['lint-staged']).toEqual({ '*.(ts|js)': 'eslint --fix', '*.(json|scss)': 'prettier --write' });
        });
      });
    });

    describe('and typescript not selected', () => {
      const noTypescriptOptions = { ...lintingOptions, typescript: false };

      it('generates lint scripts that lint js', () => {
        const _package = generatePackage(noTypescriptOptions);

        expect(_package.scripts.lint).toBe('eslint --ext .js .');
        expect(_package.scripts['lint:fix']).toBe('eslint --ext .js --fix .');
      });

      describe('and no CSS preprocessor selected', () => {
        const cssOptions = { ...noTypescriptOptions, css: undefined };

        it('generates a format script that formats ts, js, json, and css', () => {
          const _package = generatePackage(cssOptions);

          expect(_package.scripts.format).toBe("prettier --write './**/*.(js|json|css)'");
        });

        it('generates a lint-staged configuration for js, json, and css', () => {
          const _package = generatePackage(cssOptions);

          expect(_package['lint-staged']).toEqual({ '*.(js)': 'eslint --fix', '*.(json|css)': 'prettier --write' });
        });
      });

      describe('and less selected as CSS preprocessor', () => {
        const lessOptions = { ...noTypescriptOptions, css: 'less' as const };

        it('generates a format script that formats ts, js, json, and less', () => {
          const _package = generatePackage(lessOptions);

          expect(_package.scripts.format).toBe("prettier --write './**/*.(js|json|less)'");
        });

        it('generates a lint-staged configuration for js, json, and less', () => {
          const _package = generatePackage(lessOptions);

          expect(_package['lint-staged']).toEqual({ '*.(js)': 'eslint --fix', '*.(json|less)': 'prettier --write' });
        });
      });

      describe('and sass selected as CSS preprocessor', () => {
        const sassOptions = { ...noTypescriptOptions, css: 'sass' as const };

        it('generates a format script that formats ts, js, json, and scss', () => {
          const _package = generatePackage(sassOptions);

          expect(_package.scripts.format).toBe("prettier --write './**/*.(js|json|scss)'");
        });

        it('generates a lint-staged configuration for js, json, and scss', () => {
          const _package = generatePackage(sassOptions);

          expect(_package['lint-staged']).toEqual({ '*.(js)': 'eslint --fix', '*.(json|scss)': 'prettier --write' });
        });
      });
    });
  });

  describe('with test selected', () => {
    const testOptions = { ...defaultOptions, test: true };

    it('generates test scripts', () => {
      const _package = generatePackage(testOptions);

      expect(_package.scripts.test).toBe('jest');
      expect(_package.scripts['test:watch']).toBe('jest --watch');
      expect(_package.scripts['test:ci']).toBe('jest --ci --reporters=default --reporters=jest-junit');
    });
  });

  describe('with test not selected', () => {
    const noTestOptions = { ...defaultOptions, test: false };

    it('generates no test scripts', () => {
      const _package = generatePackage(noTestOptions);

      expect(_package.scripts.test).toBeUndefined();
      expect(_package.scripts['test:watch']).toBeUndefined();
      expect(_package.scripts['test:ci']).toBeUndefined();
    });
  });
});
