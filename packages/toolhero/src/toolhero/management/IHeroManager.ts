import { HeroApplication } from '../HeroApplication';
export interface IHeroContext {
  getCookie(name: string): Promise<string>;
  setCookie(name: string, value: string): Promise<string>;
  getSignedInUser(): Promise<IHeroUser>;
}
export interface IHeroManager {
  afterSignIn(args: { context: IHeroContext }): Promise<boolean>;
}
export enum EnumUserRole {
  ADMIN = 'ADMIN',
  REGULAR = 'REGULAR',
}
export interface IHeroUser {
  firstName?: string;
  lastName?: string;
  id: string;
  password?: string;
  roles: EnumUserRole[];
}
