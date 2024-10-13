import os from 'os';
import { readdir, writeFile, rename, rm, copyFile as copy } from 'fs/promises';
import { createReadStream } from 'fs';
import { createInterface } from 'node:readline/promises';
import { setColor } from './colors/index.js';
import { getFullPath } from './libs/getFullPath.js';
import { isExist } from './libs/isExist.js';

import {
  stdin as input,
  stdout as output,
} from 'node:process';

import path from 'path';
import { STATUS } from './const.js';
import { calculateHash } from './hash/index.js';
import { getInfo } from './os/index.js';

let currentPath = os.homedir()
console.log(greeting())

const commands = {
  'ls': showList,
  'add': addFile,
  'rn': renameFile,
  'rm': removeFile,
  'cp': copyFile,
  'mv': moveFile,
  os: getInfo,
  hash: async (pathFile) => await calculateHash(getFullPath(pathFile, currentPath)),
  cat: readFile,
  cd,
  up
}

const rl = createInterface({ input, output });

while (true) {
  const input = await rl.question(setColor(`\nYou are currently in ${currentPath} > \n`, 'blue'));
  const [command, ...params] = input.split(' ');

  if (command === '.exit') {
    goodBuy();
    process.exit();
  }

  if (commands[command]) {
    await commands[command](...params);
  }


  // if (command === 'hash') {
  //   console.log('here')
  //   await calculateHash(getFullPath(command[1]))
  // }

  // if (command === 'up') {
  //   commands['up']()
  // }
  // if (command === 'cd') {
  //   commands['cd'](...params)
  // }
  // if (command === 'ls') {
  //   await showList()
  // }

  // if (command === 'os') {
  //   getInfo(command[1])
  // }

  // if (command in zipCommands) {
  //   zipCommands[command](getFullPath(command[1]), getFullPath(command[2]))
  // }

  // if (!commands[command]) {
  //   console.log('\nТакой команды нет\n')
  // }

  // if (command === 'add') {
  //   commands[command](...params)
  // }
  // if (command === 'cat') {
  //   commands[command](command[1])
  // }

  // if (command === 'rn') {
  //   commands[command](command[1], command[2])
  // }
  // if (command === 'rm') {
  //   commands[command[0]](command[1])
  // }
  // if (command === 'cp') {
  //   commands[command](command[1], command[2])
  // }
  // if (command === 'mv') {
  //   commands[command](command[1], command[2])
  // }
}

// process.stdin.on('data', async (chunk) => {
//   const data = chunk.toString().trim();
//   const command = data.split(' ')

//   if (data === '.exit') {
//     goodBuy();
//     process.exit();
//   }

//   if (command[0] === 'hash') {
//     console.log('here')
//     await calculateHash(getFullPath(command[1]))
//   }

//   if (command[0] === 'up') {
//     commands['up']()
//   }
//   if (command[0] === 'cd') {
//     commands['cd'](command[1])
//   }
//   if (data === 'ls') {
//     await showList()
//   }

//   if (command[0] === 'os') {
//     getInfo(command[1])
//   }

//   if (command[0] in zipCommands) {
//     zipCommands[command[0]](getFullPath(command[1]), getFullPath(command[2]))
//   }

//   if (!commands[command[0]]) {
//     console.log('\nТакой команды нет\n')
//   }

//   if (command[0] === 'add') {
//     commands[command[0]](command[1])
//   }
//   if (command[0] === 'cat') {
//     commands[command[0]](command[1])
//   }

//   if (command[0] === 'rn') {
//     commands[command[0]](command[1], command[2])
//   }
//   if (command[0] === 'rm') {
//     commands[command[0]](command[1])
//   }
//   if (command[0] === 'cp') {
//     commands[command[0]](command[1], command[2])
//   }
//   if (command[0] === 'mv') {
//     commands[command[0]](command[1], command[2])
//   }



//   showPath()

// })

// process.on('SIGINT', () => {
//   goodBuy()
//   process.exit();
// });

function getName() {
  return process.argv[2].split('=')[1]
}

function greeting() {
  const name = getName();

  return setColor(`Welcome to the File Manager, ${name}!`, 'yellow');
}

async function showList() {
  try {
    const files = await readdir(currentPath, { withFileTypes: true });
    const sortedFiles = files.sort((a, b) => a.isFile() - b.isFile())
    const dirsList = []
    const filesList = []

    for (const file of sortedFiles) {
      if (!file.isFile()) {
        dirsList.push({
          name: file.name,
          type: 'directory',
        })
      } else {
        filesList.push({
          name: file.name,
          type: 'file',
        })
      }
    }
    console.table([...dirsList, ...filesList]);
  } catch (err) {
    console.log(err)
  }
}

function goodBuy() {
  const name = getName();

  console.log(`\nThank you for using File Manager, ${name}, goodbye!`);
}

async function addFile(name) {
  try {
    await writeFile(path.join(currentPath, name), '');
  } catch (err) {
    console.log(err);
  }
}

async function renameFile(pathFile, newName) {
  try {
    const name = pathFile.split('/').at(-1);
    const oldPath = path.join(pathFile.startsWith(os.homedir()) ? null : currentPath, pathFile);
    const newPath = path.join(pathFile.startsWith(os.homedir()) ? null : currentPath, pathFile.replace(name, ''), newName);
    const isExisting = await isExist(oldPath);

    if (isExisting) {
      await rename(oldPath, newPath);
    }
  } catch (err) {
    showDefaultError();
  }
}

async function readFile(pathFile) {
  return new Promise(async (resolve, reject) => {
    const fullPath = getFullPath(pathFile, currentPath);
    const isExisting = await isExist(fullPath);

    if (isExisting) {
      const readStream = createReadStream(fullPath, { encoding: 'utf8' });
      readStream.on('data', (chunk) => {
        console.log(chunk.toString());
      })

      readStream.on('end', () => {
        resolve();
      });
    } else {
      resolve();
    }
  })
}

async function removeFile(pathFile) {
  try {
    const fullPath = getFullPath(pathFile, currentPath);
    const isExisting = await isExist(fullPath);

    if (isExisting) {
      await rm(fullPath);
    }
  } catch (err) {
    console.log(err)
  }
}

async function copyFile(pathToFile, pathToDirectory) {
  try {
    const name = pathToFile.split('/').at(-1);
    const fullPath = getFullPath(pathToFile, currentPath);
    const fullDirectoryPath = getFullPath(pathToDirectory, currentPath);
    const isExisting = await isExist(fullPath) && await isExist(fullDirectoryPath);

    if (isExisting) {
      await copy(fullPath, path.join(fullDirectoryPath, name));
      console.log(setColor(STATUS.SUCCESS, 'green'));
    }
  } catch (err) {
    console.log(err)
  }
}

async function moveFile(pathToFile, pathToDirectory) {
  try {
    await copyFile(pathToFile, pathToDirectory);
    await removeFile(pathToFile);
  } catch (err) {
    console.log(err);
  }
}

async function cd(path) {
  const fullPath = getFullPath(path, currentPath);
  const isExisting = await isExist(fullPath);

  if (isExisting) {
    currentPath = fullPath;
  }
}

function up() {
  currentPath = currentPath !== os.homedir() ? currentPath.split('/').slice(0, -1).join('/') : currentPath
}

function showDefaultError() {
  console.log(setColor(STATUS.ERROR, 'red'))
}


