import chalk from "chalk";

enum LogType {
  E, W, I, D, V
}

export default function log(
  type: keyof typeof LogType | null = "V",
  ...data: unknown[]
) {
  switch (type) {
    case "E":
    return console.error(...data)

    case "W":
    return console.warn(
      chalk.hex('FFA500')("WARN:", ...data)
    )

    case "I":
    return console.log(
      chalk.blue("INFO:", ...data)
    )

    case "D":
    return console.dir("DEBUG: " + data[0],
      { depth: 10 }
    )

    case "V":
    return console.log("VERBOSE:", ...data)

    case null:
    return console.log(...data);
  }
}