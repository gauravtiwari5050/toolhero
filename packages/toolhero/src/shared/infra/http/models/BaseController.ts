import { HttpRequest } from "../../../../../../pages/api/ddd/HttpRequest";
import { HttpResponse } from "../../../../../../pages/api/ddd/HttpResponse";
import { ResultError } from "../../../core/Result";
import { instanceToPlain } from "class-transformer";
import { Trace } from "../../../domain/trace";

export abstract class BaseController {
  protected abstract executeImpl(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void | any>;

  public async execute(req: HttpRequest, res: HttpResponse): Promise<void> {
    try {
      await Trace.box("CONTROLLER", async () => {
        await this.executeImpl(req, res);
      });
    } catch (err: any) {
      console.log(`[BaseController]: Uncaught controller error`);
      console.log(err);
      this.fail(res, {
        code: "UNEXPECTED_ERROR",
        message: err.message,
      });
    }
  }

  public static jsonResponse(
    res: HttpResponse,
    code: number,
    error: ResultError
  ) {
    return res.status(code).json(error);
  }

  public ok<T>(res: HttpResponse, dto?: T) {
    if (!!dto) {
      res.type("application/json");
      return res.status(200).json(instanceToPlain(dto));
    } else {
      return res.sendStatus(200);
    }
  }

  public created(res: HttpResponse) {
    return res.sendStatus(201);
  }

  public clientError(res: HttpResponse, error?: ResultError) {
    return BaseController.jsonResponse(res, 400, error as ResultError);
  }

  public unauthorized(res: HttpResponse, error?: ResultError) {
    return BaseController.jsonResponse(res, 401, error as ResultError);
  }

  public paymentRequired(res: HttpResponse, error?: ResultError) {
    return BaseController.jsonResponse(res, 402, error as ResultError);
  }

  public forbidden(res: HttpResponse, error?: ResultError) {
    return BaseController.jsonResponse(res, 403, error as ResultError);
  }

  public notFound(res: HttpResponse, error?: ResultError) {
    return BaseController.jsonResponse(res, 404, error as ResultError);
  }

  public conflict(res: HttpResponse, error?: ResultError) {
    return BaseController.jsonResponse(res, 409, error as ResultError);
  }

  public tooMany(res: HttpResponse, error?: ResultError) {
    return BaseController.jsonResponse(res, 429, error as ResultError);
  }

  public todo(res: HttpResponse) {
    return BaseController.jsonResponse(res, 400, {
      code: "TODO",
      message: "Not implemented",
    });
  }

  public fail(res: HttpResponse, error: ResultError) {
    return res.status(500).json(error);
  }
}
