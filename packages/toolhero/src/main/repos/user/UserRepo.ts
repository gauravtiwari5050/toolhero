import { BaseRepo } from '../../../shared/domain/repo/BaseRepo';
import { IUserSerialized, User } from './User';
import { UserMapper } from './UserMapper';
import { UserModel } from './schema';
import { Model } from 'mongoose';

export class UserRepo extends BaseRepo<User, IUserSerialized> {
  fromDomain = UserMapper.fromDomain;
  toDomain = UserMapper.toDomain;

  protected get repo(): Model<IUserSerialized> {
    return UserModel;
  }
}
