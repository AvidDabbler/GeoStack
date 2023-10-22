import {
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { readdirSync } from 'fs'
import https from "https";
import admZip from "adm-zip";

export const makeDir = (dir: string) => {
  // Check for dbDir and delete it if it exists
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }

  // make db dir
  mkdirSync(dir);
};

export async function downloadFile(url: string, targetFile: string) {
  return await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const code = response.statusCode ?? 0;

        if (code >= 400) {
          return reject(new Error(response.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return resolve(downloadFile(response.headers.location, targetFile));
        }

        // save the file to disk
        const fileWriter = createWriteStream(targetFile).on("finish", () => {
          resolve({});
        });

        response.pipe(fileWriter);
      })
      .on("error", (error: unknown) => {
        reject(error);
      });
  });
}
export const extractZip = (zipFile: string, outputDir: string) => {
  var zip = new admZip(zipFile);
  console.log("start unzip");
  zip.extractAllTo(outputDir);
  console.log("finished unzip");
};

export const listDir = (outDir: string) => {
  return readdirSync(outDir)
};
