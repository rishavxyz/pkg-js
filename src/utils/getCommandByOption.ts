import error from "./error";

export default function getCommandByOption(option: string) {

  const parsedOptions = globalThis.parsedOptions;
  
  if (option == '') return new error('CommandError', 'Option not found', "See '-h' for help.");

  for (const parsedOption of parsedOptions) {
    if ( parsedOption.name == option
      || parsedOption.short == option
    )
    return parsedOption.command ?? [];
  }
  return new error('TypeError', 'Not a known recognized option', "See '-h' for help.");
}
