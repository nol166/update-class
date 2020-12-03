const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
let { fullstackOnline, vanderbilt } = require('./classRepo')
let folder = []
let cohorts = [vanderbilt]
console.log("🚀 ~ file: app.js ~ line 7 ~ vanderbilt", vanderbilt)

// helper functions to add some color
const bold = str => '\033[1m' + str + '\033[0m'
const green = str => '\x1b[36m' + str + '\x1b[0m'
const red = str => '\x1b[31m' + str + `\x1b[0m`

// check for incorrrectly set up variables in classrepo.js
let hasClassContent = fullstackOnline.includes('01-Class-Content')
if (!hasClassContent) {
    console.warn(
        red(
            'Please make sure you add 01-Class-Content to the end of your fullstackOnline path'
        )
    )
    console.warn(red(`please update classrepo.js in ${__dirname}/classrepo.js`))
    process.exit('Issue with path')
}

// get a list of files for the folder
fs.readdir(fullstackOnline, (err, items) => {
    if (err) {
        console.log(err)
        process.exit(-1)
    }

    console.log(bold('Current items:'))
    items.forEach(item => {
        // check if folder starts with number (trilogy naming convention)
        let folderPattern = new RegExp('[0-9]')
        if (item.match(folderPattern)) {
            folder.push(item)
        }
    })
    // prompt the user for what folder they want to copy
    // TODO: add ability to copy over solutions
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'cohoart',
                message: 'What class do you want to manage?',
                choices: cohorts,
            },
            {
                type: 'list',
                name: 'folder',
                message: 'What folder do you want to copy?',
                choices: folder,
            },
        ])
        .then(answers => {
            console.log(JSON.stringify(answers, null, '  '))
            classRepo = answers.cohoart
            let chosenDir = `${fullstackOnline}/${answers.folder}`
            copyFolderRecursiveSync(chosenDir, classRepo)
        })
})

const copyFileSync = (source, target) => {
    let targetFile = target

    //if target isDir a new file with the same name will be made
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source))
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source))
}

const copyFolderRecursiveSync = (source, target) => {
    let files = []

    // check if folder needs to be created
    let targetFolder = path.join(target, path.basename(source))
    let isModuleProject = targetFolder.includes('Module-Project')
    let isSolved = targetFolder.includes('Solved')
    let isMain = targetFolder.includes('Main')
    if (isSolved || isModuleProject || isMain) {
        console.info(`${red('Not copying ')}${targetFolder}`)
        return
    }

    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder)
    }

    // copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source)
        files.forEach(function (file) {
            let curSource = path.join(source, file)
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder)
            } else {
                console.info(green('Copied ') + `${curSource}`)
                copyFileSync(curSource, targetFolder)
            }
        })
    }
}
