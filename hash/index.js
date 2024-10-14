import crypto from 'crypto';
import { createReadStream } from 'fs';
import { access } from 'fs/promises';

export const calculateHash = async (filePath) => {
    return new Promise(async (resolve, reject) => {
        if (typeof crypto !== 'undefined') {
            try {
                await access(filePath);
                let readableStream = createReadStream(filePath, 'utf8');
                readableStream.on('data', function (chunk) {
                    const hash = crypto.createHash('sha256');
                    hash.update(chunk);
                    const digestHash = hash.digest('hex');
                    console.log(digestHash);
                });

                readableStream.on('end', () => {
                    resolve();
                });
            } catch {
                throw new Error('FS operation failed');
            }
        } else {
            console.log('Pocket is not sucess');
            resolve()
        }
    })

};