#!/usr/bin/env node
import { resolve, join } from 'path'
import { existsSync } from 'fs'
import arg from 'next/dist/compiled/arg/index.js'
import chalk from 'next/dist/compiled/chalk'
import exportApp, { ExportError, ExportOptions } from '../export'
import * as Log from '../build/output/log'
import { printAndExit } from '../server/lib/utils'
import { CliCommand } from '../lib/commands'
import { trace } from '../trace'
import isError from '../lib/is-error'
import { getProjectDir } from '../lib/get-project-dir'

const nextExport: CliCommand = (argv) => {
  const nextExportCliSpan = trace('next-export-cli')
  const validArgs: arg.Spec = {
    // Types
    '--help': Boolean,
    '--silent': Boolean,
    '--outdir': String,
    '--threads': Number,

    // Aliases
    '-h': '--help',
    '-o': '--outdir',
    '-s': '--silent',
  }
  let args: arg.Result<arg.Spec>
  try {
    args = arg(validArgs, { argv })
  } catch (error) {
    if (isError(error) && error.code === 'ARG_UNKNOWN_OPTION') {
      return printAndExit(error.message, 1)
    }
    throw error
  }
  if (args['--help']) {
    console.log(`
      Description
        [DEPRECATED] Exports a static version of the application for production deployment

      Usage
        $ next export [options] <dir>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
       --outdir, -o  Set the output dir (defaults to 'out')
       --silent, -s  Do not print any messages to console
       --threads     Max number of threads to use
       --help, -h    List this help

      The "next export" command is deprecated in favor of "output: export" in next.config.js
      Learn more: ${chalk.cyan(
        'https://nextjs.org/docs/advanced-features/static-html-export'
      )}
    `)
    process.exit(0)
  }

  const dir = getProjectDir(args._[0])

  // Check if pages dir exists and warn if not
  if (!existsSync(dir)) {
    printAndExit(`> No such directory exists as the project root: ${dir}`)
  }

  const options: ExportOptions = {
    silent: args['--silent'] || false,
    threads: args['--threads'],
    outdir: args['--outdir'] ? resolve(args['--outdir']) : join(dir, 'out'),
    hasOutdirFromCli: Boolean(args['--outdir']),
    isInvokedFromCli: true,
    hasAppDir: false,
    buildExport: false,
  }

  exportApp(dir, options, nextExportCliSpan)
    .then(() => {
      nextExportCliSpan.stop()
      printAndExit(`Export successful. Files written to ${options.outdir}`, 0)
    })
    .catch((err: any) => {
      nextExportCliSpan.stop()
      if (err instanceof ExportError || err.code === 'NEXT_EXPORT_ERROR') {
        Log.error(err.message)
      } else {
        console.error(err)
      }
      process.exit(1)
    })
}

export { nextExport }
