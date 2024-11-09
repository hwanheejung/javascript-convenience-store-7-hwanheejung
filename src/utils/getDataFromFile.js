import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const getDataFromFile = (pathName) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, pathName);

  return fs
    .readFileSync(filePath, 'utf-8')
    .toString()
    .trim()
    .split('\n')
    .slice(1);
};

export default getDataFromFile;
