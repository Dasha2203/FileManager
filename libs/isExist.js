import { access } from 'fs/promises';
import { setColor } from '../colors/index.js';
import { STATUS } from '../const.js';

export async function isExist(path) {
  try {
    await access(path);

    return true;
  } catch (err) {
    console.log(setColor(STATUS.ERROR_PATH, 'red'));
    return false;
  }
}