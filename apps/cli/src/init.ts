import { arg, Command, format, HelpError } from '@ustack/internals'
import chalk from 'chalk'
import { isError } from 'util'

type ConnectorType = any
export const defaultPort = (provider: ConnectorType) => {
  switch (provider) {
    case 'mysql':
      return 3306
    case 'postgresql':
      return 5432
  }
  return undefined
}

export const defaultURL = (
  provider: ConnectorType,
  port = defaultPort(provider),
  schema = 'public',
) => {
  switch (provider) {
    case 'mysql':
      return `mysql://root:prisma@localhost:${port}/mydb`
    case 'postgresql':
      return `postgresql://postgres:prisma@localhost:${port}/mydb?schema=${schema}`
    case 'sqlite':
      return `file:./dev.db`
  }
  return undefined
}

export const defaultGitIgnore = () => {
  return `node_modules
# Keep environment variables out of version control
.env
  `
}

export class Init implements Command {
  static new(): Init {
    return new Init()
  }

  private static help = format(`
  Set up a new uStack project

  ${chalk.bold('Usage')}

    ${chalk.dim('$')} ustack init [options]
    
  ${chalk.bold('Options')}

        -h, --help  Displays this help message

  ${chalk.bold('Examples')}

  ...
  `)

  // help message
  public help(error?: string): string | HelpError {
    if (error) {
      return new HelpError(`\n${chalk.bold.red('!')} ${error}\n${Init.help}`)
    }
    return Init.help
  }

  async parse(argv: string[]): Promise<any> {
    const args = arg(argv, {
      '--help': Boolean,
      '-h': '--help',
    })

    if (isError(args) || args['--help']) {
      return this.help()
    }
  }
}
