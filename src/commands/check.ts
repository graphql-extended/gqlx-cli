import { Argv, Arguments } from 'yargs';
import { defaultApi, utils } from 'gqlx-js';
import { readFile } from '../utils';

export interface CheckArguments {
  source: string;
  api: Array<string>;
}

export const command = 'check <source>';

export const describe = 'Validates the schema from the given source gqlx file.';

export function builder(args: Argv) {
  return args
    .positional('source', {
      describe: 'Path to the gqlx file containing the schema.',
    })
    .array('api')
    .describe('api', 'The keys for the API to expose to the gqlx resolvers.')
    .default('api', Object.keys(defaultApi));
}

export function handler(argv: Arguments<CheckArguments>) {
  const api = argv.api.reduce(
    (aggr, value) => ({
      ...aggr,
      [value]: true,
    }),
    {},
  );
  const content = readFile(argv.source);
  const gqlx = utils.parseDynamicSchema(content);
  utils.validate(gqlx, api);
  console.log('All good!');
}
