import { NextApiRequest } from "next";

/**
 * Minimal wrapper around NextRequest
 * This enables to parse the routes and load routeParams similar to express routes
 * @class
 * @param {VercelRequest} nextRequest
 */
export class HeroRequest {
  private nextRequest: NextApiRequest;
  private routeParams: any;
  constructor(nextRequest: NextApiRequest) {
    this.nextRequest = nextRequest;
  }

  get rawRequest(): NextApiRequest {
    return this.nextRequest;
  }
  get params(): any {
    return this.routeParams;
  }
  set params(params: any) {
    this.routeParams = params;
  }
  get cookies() {
    return this.nextRequest.cookies;
  }
  get query() {
    return this.nextRequest.query;
  }
  get body() {
    return this.nextRequest.body;
  }
  get url(): string {
    return this.nextRequest.url as string;
  }
  get method(): string {
    return this.nextRequest.method as string;
  }
}
