import main from "./src/main";
main();

const compFile = Bun.file(Bun.env.HOME + '/.config/fish/completions/pkg.fish')

if (await compFile.exists() == false && typeof Bun.which('fish') == 'string') {
    const file = Bun.file('completions/pkg.fish')
    await Bun.write(Bun.env.HOME + '/.config/fish/completions/pkg.fish', file)
}
