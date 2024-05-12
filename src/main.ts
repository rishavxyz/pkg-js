import { parseArgs } from "node:util";
import { exit } from 'process'

import log from "$/log";
import createFlags from "$/createFlags";
import text from "$/text";
import error, { ErrorType, type Error } from "$/error";
import getCommandByOption from "$/getCommandByOption";
import parseOptions from "$/parseOptions";

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

function createCommand({ args, flags }: { args: string[], flags:Flags }) {
  const option = args[0];
  args.shift();

  const sync = flags.sync ? '-yy' : '';
  const yes = flags.yes ? '--noconfirm' : '';
  const aur = flags.aur ?? false;
  const rest = args.join(' ');

  parseOptions
    `i/install -> sudo aura --needed ${aur ? '-Acax' : '-S'} ${sync} ${yes} ${rest}`
    `up/update         -> sudo aura --needed ${aur ? '-Au' : '-Su'} ${sync} ${rest}`
    `rm/remove         -> sudo aura -Runsc ${yes} ${rest}`
    `b/backup          -> sudo aura -B`
    `br/backup-restore -> sudo aura -Br`
    `bc/backup-clean   -> sudo aura -Bc`
    `fd/find           -> aura ${aur ? '-Ai' : '-Si'} ${args[0]}`
    `s/search          -> aura ${aur ? '-As' : '-Ss'} ${args[0]}`
    `li/list-installed -> aura -Q`

  const command = getCommandByOption(option);

  return command;
}

async function runCommand(values: { args: string[], flags:Flags }) {
  try {
    const command = createCommand(values);

    if (command instanceof error)
    throw new error(
      command.type as keyof typeof ErrorType,
      command.error, command.message
    )

    text `\n ${command.join(' ')} \n`
    .color('black')
    .color('bgCyan')
    .printLn()

    const commandStrated = Date.now();
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
  i, install [-y|-s|-a]  [pkg1 pkg2 ...] \t install packages
  r, remove  [-y]        [pkg1 pkg2 ...] \t remove packages recursively
  u, update  [-a|-s]     [pkg1 pkg2 ...] \t update/upgrade packages
  s, search  [-a]        [pkg1]          \t search packages
  f, find    [-a]        [pkg1]          \t find packages and verbose info
  b, backup                              \t backup current package state
  br, backup-restore                     \t restore from backed interactively
  bc, backup-clean       [COUNT]         \t remove backed-up package state
  li, list-installed                     \t list installed packages

OPTIONS:
  -h, --help \t show this help text
  -y, --yes  \t alias for '--noconfirm'
  -a, --aur  \t use AUR instead of Arch repo
  -s, --sync \t alias for '-y'
`.printLn()
  
  runCommand(values);
  
  return undefined;
}
