import { arg, HelpError, isError } from '@ustack/internals'
import chalk from 'chalk'
import { CLI } from './cli'

import { Init } from './init'

const commandArray = process.argv.slice(2)

process.removeAllListeners('warning')

process.on('uncaughtException', e => {
  console.trace(e)
})

process.on('unhandledRejection', e => {
  console.trace(e)
})

// Listen to Ctrl + C and exit
process.once('SIGINT', () => {
  process.exit(130)
})

// Parse CLI arguments
const args = arg(commandArray, {}, false, true)

// Redact the command options and make it a string

// because chalk ...
if (process.env.NO_COLOR) {
  chalk.level = 0
}

/** Main function */
async function main(): Promise<number> {
  // create a new CLI with our subcommands

  const cli = CLI.new(
    {
      init: Init.new(),
    },
    ['init'],
  )

  // Execute the command
  const result = await cli.parse(commandArray)
  // Did it error?
  if (result instanceof HelpError) {
    console.error(result.message)
    // TODO: We could do like Bash (and other)
    // = return an exit status of 2 to indicate incorrect usage like invalid options or missing arguments.
    // https://tldp.org/LDP/abs/html/exitcodes.html
    return 1
  } else if (isError(result)) {
    console.error(result)
    return 1
  }

  // Success
  console.log(result)

  return 0
}

/**
 * Run our program
 */

// if (eval('require.main === module')) {
main()
  .then(code => {
    if (code !== 0) {
      process.exit(code)
    }
  })
  .catch((err: any) => {
    console.error(chalk.redBright.bold('Error: ') + err.message)
    process.exit(1)
  })
// }
