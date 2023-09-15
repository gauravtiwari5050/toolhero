import { Result } from "../core/Result";
import { ValueObjectProps } from "./ValueObject";

export enum EnumAppJobName {
  ANALYZE_SNIP = "ANALYZE_SNIP",
}

export abstract class AppJob<T extends ValueObjectProps> {
  protected payload: T;

  constructor(props: T) {
    const baseProps: any = {
      ...props,
    };

    this.payload = baseProps;
  }

  public abstract name(): EnumAppJobName;
  public abstract queue(): string;
  public abstract timeoutSeconds(): number;
  public abstract idempotency(): string;
  public abstract validate(): Promise<Result<void>>;

  public abstract execute(): Promise<Result<void>>;

  public equals(vo?: AppJob<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.payload === undefined) {
      return false;
    }
    return JSON.stringify(this.payload) === JSON.stringify(vo.payload);
  }

  public fullyQualifiedIdempotency(): string {
    return `${
      process.env.NODE_ENV || "development"
    }-${this.name()}-${this.idempotency()}`;
  }
}
