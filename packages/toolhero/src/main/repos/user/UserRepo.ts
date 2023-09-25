import MongoDb from '../../../database/MongoDb';
import { BaseRepo } from '../../../shared/domain/repo/BaseRepo';
import { IUserSerialized, User } from './User';
import { UserMapper } from './UserMapper';
import { schema } from './schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

export class UserRepo extends BaseRepo<User, IUserSerialized> {
  fromDomain = UserMapper.fromDomain;
  toDomain = UserMapper.toDomain;

  public get repo(): Model<IUserSerialized> {
    const connection = MongoDb.getInstance().connection;
    if (!connection) {
      throw new Error('Database not connected');
    }
    const UserModel = connection.model<IUserSerialized>('User', schema);
    return UserModel;
  }
}
