import { HeroApplication } from '../HeroApplication';
import { IHeroRequest } from '../IHeroRequest';
import { IHeroResponse } from '../IHeroResponse';
export interface IHeroRequestContext {
  application: HeroApplication;
}
export interface IRouteHandler {
  (
    request: IHeroRequest,
    response: IHeroResponse,
    context: IHeroRequestContext
  ): void;
}
