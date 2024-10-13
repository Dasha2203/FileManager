import path from 'path';
import os from 'os';

export function getFullPath(pathToFile, currentPath) {
  return path.join(pathToFile.startsWith(os.homedir()) ? '' : currentPath, pathToFile);
}