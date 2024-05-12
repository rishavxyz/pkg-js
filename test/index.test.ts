import t from 'bun:test';

import { ProcessError } from "$/customError";

interface ProcessOptions {
  stdin?:  'ignore'|'inherit'|'pipe';
  stdout?: 'ignore'|'inherit'|'pipe';
  rawText?: boolean;
}

export default async function runProcess(
  process: string|string[], options?: ProcessOptions
) {
  if (process instanceof Array == false)
  process = process.split(' ');

  const rawText = options?.rawText;
  delete options?.rawText;

  const proc = Bun.spawn(process, options);
  
  return 1;

  // if (options?.stdout)
  // return proc.stdout
  // const exitCode = await proc.exited;

  // if (exitCode == 1)
  // throw new ProcessError('Process exited with errors');

  // if (options?.stdout == 'inherit')
  // return proc.stdout;

  // if (rawText)
  // return await new Response(proc.stdout).text();

  // return exitCode;
}

const a = await runProcess('pacman --version', {stdout : 'inherit'})
console.log(
  a
);



// t.test('string -> number',
//   async () => t.expect(
//     await runProcess('echo hello')
//   )
//   .toBe(0)
// );
