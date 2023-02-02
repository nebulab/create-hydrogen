import chalk from 'chalk'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import inquirer from 'inquirer'

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const storeInFile = (data, path) => {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(`Failed to write in the file ${path}`, err)
    process.exit(-1)
  }
}

export const getProjectName = async () => {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Name your new Hydrogen storefront:',
      default: 'hydrogen-template',
    },
  ])

  if (!projectName) {
    console.error(`\n${chalk.bold.red('ERROR:')} Empty project name`)
    process.exit(1)
  }

  return projectName
}

export const initHydrogen = (useNpm, projectName) => {
  if (useNpm === undefined || !projectName) {
    console.error(
      `\n${chalk.bold.red(
        'ERROR:'
      )} Missing variables "useNpm" or "projectName" inside "initHydrogen" function`
    )
    process.exit(1)
  }

  console.log(`\nInitializing Hydrogen with ${useNpm ? 'npm' : 'yarn'}...`)
  console.log(
    "Use the flag '--npm' if you want to install everything with NPM\n"
  )

  const args = `--template demo-store --name ${projectName} --ts`

  runCommand(
    useNpm
      ? `npm init @shopify/hydrogen -- ${args}`
      : `yarn create @shopify/hydrogen ${args}`
  )
}

export const editPackageJson = (projectPath, templatesPath) => {
  const obj = JSON.parse(readFileSync(`${projectPath}/package.json`))
  obj.scripts['test:ci:no-client'] =
    'yarn build --no-client -t node && vitest run'
  obj.scripts.prepare = 'npx husky install && chmod ug+x .husky/*'
  storeInFile(obj, `${templatesPath}/package.json`)
}
