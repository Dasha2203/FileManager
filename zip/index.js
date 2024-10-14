import zlib from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { STATUS } from '../const.js';
import { setColor } from '../colors/index.js';

const gzip = zlib.createGzip();
const unzip = zlib.createUnzip();

export async function compress(pathToFile, pathToDestination) {
  if (!pathToFile || !pathToDestination) {
    console.log(setColor(STATUS.INVALID, 'red'));
    return;
  }
  const writeStream = createWriteStream(pathToDestination);
  const readStream = createReadStream(pathToFile);

  readStream.pipe(gzip).pipe(writeStream);
}

export async function decompress(pathToFile, pathToDestination) {
  try {
    if (!pathToFile || !pathToDestination) {
      console.log(setColor(STATUS.INVALID, 'red'));
      return;
    }
    
    const writeStream = createWriteStream(pathToDestination);
    const readStream = createReadStream(pathToFile);

    readStream.pipe(unzip).pipe(writeStream)
  } catch {
    console.log(STATUS.FAILED)
  }
}