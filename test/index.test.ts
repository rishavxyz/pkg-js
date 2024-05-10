import error, { ErrorType } from "$/error";
import getCommandByOption from "$/getCommandByOption";
import log from "$/log";
import parseOptions from "$/parseOptions"

const aur = true;
const sync = true;
const yes = true;
const pkgs = ['htop', 'neovim']

parseOptions
  `i/install -> sudo aura --needed ${aur ? '-Acax' : '-S'} ${sync ? '-s' : ''}`
  `rm/remove -> sudo aura -Runsc ${yes ? '--noconfirm' : ''} ${pkgs}`
  `v/version -> aura --version`

const command = getCommandByOption('r');

if (command instanceof error) {
  log('E', command.error);
} else {
  console.log(command);
}
