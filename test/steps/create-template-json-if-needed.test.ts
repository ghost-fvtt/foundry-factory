import { generateTemplate } from '../../src/steps/create-template-json-if-needed';

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
