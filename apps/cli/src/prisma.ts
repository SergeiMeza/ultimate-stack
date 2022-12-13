import { arg, Command, format, HelpError } from '@ustack/internals'
import chalk from 'chalk'
import execa from 'execa'
import { isError } from 'util'

export class Prisma implements Command {
  static new(): Prisma {
    return new Prisma()
  }

  private static help = format(`
  Prisma CLI

  ${chalk.bold('Usage')}

    ${chalk.dim('$')} ustack prisma [options]

  ${chalk.bold('Options')}

        -h, --help  Displays this help message

  For more documentation visit: https://www.prisma.io/docs/reference/api-reference/command-reference
  ...
  `)

  // help message
  private help(error?: string): string | HelpError {
    if (error) {
      return new HelpError(`\n${chalk.bold.red('!')} ${error}\n${Prisma.help}`)
    }
    return Prisma.help
  }

  async parse(argv: string[]): Promise<string | Error> {
    const args = arg(argv, {}, false, true)

    if (isError(args)) {
      return this.help()
    }

    let argsForCmd: string[]
    argsForCmd = args._.slice(1)

    const { stdout } = await execa('npx', ['prisma', ...argsForCmd])
    return stdout
  }
}
