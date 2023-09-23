export abstract class IHeroResponse {
  abstract send(obj: any): void;
  abstract json(obj: any): void;
  abstract getHost(): string;
  abstract getUrl(): string;
  abstract getHeader(name: string): string | string[] | undefined;
  abstract setHeader(name: string, value: string | number | string[]): void;
  abstract status(code: number): void;
  abstract redirect(url: string): void;
  abstract isTerminated(): boolean;
  abstract setTerminated(terminated: boolean): void;
  internalRedirect(destination: string) {
    const proto = this.getHeader('x-forwarded-proto') ? 'https' : 'http';
    const baseUrl = `${proto}://${this.getHost()}`;
    const url = new URL(`${baseUrl}${this.getUrl() || ''}`);
    const redirectUrl = `${url.pathname}?r=${destination}`;
    this.status(302);
    this.redirect(redirectUrl);
  }
  okHtml(html: string) {
    // this.isTerminated = true;
    this.status(200);
    this.setHeader('Content-Type', 'text/html;charset=utf-8');
    this.send(html);
  }
  error(error: any) {
    // REFACTOR
    this.setTerminated(true);
    this.status(error.status || 500);
    this.send(error);
  }
}
