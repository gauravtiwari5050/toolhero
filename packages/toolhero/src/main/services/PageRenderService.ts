import { assets } from '../../assets/assets';

export class PageRenderService {
  private page: string;
  private windowVars: Record<string, any>;
  constructor({
    page,
    windowVars,
  }: {
    page: string;
    windowVars: Record<string, any>;
  }) {
    this.page = page;
    this.windowVars = windowVars;
  }
  public async render(): Promise<string> {
    let windowScript = `\nwindow.APP = "${this.page}";`;
    for (const variable in this.windowVars) {
      windowScript += `\nwindow.${variable}=${JSON.stringify(
        this.windowVars[variable]
      )};\n`;
    }
    const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Vite + React + TS</title>
                <style>${Buffer.from(
                  // @ts-ignore
                  assets.main.css,
                  'base64'
                ).toString()}</style>
            </head>
            <body>
                <div id="root"></div>
                <script>${windowScript}</script>
                <script>${Buffer.from(
                  // @ts-ignore
                  assets.main.javascript,
                  'base64'
                ).toString()}</script>
            </body>
            </html>
            `;
    return html;
  }
}
