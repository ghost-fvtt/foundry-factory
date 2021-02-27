import { generateManifest } from '../../src/steps/create-manifest-json';

describe('generateManifest', () => {
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

  describe('with system set', () => {
    const systemOptions = { ...defaultOptions, system: true };

    it('generates the default system.json', () => {
      const manifest = generateManifest(systemOptions);

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
        styles: [`styles/name-of-the-project.js`],
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
    const systemOptions = { ...defaultOptions, system: false };

    it('generates the default module.json', () => {
      const manifest = generateManifest(systemOptions);

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
        styles: [`styles/name-of-the-project.js`],
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
