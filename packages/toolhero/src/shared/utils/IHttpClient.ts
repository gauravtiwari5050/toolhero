import { Result } from "../core/Result";

export interface IHttpClient {
  Get<ResponseType>(url: string, headers?: any): Promise<Result<ResponseType>>;
  Post<ResponseType>(
    url: string,
    body: any,
    headers?: any
  ): Promise<Result<ResponseType>>;
  Put<ResponseType>(
    url: string,
    body: any,
    headers?: any
  ): Promise<Result<ResponseType>>;
}
