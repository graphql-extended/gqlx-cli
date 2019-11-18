import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';
import { resolve } from 'path';
import { Argv, Arguments } from 'yargs';
import { open } from 'inspector';
import { configureGqlx, createService, Service } from 'gqlx-apollo-express-server';
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
  header?: string[];
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
    .array('header')
    .describe('header', 'Additional http headers to be set on every request')
    .example(
      '$0 serve --header="Authorization=Bearer *****"',
      'sets the Authorization header to "Bearer *****" for every request',
    )
    .default('header', [])
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

  const fetch = request.defaults({
    headers:
      argv.header &&
      argv.header
        .map(arg => arg.split('=', 2)) // split key=value
        .filter(tuple => tuple.length === 2 && tuple[1]) // remove elements without a value
        .reduce(
          (headers, [key, value]) => ({ ...headers, [key]: headers[key] ? [...headers[key], value] : [value] }),
          {},
        ),
  });

  const gqlxServer = configureGqlx({
    port: argv.port,
    host: argv.host,
    paths: {
      root: argv.pathRoot,
      subscriptions: argv.pathSubscriptions,
    },
    createApi(...args) {
      return createApi(fetch, ...args);
    },
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
