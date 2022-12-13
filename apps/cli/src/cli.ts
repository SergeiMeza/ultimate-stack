import type { Command, Commands } from '@ustack/internals'
import {
  arg,
  format,
  HelpError,
  isError,
  unknownCommand,
} from '@ustack/internals'
import chalk from 'chalk'

export class CLI implements Command {
  static new(cmds: Commands, ensureBinaries: string[]): CLI {
    return new CLI(cmds, ensureBinaries)
  }

  private constructor(
    private readonly cmds: Commands,
    private readonly ensureBinaries: string[],
  ) {}

  async parse(argv: string[]): Promise<string | Error> {
    const args = arg(argv, {
      '--help': Boolean,
      '-h': '--help',
      '--version': Boolean,
      '-v': '--version',
    })

    if (isError(args)) {
      return this.help(args.message)
    }

    if (args['--version']) {
      // await ensureBinariesExist()
      // return Version.new().parse(argv)
    }

    // check if we have that subcommand
    const cmdName = args._[0]

    const cmd = this.cmds[cmdName]
    if (cmd) {
      // if we have that subcommand, let's ensure that the binary is there in case the command needs it
      // if (this.ensureBinaries.includes(cmdName)) {
      //   await ensureBinariesExist()
      // }

      let argsForCmd: string[]
      if (args['--help']) {
        argsForCmd = [...args._.slice(1), '--help']
      } else {
        argsForCmd = args._.slice(1)
      }

      return cmd.parse(argsForCmd)
    }

    // display help for help flag or no subcommand
    if (args._.length === 0 || args['--help']) {
      return this.help()
    }

    // unknown command
    return unknownCommand(this.help() as string, args._[0])
  }

  public help(error?: string) {
    if (error) {
      return new HelpError(`\n${chalk.bold.red(`!`)} ${error}\n${CLI.help}`)
    }
    return CLI.help
  }

  private static help = format(`
    ${
      process.platform === 'win32' ? '' : '🚀  '
    }Ultimate Stack is a stack toolkit to quickly prototype, develop and release your applications

    ${chalk.bold('Usage')}

      ${chalk.dim('$')} ustack [command]

    ${chalk.bold('Commands')}

                init   Set up uStack for your app
  `)
}
