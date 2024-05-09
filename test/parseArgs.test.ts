import { parseArgs } from "node:util";
import { test, expect, describe } from "bun:test";

function getArgs(...args: string[]) {
  try {
    const { values } = parseArgs({
      args,
      allowPositionals: true,
      strict: true,
      options: {
        help: { type: 'boolean', short: 'h' },
        y: { type: 'boolean' }
      }
    });

    return values;
  }
  catch (_) {
    return null;
  }
}

describe('ParseArgs', () => {
  test('Should return object',
    () => expect(getArgs('--help', '-y')).toBeObject()
  )
  test('Should return null',
    () => expect(getArgs('-y', '-l')).toBeNull()
  )
})