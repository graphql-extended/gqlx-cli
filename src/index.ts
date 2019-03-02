#!/usr/bin/env node

import { commandDir } from 'yargs';

commandDir('commands')
  .demandCommand()
  .help()
  .epilog('For more information visit https://graphql-extended.github.io.').argv;
