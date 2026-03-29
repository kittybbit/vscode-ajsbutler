/* eslint-disable @typescript-eslint/no-unused-vars */
import * as path from "path";
import Mocha from "mocha";
import { glob } from "glob";

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return glob("**/**.test.js", { cwd: testsRoot }).then((files) => {
    files.forEach((file) => mocha.addFile(path.resolve(testsRoot, file)));

    return new Promise((resolve, reject) => {
      try {
        mocha.run((failures) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
}
