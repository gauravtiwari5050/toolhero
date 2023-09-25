import MongoDb from '../../../database/MongoDb';
import { BaseRepo } from '../../../shared/domain/repo/BaseRepo';
import { IUserGroupSerialized, UserGroup } from './UserGroup';
import { UserGroupMapper } from './UserGroupMapper';
import { schema } from './schema';
import { Model } from 'mongoose';

export class UserGroupRepo extends BaseRepo<UserGroup, IUserGroupSerialized> {
  fromDomain = UserGroupMapper.fromDomain;
  toDomain = UserGroupMapper.toDomain;

  protected get repo(): Model<IUserGroupSerialized> {
    const connection = MongoDb.getInstance().connection;
    if (!connection) {
      throw new Error('Database not connected');
    }
    return connection.model<IUserGroupSerialized>('UserGroup', schema);
  }
}
