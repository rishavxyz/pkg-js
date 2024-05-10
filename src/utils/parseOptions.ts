declare global {
  var parsedOptions: {
    name: string;
    short?: string;
    command?: string[];
  }[]
}

export default function parseOptions(strings: TemplateStringsArray, ...values: any){

  let state = globalThis.parsedOptions ?? [];
  let string = '';

  strings.forEach((str, i) => {
    string += str + (values[i] || '')
  })

  const [option, command] = string.split('->');

  const [short, long] = option.trim().split('/');
  
  state.push(
    { name: long ?? short
    , short: long && short ? short : undefined
    , command: command ? command.split(' ').filter(word => word) : undefined
    }
  );

  globalThis.parsedOptions = state;

  return parseOptions;
}
