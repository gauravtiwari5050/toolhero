import { Guard, GuardArgumentCollection } from '../../../shared/core/Guard';
import { Result, ResultError } from '../../../shared/core/Result';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

export interface IUserProps {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export type IUserSerialized = IUserProps & {
  id: string;
};

export class User extends AggregateRoot<IUserProps> {
  public static create(props: IUserProps, id?: UniqueEntityID): Result<User> {
    const checkEmptyList: GuardArgumentCollection = [
      { argument: props.email, argumentName: 'email' },
      { argument: props.firstName, argumentName: 'firstName' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(checkEmptyList);
    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.error as ResultError);
    }

    const consultant = new User(props, id);
    return Result.ok<User>(consultant);
  }

  public static createFromSerialized(props: IUserSerialized): Result<User> {
    return User.create(
      {
        ...props,
      },
      new UniqueEntityID(props.id)
    );
  }

  public serialize(): IUserSerialized {
    //explicitly returning each prop instead of ...this.props because it might return other db object fields inadvertently
    return {
      ...this.props,
      id: this.uniqueEntityId?.toString(),
    };
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get fullName() {
    return this.props.firstName + ' ' + this.props.lastName || '';
  }
}
