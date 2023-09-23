import { Request as ExpressRequest } from 'express';
import { IHeroRequest } from './IHeroRequest';

export class ExpressHeroRequest implements IHeroRequest {
  private rawRequest: ExpressRequest;
  private _heroParams: Record<string, unknown>;
  constructor(request: ExpressRequest) {
    this.rawRequest = request;
    this._heroParams = {};
  }
  heroParams(): Record<string, unknown> {
    return this._heroParams;
  }
  setHeroParams(params: Record<string, unknown>): void {
    this._heroParams = params;
  }
  params(): Record<string, unknown> {
    // @ts-ignore
    return this.rawRequest.params;
  }
  query(): Record<string, unknown> {
    // @ts-ignore
    return this.rawRequest.query;
  }
  cookies(): Record<string, string> {
    // @ts-ignore
    return this.rawRequest.cookies;
  }
  url(): string {
    // @ts-ignore
    return this.rawRequest.url;
  }
  method(): string {
    // @ts-ignore
    return this.rawRequest.method;
  }
  body(): unknown {
    // @ts-ignore
    return this.rawRequest.body;
  }
}
