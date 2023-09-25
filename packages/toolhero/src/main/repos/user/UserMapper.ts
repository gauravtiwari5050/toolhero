import { ObjectId } from 'mongodb';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { DocType } from '../../../shared/domain/repo/IRepo';
import { IUserProps, IUserSerialized, User } from './User';

type UserDocType = DocType<IUserSerialized>;

export class UserMapper {
  public static toDomain(doc: UserDocType): Result<User> {
    return User.create(
      {
        email: doc.email,
        firstName: doc.firstName,
        lastName: doc.lastName,
        password: doc.password,
      },
      new UniqueEntityID(doc._id.toString())
    );
  }

  public static fromDomain(user: User): UserDocType {
    return {
      ...user.serialize(),
      _id: new ObjectId(user.uniqueEntityId.toString()),
    };
  }
}
