import { assets } from "../../assets/assets";
import { HeroTool } from "../valueObjects/HeroTool";

export class ToolRenderService {
    private tool: HeroTool;
    constructor(tool: HeroTool) {
        this.tool = tool;
    }
    public async render(): Promise<string> {
        const toolSerialized = await this.tool.serialise();
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Vite + React + TS</title>
                <style>${Buffer.from(assets.css, "base64").toString()}</style>
            </head>
            <body>
                <div id="root"></div>
                <script>window.TOOL=${JSON.stringify(toolSerialized)}</script>
                <script>${Buffer.from(assets.javascript, "base64").toString()}</script>
            </body>
            </html>
            `
        return html
    }
}