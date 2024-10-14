import os from 'os';
import { readdir, writeFile, rename, rm, copyFile as copy } from 'fs/promises';
import { createReadStream } from 'fs';
import { createInterface } from 'node:readline/promises';
import { setColor } from './colors/index.js';
import { getFullPath } from './libs/getFullPath.js';
import { compress, decompress } from './zip/index.js';
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
  ls: showList,
  add: addFile,
  rn: renameFile,
  rm: removeFile,
  cp: copyFile,
  mv: moveFile,
  compress: handleCompress,
  decompress: handleDeCompress,
  os: getInfo,
  hash: async (pathFile) => {
    const fullPath = getFullPath(pathFile, currentPath);
    const isExisting = await isExist(fullPath);

    if (isExisting) {
      await calculateHash(getFullPath(pathFile, currentPath));
    }
  },
  cat: readFile,
  cd,
  up
}

const rl = createInterface({ input, output });

process.on('exit', () => {
  goodBuy();
})

while (true) {
  try {
    const input = await rl.question(setColor(`\nYou are currently in ${currentPath} > \n`, 'blue'));
    const [command, ...params] = input.split(' ');

    if (command === '.exit') {
      process.exit();
    }

    if (commands[command]) {
      await commands[command](...params);
    } else {
      console.log(setColor(STATUS.INVALID, 'red'));
    }
  } catch {
    showDefaultError()
  }
}

function getName() {
  return process.argv[2]?.split('=')[1] || 'Anonim';
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
    if (!name) {
      console.log(setColor(STATUS.INVALID, 'red'));
      return;
    }
    await writeFile(path.join(currentPath, name), '');
  } catch (err) {
    console.log(err);
  }
}

async function renameFile(pathFile, newName) {
  try {
    if (!pathFile || !newName) {
      console.log(setColor(STATUS.INVALID, 'red'));
      return;
    }
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
    if (!pathFile) {
      console.log(setColor(STATUS.INVALID, 'red'));
      return;
    }
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
    if (!pathFile) {
      console.log(setColor(STATUS.INVALID, 'red'));
      return;
    }
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
    if (!pathToFile || !pathToDirectory) {
      console.log(setColor(STATUS.INVALID, 'red'));
      return;
    }
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

async function handleCompress(pathToFile, pathDestination) {
  if (!pathToFile || !pathDestination) {
    console.log(setColor(STATUS.INVALID, 'red'));
    return;
  }
  const fullPath = getFullPath(pathToFile, currentPath);
  const isExisting = await isExist(fullPath);

  if (isExisting) {
    compress(pathToFile, pathDestination)
  }
}
async function handleDeCompress(pathToFile, pathDestination) {
  if (!pathToFile || !pathDestination) {
    console.log(setColor(STATUS.INVALID, 'red'));
    return;
  }
  const fullPath = getFullPath(pathToFile, currentPath);
  const isExisting = await isExist(fullPath);

  if (isExisting) {
    decompress(pathToFile, pathDestination)
  }
}

async function moveFile(pathToFile, pathToDirectory) {
  try {
    if (!pathToFile || !pathToDirectory) {
      console.log(setColor(STATUS.INVALID, 'red'));
      return;
    }
    await copyFile(pathToFile, pathToDirectory);
    await removeFile(pathToFile);
  } catch (err) {
    console.log(err);
  }
}

async function cd(path) {
  if (!path) {
    console.log(setColor(STATUS.INVALID, 'red'));
    return;
  }
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
  console.log(setColor(STATUS.FAILED, 'red'))
}


