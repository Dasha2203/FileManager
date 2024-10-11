import os from 'os'
import { readdir, stat } from 'fs/promises'
import path from 'path';

let currentPath = os.homedir()
console.log(greeting())

showPath()

process.stdin.on('data', (chunk) => {
  const data = chunk.toString().trim();

  if (data === '.exit') {
    goodBuy();
    process.exit();
  }

  if (data === 'ls') {
    showList()
  }
})

process.on('SIGINT', () => {
  goodBuy()
  process.exit();
});

function getName() {
  return process.argv[2].split('=')[1]
}

function greeting() {
  const name = getName();

  return `Welcome to the File Manager, ${name}!`;
}

function showPath() {
  console.log(`\nYou are currently in ${currentPath} >`)
}

function showCurrentDir() {
  console.log()
}

async function showList() {
  try {
    const files = await readdir(currentPath);
    const dirsList = []
    const filesList = []
    let maxLength = 0

    for (const file of files) {
      const lengthName = file.length;
      const fullPath = path.join(currentPath, file);
      const stats = await stat(fullPath);

      if (lengthName > maxLength) maxLength = lengthName;

      if (stats.isDirectory()) {
        dirsList.push({
          name: file,
          type: 'directory',
          lengthName
        })
      } else {
        filesList.push({
          name: file,
          type: 'file',
          lengthName
        })
      }
    }

    showHeader(maxLength)

    dirsList.forEach((dir, idx) => {

      let left = 0
      let right = 0
  
      // if (idx === 1 && maxLength > dir.length) {
        left = Math.floor((maxLength - dir.name.length) / 2)
        right = Math.ceil((maxLength - dir.name.length )/ 2)
      // }

      showRow(idx, dir.name, dir.type, maxLength)
      showTemplate(left + right + dir.name.length + 8)
    })
    filesList.forEach((dir, idx) => {

      let left = 0
      let right = 0
  
      // if (idx === 1 && maxLength > dir.length) {
        left = Math.floor((maxLength - dir.name.length) / 2)
        right = Math.ceil((maxLength - dir.name.length) / 2)
      // }

      showRow(idx, dir.name, dir.type, maxLength)
      showTemplate(left + right + dir.name.length + 8)
    })
  } catch (err) {
    console.log(err)
  }
}

function showHeader(max) {
  const headers = ['index', 'Name', 'Type']

  let str = ``
  let leftMax = 0
  let rightMax = 0

  headers.forEach((item, idx) => {
    let left = 0
    let right = 0

    if (idx === 1 && max > item.length) {
      left = Math.floor((max - item.length) / 2)
      right = Math.ceil((max - item.length) / 2)
    }
    str += '| ' + (left ? ' '.repeat(left) : '') + item + (right ? ' '.repeat(right) : '') + ' '

    if (idx === headers.length - 1) {
      str += '     |'
    }

    if (left > leftMax) leftMax = left
    if (right > rightMax) rightMax = right
  })
  showTemplate(leftMax + rightMax + headers[1].length + 8)
  console.log(str)
  showTemplate(leftMax + rightMax + headers[1].length + 8)
  // console.log(`| ${headers[0]} | ${headers[1]} | ${headers[2]} |`)
}

function showTemplate(num) {
  console.log(`+--------${'-'.repeat(num)}------+`)
}

function showRow(idx, name, type, max) {
  console.log(`|  ${idx}    | ${name}${' '.repeat(max-name.length)}| ${type}  |`)
}

function goodBuy() {
  const name = getName();

  console.log(`\nThank you for using File Manager, ${name}, goodbye!`);
}

