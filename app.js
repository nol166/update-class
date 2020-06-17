const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
let { fullstackOnline, classRepo } = require('./classRepo')
const { dirname } = require('path')

let folder = []

// helper functions to add some color
const bold = (str) => {
    return '\033[1m' + str + '\033[0m'
}

const green = (str) => {
    return '\x1b[36m' + str + '\x1b[0m'
}

const red = (str) => {
    return '\x1b[31m' + str + `\x1b[0m`
}

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
    items.forEach((item) => {
        folder.push(item)
    })

    // prompt the user for what folder they want to copy
    // TODO: add ability to copy over solutions
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'folder',
                message: 'What folder do you want to copy?',
                choices: folder,
            },
            // {
            //     type: 'confirm',
            //     name: 'size',
            //     message: 'Do you want to exclude the solutions?',
            // },
        ])
        .then((answers) => {
            console.log(JSON.stringify(answers, null, '  '))
            console.log(answers)
            let chosenDir = `${fullstackOnline}/${answers.folder}`
            copyFolderRecursiveSync(chosenDir, classRepo)
        })
})

const copyFileSync = (source, target) => {
    var targetFile = target

    //if target isDir a new file with the same name will be made
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source))
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source))
}

const copyFolderRecursiveSync = (source, target) => {
    var files = []

    // check if folder needs to be created
    var targetFolder = path.join(target, path.basename(source))
    let isModuleProject = targetFolder.includes('Module-Project')
    let isSolved = targetFolder.includes('Solved')
    let isMaster = targetFolder.includes('Master')
    if (isSolved || isModuleProject || isMaster) {
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
            var curSource = path.join(source, file)
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder)
                // console.log(curSource, targetFolder)
            } else {
                console.info(green('Copied ') + `${curSource}`)
                copyFileSync(curSource, targetFolder)
            }
        })
    }
}
