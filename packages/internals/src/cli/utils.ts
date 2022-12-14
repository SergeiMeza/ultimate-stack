import Arg from 'arg'
import dedent from 'strip-indent'

/** Format */
export function format(input = ''): string {
  return dedent(input).trimEnd() + '\n'
}

// https://github.com/vercel/arg#readme
/** Wrap arg to return an error instead of throwing */
export function arg<T extends Arg.Spec>(
  argv: string[],
  spec: T,
  stopAtPositional = false,
  permissive = false,
): Arg.Result<T> | Error {
  try {
    return Arg(spec, { argv, stopAtPositional, permissive })
  } catch (e: any) {
    return e
  }
}

/** Check if result is an error */
export function isError(result: any): result is Error {
  return result instanceof Error
}
