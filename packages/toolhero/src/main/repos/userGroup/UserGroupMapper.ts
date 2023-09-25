import { ObjectId } from 'mongodb';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { DocType } from '../../../shared/domain/repo/IRepo';
import { IUserGroupProps, IUserGroupSerialized, UserGroup } from './UserGroup';

type UserGroupDocType = DocType<IUserGroupSerialized>;

export class UserGroupMapper {
  public static toDomain(doc: UserGroupDocType): Result<UserGroup> {
    return UserGroup.create(
      {
        userId: doc.userId,
        groupId: doc.groupId,
      },
      new UniqueEntityID(doc._id.toString())
    );
  }

  public static fromDomain(user: UserGroup): UserGroupDocType {
    return {
      ...user.serialize(),
      _id: new ObjectId(user.uniqueEntityId.toString()),
    };
  }
}
