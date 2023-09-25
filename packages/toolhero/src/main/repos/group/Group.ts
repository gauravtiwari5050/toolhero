import { Guard, GuardArgumentCollection } from '../../../shared/core/Guard';
import { Result, ResultError } from '../../../shared/core/Result';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
export enum EnumPreDefinedGroup {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
}
export interface IGroupProps {
  name: string;
}

export type IGroupSerialized = IGroupProps & {
  id: string;
};

export class Group extends AggregateRoot<IGroupProps> {
  public static create(props: IGroupProps, id?: UniqueEntityID): Result<Group> {
    const checkEmptyList: GuardArgumentCollection = [
      { argument: props.name, argumentName: 'email' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(checkEmptyList);
    if (!guardResult.succeeded) {
      return Result.fail<Group>(guardResult.error as ResultError);
    }

    const consultant = new Group(props, id);
    return Result.ok<Group>(consultant);
  }

  public static createFromSerialized(props: IGroupSerialized): Result<Group> {
    return Group.create(
      {
        ...props,
      },
      new UniqueEntityID(props.id)
    );
  }

  public serialize(): IGroupSerialized {
    return {
      ...this.props,
      id: this.uniqueEntityId?.toString(),
    };
  }
}
