import { parseArgs } from "node:util";
import { exit } from 'process'

import log from "$/log";
import createFlags from "$/createFlags";
import text from "$/text";
import error, { ErrorType, type Error } from "$/error";

interface Flags {
  help?: boolean, aur?: boolean,
  sync?: boolean, yes?: boolean
}

function getArgs(): {
  args: string[], flags: Flags,
  error?: string
} {
  const options = createFlags(
    `h/help`
  , `y/yes`
  , 's/sync'
  , `a/aur`
  )
  .reduce((acc, cur) => {
    Object.assign(acc, cur);
    return acc;
  })

  try {
    const { values, positionals } = parseArgs(
      { args: Bun.argv.slice(2)
      , allowPositionals: true
      , strict: true
      , options
      }
    );
    return {
      args: positionals, flags: values
    };
  }
  catch (ERR) {
    return {
      args: [], flags: {},
      error: String(ERR)
    }
  }
}

function createCommand(
  { args, flags }: { args: string[], flags: Flags }
) {
  const option = args[0];
  args.shift();

  let command: string[] = [];

  const sync = flags.sync ? '-yy' : '';
  const yes = flags.yes ? '--noconfirm' : '';

  switch (option) {
    case 'i':
    case 'ins':
    case 'install': {
      command = [
        'sudo', 'aura',
        flags.aur ? '-Acax' : '-S',
        '--needed', yes, sync
      ];
      break;
    }
    case 'u':
    case 'upd':
    case 'update': {
      command = [
        'sudo', 'aura',
        flags.aur ? '-Au' : '-Su',
        '--needed', yes, sync
      ];
      break;
    }
    case 'r':
    case 'rem':
    case 'remove': {
      command = [
        'sudo', 'aura',
        '-Runsc', yes
      ];
      break;
    }
    case 's':
    case 'ser':
    case 'search': {
      command = ['aura', flags.aur ? '-As' : '-Ss'];
      break;
    }
    case 'f':
    case 'fin':
    case 'find': {
      command = ['aura', flags.aur ? '-Ai' : '-Si'];
      break;
    }
    default: {
      throw new error(ErrorType.FlagError,
        `Unknown option '${option}'`,
        `Use '--help' to see all available options`
      )
    }
  }

  return command.filter(onlyStrings => onlyStrings)
  .concat(args);
}

async function runCommand(values: { args: string[], flags:Flags }) {
  try {
    const command = createCommand(values);
    const commandStrated = Date.now();

    text `\n ${command.join(' ')} \n`
    .color('black')
    .color('bgCyan')
    .printLn()

    const proc = Bun.spawn(
      command
      ,
      { stdin: 'inherit'
      , stdout: 'inherit'
      }
    )

    if (await proc.exited == 1) {
      if ( command.includes('-Ss')
        || command.includes('-As')
      ) {
        throw new error('ItemNotFound'
        , 'Could not found the item'
        , command.includes('-As')
        ? 'Maybe a typo or item does not exist'
        : 'Try search the AUR with \'-a\' flag'
        )  
      }
      throw new error('CommandError', 'Command failed')
    }
    const timeTook = Date.now() - commandStrated;
    const timeRaw = timeTook / 1000;
    const time = timeRaw > 59 ? timeRaw / 60 : timeRaw;

    const unit = timeRaw > 59 ? 'minutes' : 'seconds';

    text `\nCompleted in ${time.toFixed(2)} ${unit}`
    .color('grey')
    .printLn()
  }
  catch (ERR) {
    error.show(ERR as Error)
    exit(1);
  }
}

export default function main() {

  const { error, ...values } = getArgs();

  if (error) {
    log("E", error);
    exit(1);
  }
  
  if ( values.args.length == 0
    || values.flags.help
  ) return text `
pkg - friendly Arch package wrapper

USAGE:
  pkg [COMMAND] [OPTIONS] [ARG ...]

COMMAND:
  i, ins, install \t install packages
  r, rem, remove  \t remove packages recursively
  u, upd, update  \t update/upgrade packages
  s, ser, search  \t search packages
  f, fin, find    \t find packages and verbose info

OPTIONS:
  -h, --help \t show this help text
  -y, --yes  \t alias for '--noconfirm'
  -a, --aur  \t use AUR instead of Arch repo
  -s, --sync \t alias for '-y'
`.printLn()
  
  runCommand(values);
  
  return undefined;
}