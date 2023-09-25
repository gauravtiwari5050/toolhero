import { BaseRepo } from '../../../shared/domain/repo/BaseRepo';
import { IGroupSerialized, Group } from './Group';
import { GroupMapper } from './GroupMapper';
import { GroupModel } from './schema';
import { Model } from 'mongoose';

export class GroupRepo extends BaseRepo<Group, IGroupSerialized> {
  fromDomain = GroupMapper.fromDomain;
  toDomain = GroupMapper.toDomain;

  protected get repo(): Model<IGroupSerialized> {
    return GroupModel;
  }
}
