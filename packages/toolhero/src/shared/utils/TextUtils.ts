import { JSDOM } from "jsdom";
import { serializeError, ErrorObject } from "serialize-error";

export class TextUtils {
  public static validateEmailAddress(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public static createRandomNumericString(numberDigits: number): string {
    const chars = "0123456789";
    let value = "";

    for (let i = numberDigits; i > 0; --i) {
      value += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    return value;
  }

  public static serializeError(error: Error): ErrorObject {
    return serializeError(error);
  }
  public static serializeErrorAsString(error: Error): string {
    return JSON.stringify(serializeError(error));
  }
}
