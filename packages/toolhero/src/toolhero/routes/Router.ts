import { IRouteHandler } from "./IRouteHandler";
import { EnumHttpMethods } from "./EnumHttpMethods";
import { IRouter, IRoute } from "./IRouter";
import cloneDeep from "lodash.clonedeep"
/**
 * Application router similar to express http router
 * @class
 *
 */
export class Router implements IRouter {
  private routers: {
    path: string;
    router: IRouter;
  }[];
  private _middlewares: IRouteHandler[];
  private installedRoutes: IRoute[];
  constructor() {
    this.routers = [];
    this.installedRoutes = [];
    this._middlewares = [];
  }
  middlewares(): IRouteHandler[] {
    return this._middlewares;
  }
  getMiddlewares(): IRouteHandler[] {
    return this._middlewares;
  }
  middleware(handler: IRouteHandler): void {
    this._middlewares.push(handler);
  }
  routes(): IRoute[] {
    const routes = cloneDeep(this.installedRoutes);
    const middlewares: IRouteHandler[] = [];
    for (const middleware of this._middlewares) {
      middlewares.push(middleware);
    }
    for (const router of this.routers) {
      const routerRoutes = router.router.routes();
      const routerMiddlewares = router.router.middlewares();
      for (const m of routerMiddlewares) {
        middlewares.push(m);
      }
      routerRoutes.map(route => {
        routes.push({
          handler: route.handler,
          method: route.method,
          path: `/${router.path}/${route.path}`,
          middlewares,
        });
      });
    }
    return routes;
  }

  install(method: EnumHttpMethods, path: string, handler: IRouteHandler) {
    const middlewares: IRouteHandler[] = [];
    this.installedRoutes.push({
      method,
      path,
      handler,
      middlewares,
    });
  }
  PUT(path: string, handler: IRouteHandler) {
    this.install(EnumHttpMethods.PUT, path, handler);
  }
  POST(path: string, handler: IRouteHandler) {
    this.install(EnumHttpMethods.POST, path, handler);
  }
  GET(path: string, handler: IRouteHandler) {
    this.install(EnumHttpMethods.GET, path, handler);
  }
  use(path: string, router: IRouter) {
    this.routers.push({
      path,
      router
    });
  }
}
