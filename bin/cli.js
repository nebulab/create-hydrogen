#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const crypto = require('crypto')

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (err) {
    console.error(err)
    process.exit(-1)
  }
}

const storeInFile = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(`Failed to write in the file ${path}`, err)
  }
}

const templateHash =
  'hydrogen-template-' + crypto.randomBytes(8).toString('hex')

runCommand(
  `git clone --depth 1 https://github.com/nebulab/create-hydrogen ${templateHash}`
)

const useNpm = process.argv.includes('--npm')
const initialFiles = fs.readdirSync(`./${templateHash}`)

// init hydrogen
console.log(`\nInitializing Hydrogen with ${useNpm ? 'npm' : 'yarn'}...`)
console.log("Use the flag '--npm' if you want to install everything with NPM")
runCommand(
  useNpm
    ? `cd ${templateHash} && npm init @shopify/hydrogen -- --template demo-store`
    : `cd ${templateHash} && yarn create @shopify/hydrogen --template demo-store`
)

const files = fs.readdirSync(`./${templateHash}`)
const hydrogenFolderName = files.find((file) => !initialFiles.includes(file))
const hydrogenFolderPath = `./${templateHash}/${hydrogenFolderName}`

// adding test scripts to package.json
const obj = JSON.parse(fs.readFileSync(`${hydrogenFolderPath}/package.json`))
obj.scripts['test:ci:no-client'] =
  'yarn build --no-client -t node && vitest run'
obj.scripts.prepare = 'npx husky install && chmod ug+x .husky/*'
storeInFile(obj, `${hydrogenFolderPath}/new-package.json`)
runCommand(`rm ${hydrogenFolderPath}/package.json`)
runCommand(
  `mv ${hydrogenFolderPath}/new-package.json ${hydrogenFolderPath}/package.json`
)

console.log(`\nMoving template files to the ${hydrogenFolderName} folder...`)
runCommand(
  `cd ${templateHash} && mv .github .husky .env.example README.md hydrogen.config.ts ${hydrogenFolderName}`
)

console.log('\nFinished creating the files. Cleaning up...')
runCommand(`mv ${hydrogenFolderPath} ./`)
runCommand(`rm -rf ./${templateHash}`)

console.log(
  `\nFinished! Now "cd ${hydrogenFolderName} && ${
    useNpm ? 'npm install' : 'yarn'
  }" to install all dependencies`
)
