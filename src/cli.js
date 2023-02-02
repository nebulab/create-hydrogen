import chalk from 'chalk'
import fs from 'fs'
import Listr from 'listr'
import ncp from 'ncp'
import path from 'path'
import { promisify } from 'util'
import { getProjectName, editPackageJson, initHydrogen } from './utils'

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
      task: async () => initHydrogen(useNpm, projectName),
    },
    {
      title: 'Edit package.json',
      task: () => editPackageJson(projectPath, templatesPath),
    },
    {
      title: 'Copy template files',
      task: async () => await copy(templatesPath, projectPath),
    },
  ])

  await tasks.run()
  console.log(`\n${chalk.green.bold('DONE')} Project ready`)
  return true
}
