# gqlx CLI

[![Build Status](https://travis-ci.org/graphql-extended/gqlx-cli.svg?branch=master)](https://travis-ci.org/graphql-extended/gqlx-cli)
[![npm](https://img.shields.io/npm/v/gqlx-cli.svg)](https://www.npmjs.com/package/gqlx-cli)
[![node](https://img.shields.io/node/v/gqlx-cli.svg)](https://www.npmjs.com/package/gqlx-cli)
[![GitHub tag](https://img.shields.io/github/tag/graphql-extended/gqlx-cli.svg)](https://github.com/graphql-extended/gqlx-cli/releases)
[![GitHub issues](https://img.shields.io/github/issues/graphql-extended/gqlx-cli.svg)](https://github.com/graphql-extended/gqlx-cli/issues)

Command line utility for the gqlx language.

![gqlx Logo](https://github.com/graphql-extended/gqlx-spec/raw/master/logo.png)

## Installation

To use the CLI you will need Node.js and NPM installed on your machine.

You can install the command line utility globally, which makes the `gqlx` command available.

```sh
npm i -g gqlx-cli
```

Alternatively, you can use another utility like `npx` to run the package on demand without a global installation.

## Commands

The basic syntax for the `gqlx` utility is 

```sh
gqlx <command>
```

General flags are:

`--version` - Show version number (`boolean`).

`--help` - Show help (`boolean`).

The specific positionals, flags etc. depend on the used command. The following sections go into each available command.

### `check`

Validates the schema from the given source gqlx file.

#### Positionals

`source` - Path to the gqlx file containing the schema (**required**).

#### Options

`--api` - The keys for the API to expose to the gqlx resolvers (`array`, default: `["get","post","del","put","form","listen"]`).

### `serve`

Compiles and runs the schema from the given source gqlx file.

#### Positionals

`source` - Path to the gqlx file containing the schema (**required**).

#### Options

`--port` - The port where the server is running at (`number`, default: `8080`).

`--host` - The external hostname of the current server (`string`, default: `"http://localhost"`).

`--service-url` - The root URL of the service target, if any (`string`).

`--path-root` - The path hosting the GraphQL server (`string`, default: `"/"`).

`--path-subscriptions` - The path for WebSocket connections (`string`, default: `"/subscriptions"`).

`--api` - Path to the JS file containing exported function for an API (`string`, default: `defaultApiImpl`).

`--watch` - Watches the gqlx file for changes (`boolean`, default: `false`).

`--debug` - Allows debugger statements and opens the node-inspector (`boolean`, default: `false`).

### `schema`

Extracts the schema from the given source gqlx file.

#### Positionals

`source` - Path to the gqlx file containing the schema (**required**).

#### Options

`--out` - Path to the target file for writing out the schema. If omitted the result is shown in the command line (`string`).

## Example

Suppose you have the following gqlx file (*example.gqlx*) located somewhere:

```gqlx
type Todo {
  id: ID
  userId: Int
  title: String
  completed: Boolean
}

type Query {
  todo(id: ID!): Todo {
    get(`https://jsonplaceholder.typicode.com/todos/${id}`)
  }

  todos: [Todo] {
    get(`https://jsonplaceholder.typicode.com/todos`)
  }
}
```

Running a server with the following command:

```sh
gqlx serve example.gqlx --watch
```

will give you a GraphQL server sitting at port 8080. You can access the interactive GraphQL explorer via [http://localhost:8080/graphiql](http://localhost:8080/graphiql). Note, since we supplied the `--watch` flag we can just edit the gqlx file (e.g., to add a new resource) making it possible to access the updated resource definitions without needing to restart the server.

Furthermore, you can just add the `--debug` flag to enable writing `debugger;` statements in your gqlx files. This option lets you use the browser (e.g., Chrome Inspector reachable via [about://inspect](about://inspect)) to connect and debug your compiled gqlx resolvers.

## Contributing

We are totally open for contribution and appreciate any feedback, bug reports, or feature requests. More detailed information on contributing incl. a code of conduct are soon to be presented.

## Changelog

This project adheres to [semantic versioning](https://semver.org).

You can find the changelog in the [CHANGELOG.md](CHANGELOG.md) file.

## License

gqlx-cli is released using the MIT license. For more information see the [LICENSE file](LICENSE).
