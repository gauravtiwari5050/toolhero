import { NextApiResponse } from 'next';
import path from "path";
/**
 * Minimal wrapper around NextResponse
 */
export class HeroResponse {
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
    this.setHeader('Content-Type', 'text/html;charset=utf-8')
    this.send(html);
  }

  internalRedirect(destination: string) {
    const proto =
      this.nextResponse.req.headers["x-forwarded-proto"]
        ? "https"
        : "http";
    const baseUrl = `${proto}://${this.nextResponse.req.headers.host}`;
    const url = new URL(`${baseUrl}${this.nextResponse.req.url || ""}`)
    const redirectUrl = `${url.pathname}?r=${destination}`;
    this.status(302);
    this.nextResponse.redirect(redirectUrl);
  }
}
