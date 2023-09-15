
import { HeroNextManager } from "../HeroNextHandler";
import { HeroRequest } from "../HeroRequest"
import { HeroResponse } from "../HeroResponse";
export interface IHeroRequestContext {
  manager: HeroNextManager
}
export interface IRouteHandler {
  (request: HeroRequest, response: HeroResponse, context: IHeroRequestContext): void;
}
