import fs from 'fs';
import path from 'path';
import dirname from '../config/dirname.cjs';

const getDataFromFile = (pathName) => {
  const { __dirname } = dirname;
  const filePath = path.resolve(__dirname, pathName);

  return fs
    .readFileSync(filePath, 'utf-8')
    .toString()
    .trim()
    .split('\n')
    .slice(1);
};

export default getDataFromFile;
