import { Guard, GuardArgumentCollection } from '../../../shared/core/Guard';
import { Result, ResultError } from '../../../shared/core/Result';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

export interface IUserGroupProps {
  userId: string;
  groupId: string;
}

export type IUserGroupSerialized = IUserGroupProps & {
  id: string;
};

export class UserGroup extends AggregateRoot<IUserGroupProps> {
  public static create(
    props: IUserGroupProps,
    id?: UniqueEntityID
  ): Result<UserGroup> {
    const checkEmptyList: GuardArgumentCollection = [
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.groupId, argumentName: 'groupId' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(checkEmptyList);
    if (!guardResult.succeeded) {
      return Result.fail<UserGroup>(guardResult.error as ResultError);
    }

    const consultant = new UserGroup(props, id);
    return Result.ok<UserGroup>(consultant);
  }

  public static createFromSerialized(
    props: IUserGroupSerialized
  ): Result<UserGroup> {
    return UserGroup.create(
      {
        ...props,
      },
      new UniqueEntityID(props.id)
    );
  }

  public serialize(): IUserGroupSerialized {
    //explicitly returning each prop instead of ...this.props because it might return other db object fields inadvertently
    return {
      ...this.props,
      id: this.uniqueEntityId?.toString(),
    };
  }
}
