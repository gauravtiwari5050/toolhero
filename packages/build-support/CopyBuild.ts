import chokidar from "chokidar"
import path from "path"

import { readdir, readFile, writeFile } from "fs"
import { promisify } from "util"
const readDirectory = promisify(readdir)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile);
const assetsRoot = path.resolve(__dirname, "../../apps/frontend/dist/assets/");
const outputFile = path.resolve(__dirname, "../toolhero/src/assets/assets.ts");
const buildHtmlPage = async () => {
    const files = await readDirectory(assetsRoot);
    const javascriptFile = files.find(file => file.endsWith(".js"))
    const cssFile = files.find(file => file.endsWith(".css"));
    const javascript = await readFileAsync(`${assetsRoot}/${javascriptFile}`);
    const css = await readFileAsync(`${assetsRoot}/${cssFile}`);
    const tsFile = `
        export const assets = {
            javascript: "${Buffer.from(javascript).toString("base64")}",
            css: "${Buffer.from(css).toString("base64")}"
        }
    `
    await writeFileAsync(outputFile, tsFile)
    console.log("Written")

}
(async () => {
    console.log("Will copy build");
    const watcher = chokidar.watch(assetsRoot, { persistent: true, awaitWriteFinish: true })
    watcher
        .on('add', function (path) { buildHtmlPage() })
        .on('change', function (path) { buildHtmlPage() })
        .on('unlink', function (path) { console.log('File', path, 'has been removed'); })
        .on('error', function (error) { console.error('Error happened', error); })
})()