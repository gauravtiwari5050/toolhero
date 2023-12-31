import * as jwt from 'jsonwebtoken';
import { Result } from '../core/Result';
import { ErrorCodes } from '../domain/ErrorCodes';
import { HeroApplication } from '../../toolhero/HeroApplication';

export interface IJsonWebTokenPayload {
  userId: string;
  email: string;
  groups: string[];
}

export interface IJsonWebTokenService {
  generate(payload: IJsonWebTokenPayload): Promise<Result<string>>;
  decode(
    token: string,
    opt?: { audience?: string }
  ): Promise<Result<IJsonWebTokenPayload>>;
}

export class JsonWebTokenService implements IJsonWebTokenService {
  private application: HeroApplication;

  constructor(application: HeroApplication) {
    this.application = application;
  }

  async generate(payload: IJsonWebTokenPayload): Promise<Result<string>> {
    try {
      const token = jwt.sign(payload, this.application.getSecret(), {
        expiresIn: '1d',
      });
      return Result.ok(token);
    } catch (err) {
      return Result.fail({
        code: ErrorCodes.JWT_SIGNING_ERROR,
        message: (err as Error)?.message,
      });
    }
  }

  async decode(token: string): Promise<Result<IJsonWebTokenPayload>> {
    try {
      const payload = jwt.verify(
        token,
        this.application.getSecret()
      ) as IJsonWebTokenPayload;
      return Result.ok<IJsonWebTokenPayload>(payload);
    } catch (err: any) {
      return Result.fail<IJsonWebTokenPayload>({
        code: ErrorCodes.JWT_SIGNING_ERROR,
        message: err.message,
      });
    }
  }
}
