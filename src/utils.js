import chalk from 'chalk'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import inquirer from 'inquirer'
import replace from 'replace-in-file'

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
  const args = `--template demo-store --name ${projectName}`

  runCommand(
    useNpm
      ? `npm init @shopify/hydrogen -- ${args}`
      : `yarn create @shopify/hydrogen ${args}`
  )
}

export const editPackageJson = (projectPath) => {
  const packageJsonPath = `${projectPath}/package.json`

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath))
    packageJson.scripts['test:ci:no-client'] =
      'yarn build --no-client -t node && vitest run'
    packageJson.scripts.prepare = 'npx husky install && chmod ug+x .husky/*'
    storeInFile(packageJson, packageJsonPath)
  } catch (error) {
    console.error(`\n${chalk.bold.red('ERROR:')} ${error}`)
    process.exit(1)
  }
}

export const editHydrogenConfig = async (projectPath) => {
  const files = readdirSync(projectPath)
  const configFileName = files.find((file) => file.includes('hydrogen.config'))
  const configFilePath = `${projectPath}/${configFileName}`

  try {
    await replace({
      files: configFilePath,
      from: /Oxygen\?\.env\?\./g,
      to: 'import.meta.env.',
    })
  } catch (error) {
    console.error(`\n${chalk.bold.red('ERROR:')} ${error}`)
    process.exit(1)
  }
}
