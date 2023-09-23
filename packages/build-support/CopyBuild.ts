import chokidar from "chokidar";
import path from "path";

import { readdir, readFile, writeFile } from "fs";
import { promisify } from "util";
const readDirectory = promisify(readdir);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const assetsRoot = path.resolve(__dirname, "../../apps/frontend/dist/assets/");
const outputFile = path.resolve(__dirname, "../toolhero/src/assets/assets.ts");
const buildHtmlPages = async () => {
  const pages = ["tool", "login"];
  const assets: any = {};
  for (const page of pages) {
    assets[page] = await buildHtmlPage(page);
  }
  const tsFile = `
        export const assets = ${JSON.stringify(assets)}
    `;
  await writeFileAsync(outputFile, tsFile);
  console.log("Written");
};
const buildHtmlPage = async (page: string) => {
  const files = await readDirectory(assetsRoot);
  const javascriptFile = files.find(
    (file) => file.startsWith(page) && file.endsWith(".js")
  );
  const cssFile = files.find(
    (file) => file.startsWith(page) && file.endsWith(".css")
  );
  const javascript = Buffer.from(
    await readFileAsync(`${assetsRoot}/${javascriptFile}`)
  ).toString("base64");
  const css = Buffer.from(
    await readFileAsync(`${assetsRoot}/${cssFile}`)
  ).toString("base64");
  return {
    javascript,
    css,
  };
};
(async () => {
  console.log("Will copy build");
  const watcher = chokidar.watch(assetsRoot, {
    persistent: true,
    awaitWriteFinish: true,
  });
  watcher
    .on("add", function (path) {
      buildHtmlPages();
    })
    .on("change", function (path) {
      buildHtmlPages();
    })
    .on("unlink", function (path) {
      console.log("File", path, "has been removed");
    })
    .on("error", function (error) {
      console.error("Error happened", error);
    });
})();
