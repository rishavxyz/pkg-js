import chalk, { type ColorName } from "chalk";

export default function text(text: TemplateStringsArray, ...values: any) {
  let _text = '';

  text.forEach((string, i) => {
    _text += string + (values[i] || '')
  })

  return {
    color(colorName: ColorName) {
      _text = chalk[colorName](_text);
      return this;
    },
    bold () {
      _text = chalk.bold(_text);
      return this;
    },
    italic() {
      _text = chalk.italic(_text);
      return this;
    },
    print: () => console.write(_text),
    printLn: () => console.log(_text)
  }
}
