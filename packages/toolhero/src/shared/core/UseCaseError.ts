interface IUseCaseError {
  code: string;
  message: string;
}

export abstract class UseCaseError implements IUseCaseError {
  public readonly code: string;
  public readonly message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}
