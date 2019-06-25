import * as express from 'express';
import * as bodyParser from 'body-parser';
import { resolve } from 'path';
import { Argv, Arguments } from 'yargs';
import { open } from 'inspector';
import { configureGqlx, createService } from 'gqlx-apollo-express-server';
import { readFile, watch } from '../utils';

export interface SchemaArguments {
  source: string;
  api: string;
  port: number;
  host: string;
  pathRoot: string;
  pathSubscriptions: string;
  serviceUrl?: string;
  watch?: boolean;
  debug?: boolean;
}

export const command = 'serve <source>';

export const describe = 'Validates the schema from the given source gqlx file.';

export function builder(args: Argv) {
  return args
    .positional('source', {
      describe: 'Path to the gqlx file containing the schema.',
    })
    .number('port')
    .describe('port', 'The port where the server is running at.')
    .default('port', 8080)
    .string('host')
    .describe('host', 'The external hostname of the current server.')
    .default('host', 'http://localhost')
    .string('service-url')
    .describe('service-url', 'The root URL of the service target, if any.')
    .string('path-root')
    .describe('path-root', 'The path hosting the GraphQL server.')
    .default('path-root', '/')
    .string('path-subscriptions')
    .describe('path-subscriptions', 'The path for WebSocket connections.')
    .default('path-subscriptions', '/subscriptions')
    .boolean('debug')
    .describe('debug', 'Allows debugger statements and opens the node-inspector.')
    .default('debug', false)
    .alias('debug', 'inspect')
    .string('api')
    .describe('api', 'Path to the JS file containing exported function for an API.')
    .default('api', resolve(__dirname, '../api'))
    .boolean('watch')
    .describe('watch', 'Watches the gqlx file for changes.')
    .default('watch', false);
}

export function handler(argv: Arguments<SchemaArguments>) {
  const { apiDefinition, createApi } = require(argv.api);
  const getService = (content: string) =>
    createService(
      argv.source,
      content,
      {
        url: argv.serviceUrl || argv.host,
      },
      apiDefinition,
      {
        debug: argv.debug,
      },
    );
  const originalService = getService(readFile(argv.source));
  const app = express();
  const gqlxServer = configureGqlx({
    port: argv.port,
    host: argv.host,
    paths: {
      root: argv.pathRoot,
      subscriptions: argv.pathSubscriptions,
    },
    createApi,
    services: [originalService],
  });

  if (argv.debug) {
    open();
  }

  if (argv.watch) {
    watch(argv.source, content => {
      console.log('File changed - updating ...');
      gqlxServer.update(getService(content));
    });
  }

  app.use(bodyParser.json());
  gqlxServer.applyMiddleware(app);

  app.listen(argv.port, () => {
    console.log(`Listening at ${argv.port} ...`);
  });
}
