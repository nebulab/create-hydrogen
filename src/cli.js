import chalk from 'chalk'
import fs from 'fs'
import Listr from 'listr'
import ncp from 'ncp'
import path from 'path'
import { promisify } from 'util'
import {
  getProjectName,
  editPackageJson,
  editHydrogenConfig,
  initHydrogen,
} from './utils'

const access = promisify(fs.access)
const copy = promisify(ncp)

export async function cli(args) {
  const useNpm = args.includes('--npm')
  const projectName = await getProjectName()
  const projectPath = `${process.cwd()}/${projectName}`
  const cliPath = new URL(import.meta.url).pathname
  const templatesPath = path.resolve(
    cliPath.substring(cliPath.indexOf('/')),
    '../../templates'
  )

  try {
    await access(templatesPath, fs.constants.R_OK)
  } catch (err) {
    console.error(`${chalk.red.bold('ERROR')} Invalid template name`)
    process.exit(1)
  }

  const tasks = new Listr([
    {
      title: 'Initialize Hydrogen',
      task: () => initHydrogen(useNpm, projectName),
    },
    {
      title: 'Edit hydrogen config file',
      task: () => editHydrogenConfig(projectPath),
    },
    {
      title: 'Edit package.json',
      task: () => editPackageJson(projectPath),
    },
    {
      title: 'Copy template files',
      task: () => copy(templatesPath, projectPath),
    },
  ])

  await tasks.run()
  console.log(`\n${chalk.green.bold('DONE')} Project ready`)
  return true
}
