export interface IHeroRequest {
  params(): Record<string, unknown>;
  heroParams(): Record<string, unknown>;
  setHeroParams(params: Record<string, unknown>): void;
  query(): Record<string, unknown>;
  cookies(): Record<string, string>;
  url(): string;
  method(): string;
  body(): any;
}
