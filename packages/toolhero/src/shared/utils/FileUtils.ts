import * as _ from "lodash";
import * as fs from "fs";
import * as Path from "path";
import * as process from "process";
import * as Util from "util";
import { Result } from "../core/Result";
import { TextUtils } from "./TextUtils";
export enum EnumIOErrorCodes {
  FILE_ACCESS_ERROR = "FILE_ACCESS_ERROR",
}

export class FileUtils {
  static async readFile(params: {
    path: string;
    root?: string;
  }): Promise<Result<string>> {
    try {
      // eslint-disable-next-line prefer-const
      let { root, path } = params;
      if (_.isNil(root)) {
        root = process.cwd();
      }
      const filePath = Path.resolve(root, path);
      const readFile = Util.promisify(fs.readFile);
      const contents = await readFile(filePath);
      return Result.ok<string>(contents.toString());
    } catch (err: any) {
      return Result.fail<string>({
        code: EnumIOErrorCodes.FILE_ACCESS_ERROR,
        message: TextUtils.serializeErrorAsString(err),
      });
    }
  }
  static async exists(fileOrDir: string): Promise<Result<boolean>> {
    const access = Util.promisify(fs.access);
    try {
      await access(fileOrDir, fs.constants.R_OK);
      return Result.ok<boolean>(true);
    } catch (err: any) {
      return Result.fail<boolean>({
        code: "ERROR_IN_FILE_EXISTS",
        message: err.message,
      });
    }
  }

  static async removeFile(filePath: string): Promise<Result<void>> {
    const unlink = Util.promisify(fs.unlink);
    try {
      await unlink(filePath);
      return Result.ok<void>();
    } catch (err: any) {
      return Result.fail<void>({
        code: "ERROR_DELETING_FILE",
        message: err.message,
      });
    }
  }
}
