import { Argv, Arguments } from 'yargs';
import { utils } from 'gqlx-js';
import { readFile, writeFile } from '../utils';

export interface SchemaArguments {
  source: string;
  out?: string;
}

export const command = 'schema <source>';

export const describe = 'Gets the schema from the given source gqlx file.';

export function builder(args: Argv) {
  return args
    .positional('source', {
      describe: 'Path to the gqlx file containing the schema.',
    })
    .string('out')
    .describe(
      'out',
      'Path to the target file for writing out the schema. If omitted the result is shown in the command line.',
    );
}

export function handler(argv: Arguments<SchemaArguments>) {
  const content = readFile(argv.source);
  const result = utils.parseDynamicSchema(content);

  if (argv.out) {
    writeFile(argv.out, result.schema.text, true);
  } else {
    console.log(result.schema.text);
  }
}
