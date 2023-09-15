import { IRouteHandler } from "./IRouteHandler";
import { EnumHttpMethods } from "./EnumHttpMethods";
export interface IRoute {
  method: EnumHttpMethods;
  path: string;
  handler: IRouteHandler;
  middlewares: IRouteHandler[];
}
export interface IRouter {
  use(path: string, router: IRouter): void;
  GET(path: string, handler: IRouteHandler): void;
  PUT(path: string, handler: IRouteHandler): void;
  POST(path: string, handler: IRouteHandler): void;
  middleware(handler: IRouteHandler): void;
  routes(): IRoute[];
  middlewares(): IRouteHandler[];
}
