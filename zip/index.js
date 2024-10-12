import zlib from 'zlib';
import { createReadStream, createWriteStream } from 'fs';

const gzip = zlib.createGzip();
const unzip = zlib.createUnzip();
export const commands = {
  compress,
  decompress
};

async function compress(pathToFile, pathToDestination) {
  try {
    const writeStream = createWriteStream(pathToDestination);
    const readStream = createReadStream(pathToFile);

    readStream.pipe(gzip).pipe(writeStream);
  } catch (err) {
    console.log(err);
  }
}

async function decompress(pathToFile, pathToDestination) {
  try {
    const writeStream = createWriteStream(pathToDestination);
    const readStream = createReadStream(pathToFile);

    readStream.pipe(unzip).pipe(writeStream);
  } catch (err) {
    console.log(err);
  }
}