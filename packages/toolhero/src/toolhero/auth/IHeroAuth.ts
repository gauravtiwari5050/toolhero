import { HeroManager } from '../HeroManager';

export interface IHeroAuth {
  onSignin(args: {
    username: string;
    password: string;
  }): Promise<{ status: 'SUCCESS' | 'ERROR'; token?: string }>;
  onSignup(args: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }): Promise<string>;
  hasSignup(): Promise<boolean>;
  activeAdminCount(): Promise<number>;
}

export class HeroSimpleAuth implements IHeroAuth {
  private firstName?: string;
  private lastName?: string;
  private username: string;
  private password: string;
  private _manager: HeroManager;

  constructor({
    firstName,
    lastName,
    username,
    password,
    manager,
  }: {
    firstName?: string;
    lastName?: string;
    username: string;
    password: string;
    manager: HeroManager;
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this._manager = manager;
  }
  async onSignin({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{ status: 'SUCCESS' | 'ERROR'; token?: string }> {
    if (username === this.username && password === this.password) {
      return { status: 'SUCCESS' };
    }
    return {
      status: 'ERROR',
    };
  }
  onSignup(args: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }): Promise<string> {
    throw new Error('Signup not supported');
  }
  activeAdminCount(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async hasSignup(): Promise<boolean> {
    return false;
  }
}
