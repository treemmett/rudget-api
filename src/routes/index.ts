import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import util from 'util';

const readdir = util.promisify(fs.readdir);

export default async function(): Promise<Router> {
  // load files from current directory
  const preFiles = await readdir(__dirname);

  // remove all non js and index files
  const fileNames = preFiles.filter(f => f.endsWith('.js') && f !== 'index.js');

  // create router
  const router = Router();

  // import routes
  fileNames.forEach(async file => {
    const name = file.substr(0, file.length - 3);

    const { default: route } = await import(path.resolve(__dirname, file));

    router.use(`/${name}`, route);
  });

  return router;
}
