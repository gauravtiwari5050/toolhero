import { rootRouter } from '../../main/infra/http/rootRouter';
import { ErrorCodes } from '../../shared/domain/ErrorCodes';
import { HeroApplication } from '../HeroApplication';
import { IHeroRequest } from '../IHeroRequest';
import { IHeroResponse } from '../IHeroResponse';
import { Router } from './Router';
import RouteParser from 'route-parser';

export class RoutingService {
  private request: IHeroRequest;
  private response: IHeroResponse;
  private application: HeroApplication;
  constructor({
    request,
    response,
    application,
  }: {
    request: IHeroRequest;
    response: IHeroResponse;
    application: HeroApplication;
  }) {
    this.request = request;
    this.response = response;
    this.application = application;
  }
  public async execute(): Promise<void> {
    try {
      // initialize router
      const router = new Router();

      // mount root  and use root routes
      router.use('/', rootRouter);
      const routes = router.routes();

      // clean incoming url and ready it for processing
      let effectiveUrl = ((this.request.query()['r'] as string) || '')
        .replace(/\/\/+/g, '/')
        .replace(/\/$/, '');
      if (effectiveUrl === '') {
        effectiveUrl = '/';
      }

      console.log({ effectiveUrl });

      // iterate over list of mounted routes
      for (const route of routes) {
        // get the cleaned path for the route
        let effectivePath = route.path
          .replace(/\/\/+/g, '/')
          .replace(/\/$/, '');
        if (effectivePath === '') {
          effectivePath = '/';
        }

        // load parser
        const routeParser = new RouteParser(effectivePath);
        const params = routeParser.match(effectiveUrl);

        // execute route handler
        if (params !== false && this.request.method() === route.method) {
          this.request.setHeroParams(params);
          try {
            const middlewares = route.middlewares;
            for (const middleware of middlewares) {
              await middleware(this.request, this.response, {
                application: this.application,
              });
              if (this.response.isTerminated() === true) {
                return;
              }
            }
            await route.handler(this.request, this.response, {
              application: this.application,
            });
            return;
          } catch (err) {
            console.error(err);
            return this.response.error({
              code: ErrorCodes.INTERNAL_SERVER_ERROR,
              status: 500,
              message: 'Something went wrong',
            });
          }
        }
      }
      // if none of the routes match, return a 404 response
      this.response.error({
        code: ErrorCodes.ROUTE_NOT_FOUND,
        message: 'Could not find this route',
        status: 404,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
