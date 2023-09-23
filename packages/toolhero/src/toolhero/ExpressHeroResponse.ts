import { Response as ExpressResponse } from 'express';
import { IHeroResponse } from './IHeroResponse';
export class ExpressHeroResponse extends IHeroResponse {
  private rawResponse: ExpressResponse;
  private terminated: boolean;
  constructor(expressResponse: ExpressResponse) {
    super();
    this.rawResponse = expressResponse;
    this.terminated = false;
  }
  setTerminated(terminated: boolean): void {
    this.terminated = terminated;
  }
  isTerminated(): boolean {
    return this.terminated;
  }
  send(obj: any): void {
    // @ts-ignore
    this.rawResponse.send(obj);
  }
  json(obj: any): void {
    // @ts-ignore
    this.rawResponse.status(200);
    this.send(obj);
  }
  getHost(): string {
    // @ts-ignore
    return this.rawResponse.req.hostname;
  }
  getUrl(): string {
    // @ts-ignore
    return this.rawResponse.req.originalUrl;
  }
  getHeader(name: string): string | string[] | undefined {
    // @ts-ignore
    return this.rawResponse.req.headers[name];
  }
  setHeader(name: string, value: string | number | string[]): void {
    // @ts-ignore
    this.rawResponse.setHeader(name, value);
  }
  status(code: number): void {
    // @ts-ignore
    this.rawResponse.status(code);
  }
  redirect(url: string): void {
    // @ts-ignore
    this.rawResponse.redirect(url, 302);
  }
}

/*export class HeroResponse {
  private nextResponse: NextApiResponse;
  private isTerminated: boolean;
  constructor(res: NextApiResponse) {
    this.nextResponse = res;
    this.isTerminated = false;
  }

  get terminated(): boolean {
    return this.isTerminated;
  }
  get rawResponse(): NextApiResponse {
    return this.nextResponse;
  }

  type(_type: string): HeroResponse {
    return this;
  }
  send(obj: any) {
    this.isTerminated = true;
    this.nextResponse.send(obj);
  }
  json(obj: any) {
    this.isTerminated = true;
    this.send(obj);
  }
  setHeader(name: string, value: string | number | string[]) {
    this.nextResponse.setHeader(name, value);
  }

  sendStatus(code: number) {
    this.isTerminated = true;
    this.status(code);
    this.send(null);
  }
  status(code: number): HeroResponse {
    this.isTerminated = true;
    this.nextResponse.status(code);
    return this;
  }
  error(error: any) {
    // REFACTOR
    this.isTerminated = true;
    this.nextResponse.status(error.status || 500);
    this.nextResponse.send(error);
  }

  okHtml(html: string) {
    this.isTerminated = true;
    this.status(200);
    this.setHeader('Content-Type', 'text/html;charset=utf-8');
    this.send(html);
  }
}*/
