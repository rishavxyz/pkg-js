# pkg

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
# pkg-js

An easy to use wrapper for the Aura package manager for Arch Linux distros.

**Yes it's a wrapper, a kind of aliases and not a package manager itself. It uses
`aura` package manager and not pacman.**

## What it does?

It creates simple and easy to remember commands like `install` or `remove`.

## Install and use

Clone this repo and go to the project folder.

Then run

```bash
bun i && bun run build
```

It will create a binary inside the `build` directory then you can run that.

```bash
./build/pkg
```

Now you can add the `pkg` binary to you $PATH and enjoy.

## commands

Running `pkg` without any commands or arguments will return a help message.

### This is the help message

```text
USAGE:
  pkg [COMMAND] [OPTIONS] [ARG ...]

COMMAND:
  i,  install [-y|-s|-a]  [pkg1 pkg2 ...]    install packages
  rm, remove  [-y]        [pkg1 pkg2 ...]    remove packages recursively
  up, update  [-a|-s]     [pkg1 pkg2 ...]    update/upgrade packages
  fd, find    [-a]        [pkg1]             find packages and verbose info
  s,  search  [-a]        [pkg1]             search packages
  b,  backup                                 backup current package state
  br, backup-restore                         restore from backed interactively
  bc, backup-clean        [COUNT]            remove backed-up package state
  li, list-installed                         list installed packages

OPTIONS:
  -h, --help     show this help text
  -y, --yes      alias for '--noconfirm'
  -a, --aur      use AUR instead of Arch repo
  -s, --sync     alias for '-y'
```
