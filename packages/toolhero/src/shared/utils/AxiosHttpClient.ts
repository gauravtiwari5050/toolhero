import axios from "axios";
import { Result } from "../core/Result";
import { ErrorCodes } from "../domain/ErrorCodes";
import { IHttpClient } from "./IHttpClient";

export class AxiosHttpClient implements IHttpClient {
  baseURL: string;

  constructor(props: { baseURL?: string } = {}) {
    this.baseURL = props.baseURL;
  }

  public async Get<ResponseType>(
    url: string,
    headers?: any
  ): Promise<Result<ResponseType>> {
    try {
      const response = await axios.get(url, {
        headers,
        baseURL: this.baseURL,
      });
      if (response.status < 200 || response.status >= 400) {
        console.warn(
          `Received status code ${response.status} ${response.statusText}`,
          {
            response,
          }
        );
        return Result.fail<any>({
          code: ErrorCodes.HTTP_CLIENT_ERROR,
          message: `Received status code ${response.status} ${response.statusText}`,
        });
      }
      return Result.ok<any>(response.data);
    } catch (err: unknown) {
      console.error(err);
      return Result.fail<any>({
        code: ErrorCodes.HTTP_CLIENT_ERROR,
        message: (err as Error)?.message,
      });
    }
  }

  async Post<ResponseType>(
    url: string,
    body: any,
    headers?: any
  ): Promise<Result<ResponseType>> {
    try {
      const response = await axios.post(url, body, {
        headers,
        baseURL: this.baseURL,
      });
      if (response.status < 200 || response.status >= 400) {
        console.warn(
          `Received status code ${response.status} ${response.statusText}`,
          {
            response,
          }
        );
        return Result.fail<any>({
          code: ErrorCodes.HTTP_CLIENT_ERROR,
          message: `Received status code ${response.status} ${response.statusText}`,
        });
      }
      return Result.ok<any>(response.data);
    } catch (err) {
      console.error(err);
      return Result.fail<any>({
        code: ErrorCodes.HTTP_CLIENT_ERROR,
        message: (err as Error)?.message,
      });
    }
  }

  async Put<ResponseType>(
    url: string,
    body: any,
    headers?: any
  ): Promise<Result<ResponseType>> {
    try {
      const response = await axios.put(url, body, {
        headers,
        baseURL: this.baseURL,
      });
      if (response.status < 200 || response.status >= 400) {
        console.warn(
          `Received status code ${response.status} ${response.statusText}`,
          {
            response,
          }
        );
        return Result.fail<any>({
          code: ErrorCodes.HTTP_CLIENT_ERROR,
          message: `Received status code ${response.status} ${response.statusText}`,
        });
      }
      return Result.ok<any>(response.data);
    } catch (err) {
      console.error(err);
      return Result.fail<any>({
        code: ErrorCodes.HTTP_CLIENT_ERROR,
        message: (err as Error)?.message,
      });
    }
  }
}
