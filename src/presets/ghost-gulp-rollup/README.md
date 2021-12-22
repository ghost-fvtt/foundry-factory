# ghost's Gulp + Rollup Preset for Foundry Factory

The preset will create a project based on [Gulp] and [Rollup]. It is inspired
by the project structure that [Foundry Project Creator] uses but differs from it
in a couple of aspects.

## Basic Directory Structure

This preset will create the following basic directory structure

```
.
├── README.md
├── foundryconfig.json
├── gulpfile.js
├── package.json
├── rollup.config.js
├── src
│   ├── assets
│   ├── fonts
│   ├── lang
│   ├── module
│   │   └── entryPoint.(js|ts)
│   ├── packs
│   ├── styles
│   │   └── entryPoint.(css|scss|less)
│   ├── (system|module).json
│   └── template.json                  // only if creating a system
└── test                               // only if testing is enabled
```

Depending on the selected configuration, additional configuration files will be
present.

## Configuration Options

This preset provides the following configuration options:

- Option to use TypeScript instead of JavaScript
- Option to set up linting (based on [ESLint] and [Prettier])
- Option to choose a CSS preprocessor ([Less] or [SCSS])
- Option to set up testing (based on [Jest])
- Option to set up a CI/CD pipeline (GitHub only for now)

The default options are JavaScript, linting enabled, no CSS preprocessor, no testing, and using a CI/CD pipeline.

## Things to adjust manually

- `src/module.json` and `src/system.json` respectively need adjustments for author, URL etc.
- You should add metadata (such as author etc.) to `package.json`.
- Choose a license for the project and add it as `LICENSE` file to the project root and mention it in the Licensing
  section of your `README.md`. If you don't know which license to choose, take a look at
  [Choose an open source license].

## Basic workflow

Here are a couple of common commands that can be used when a project has been
set up with this preset:

### Build the project

```
npm run build
```

### Link the built project to foundry's `Data` folder

Provide the path to your foundry data folder in the `foundryconfig.json` file in the project root, e.g.

```json
{
  "dataPath": "/absolute/path/to/your/FoundryVTT"
}
```

(if you are using Windows, make sure to use `\` as a path separator instead of `/`)

Then run
```
npm run link-project
```

On Windows, creating symlinks requires administrator privileges, so
unfortunately you need to run the above command in an administrator terminal for
it to work.

### Run the tests (if testing was set up)

```
npm test
```

### Run the linter (if linting was set up)

```
npm run lint
```

[Gulp]: https://gulpjs.com/
[Rollup]: https://rollupjs.org/
[Foundry Project Creator]: https://gitlab.com/foundry-projects/foundry-pc/create-foundry-project
[ESLint]: https://eslint.org/
[Prettier]: https://prettier.io/
[Less]: http://lesscss.org/
[SCSS]: https://sass-lang.com/documentation/syntax#scss
[Jest]: https://jestjs.io/
[Choose an open source license]: https://choosealicense.com/
