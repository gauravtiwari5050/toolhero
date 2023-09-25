import MongoDb from '../../../database/MongoDb';
import { BaseRepo } from '../../../shared/domain/repo/BaseRepo';
import { IGroupSerialized, Group } from './Group';
import { GroupMapper } from './GroupMapper';
import { schema } from './schema';
import { Model } from 'mongoose';

export class GroupRepo extends BaseRepo<Group, IGroupSerialized> {
  fromDomain = GroupMapper.fromDomain;
  toDomain = GroupMapper.toDomain;

  protected get repo(): Model<IGroupSerialized> {
    const connection = MongoDb.getInstance().connection;
    if (!connection) {
      throw new Error('Database not connected');
    }
    return connection.model<IGroupSerialized>('Group', schema);
  }
}
