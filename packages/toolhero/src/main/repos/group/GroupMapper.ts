import { ObjectId } from 'mongodb';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { DocType } from '../../../shared/domain/repo/IRepo';
import { Group, IGroupSerialized } from './Group';

type GroupDocType = DocType<IGroupSerialized>;

export class GroupMapper {
  public static toDomain(doc: GroupDocType): Result<Group> {
    return Group.create(
      {
        name: doc.name,
      },
      new UniqueEntityID(doc._id.toString())
    );
  }

  public static fromDomain(group: Group): GroupDocType {
    return {
      ...group.serialize(),
      _id: new ObjectId(group.uniqueEntityId.toString()),
    };
  }
}
