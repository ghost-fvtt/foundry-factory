import type { Options } from '../options';

/**
 * A path to a template file, relative to the template directory.
 */
export type TemplateFilePath = string;

/**
 * A path to a file to create, relative to the target directory.
 */
export type TargetFilePath = string;

/**
 * The interface that all presets must implement.
 */
export interface Preset {
  /**
   * Returns a map between target files and the strings to write them.
   */
  getProgrammaticFiles?: () => Promise<Record<TargetFilePath, string>>;

  /**
   * Returns a map between target files and templates which are rendered to the corresponding files.
   */
  getTemplateFiles?: () => Promise<Record<TargetFilePath, TemplateFilePath>>;

  /**
   * Returns template variables to provide to the templates in addition to the options and the name when rendering them.
   */
  getTemplateVariables?: () => Promise<Record<string, unknown>>;

  /**
   * Returns a list of additional directory paths to create, relative to the target directory.
   */
  getAdditionalDirectories?: () => Promise<string[]>;

  /**
   * Returns a list of dependencies to install.
   */
  getDependencies?: () => Promise<string[]>;

  /**
   * Returns a list of development dependencies to install.
   */
  getDevDependencies?: () => Promise<string[]>;

  /**
   * Returns a list of commands to execute after the rest of the installation has completed.
   */
  getPostInstallationCommands?: () => Promise<string[]>;
}

/**
 * An interface describing an object that can create presets.
 * Typically this will be the constructor object of a class implementing {@link Preset}.
 */
export interface PresetConstructor {
  /**
   * Create a new preset, possibly interactively configuring it.
   * @param packageId The id of the project being created
   * @param options The passed command line options
   */
  create(packageId: string, options: Options): Promise<Preset>;

  /**
   * Create a new preset, using the default configuration of the preset.
   * @param packageId The id of the project being created
   * @param options The passed command line options
   */
  createDefault(packageId: string, options: Options): Promise<Preset>;

  /**
   * Whether or not the preset supports the given options. This will be used to decide if the preset should be displayed
   * for selection.
   * @param options The options that the project is being created with.
   */
  supports(options: Options): boolean;

  /**
   * The name of the preset. This is used when the user is prompted for preset selection.
   */
  readonly presetName: string;

  /**
   * A link to the documentation of the preset. If present, this will also be displayed in the preset selection, so use
   * a short link.
   */
  readonly documentationLink?: string;
}
