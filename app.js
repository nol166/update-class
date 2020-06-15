const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
let { fullstackOnline, classRepo } = require('./classRepo')

// get the list folder from the arguement specified
let fullStackFolder = __dirname || process.argv[2]
let folderToMove = process.argv[3]

let folder = []

const bold = (str) => {
    return '\033[1m' + str + '\033[0m'
}

const green = (str) => {
    return '\x1b[36m' + str + '\x1b[0m'
}

const red = (str) => {
    return '\x1b[31m' + str + `\x1b[0m`
}

const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = Path.join(path, file)
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath)
            } else {
                // delete file
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
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
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'folder',
                message: 'What folder do you want to copy?',
                choices: folder,
            },
            {
                type: 'confirm',
                name: 'size',
                message: 'Do you want to exclude the solutions?',
            },
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

    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source))
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source))
}

const copyFolderRecursiveSync = (source, target) => {
    var files = []

    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source))
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder)
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source)
        files.forEach(function (file) {
            var curSource = path.join(source, file)
            // console.log(!fs.lstatSync(curSource).toString().includes('Solved'))
            if (fs.lstatSync(curSource).isDirectory()) {
                // copyFolderRecursiveSync(curSource, targetFolder)
                console.log(curSource, targetFolder)
            } else {
                console.log(curSource, targetFolder, 'else')
            }
        })
    }
}
