import { BaseRepo } from '../../../shared/domain/repo/BaseRepo';
import { IUserGroupSerialized, UserGroup } from './UserGroup';
import { UserGroupMapper } from './UserGroupMapper';
import { UserGroupModel } from './schema';
import { Model } from 'mongoose';

export class UserGroupRepo extends BaseRepo<UserGroup, IUserGroupSerialized> {
  fromDomain = UserGroupMapper.fromDomain;
  toDomain = UserGroupMapper.toDomain;

  protected get repo(): Model<IUserGroupSerialized> {
    return UserGroupModel;
  }
}
