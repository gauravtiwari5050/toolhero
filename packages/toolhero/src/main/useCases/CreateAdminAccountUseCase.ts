import * as _ from 'lodash';
import bcrypt from 'bcryptjs';
import { Result } from '../../shared/core/Result';
import { UseCase } from '../../shared/core/UseCase';
import { ErrorCodes } from '../../shared/domain/ErrorCodes';
import { EnumPreDefinedGroup, Group } from '../repos/group/Group';
import { GroupRepo } from '../repos/group/GroupRepo';
import { UserRepo } from '../repos/user/UserRepo';
import { ICreateAdminAccountRequest } from './ICreateAdminAccountRequest';
import { ICreateAdminAccountResponse } from './ICreateAdminAccountResponse';
import { UserGroup } from '../repos/userGroup/UserGroup';
import { UserGroupRepo } from '../repos/userGroup/UserGroupRepo';
import { User } from '../repos/user/User';
import { IJsonWebTokenService } from '../../shared/services/JwtTokenService';

interface IRepos {
  user: UserRepo;
  group: GroupRepo;
  userGroup: UserGroupRepo;
}
interface IServices {
  jwt: IJsonWebTokenService;
}
export class CreateAdminAccountUseCase
  implements UseCase<ICreateAdminAccountRequest, ICreateAdminAccountResponse>
{
  private repos: IRepos;
  private services: IServices;
  constructor(repos: IRepos, services: IServices) {
    this.repos = repos;
    this.services = services;
  }
  async execute(
    request: ICreateAdminAccountRequest
  ): Promise<Result<ICreateAdminAccountResponse>> {
    try {
      // 1. find the superadmin group first
      let superAdminGroupOrError = await this.repos.group.findOne({
        name: EnumPreDefinedGroup.SUPERADMIN,
      });
      if (superAdminGroupOrError.isFailure) {
        return Result.fail(superAdminGroupOrError.error);
      }
      let superAdminGroup = superAdminGroupOrError.getValue();
      if (_.isNil(superAdminGroup)) {
        superAdminGroupOrError = Group.create({
          name: EnumPreDefinedGroup.SUPERADMIN,
        });
        if (superAdminGroupOrError.isFailure) {
          return Result.fail(superAdminGroupOrError.error);
        }
        superAdminGroup = superAdminGroupOrError.getValue();
        const savedOrError = await this.repos.group.save(superAdminGroup);
        if (savedOrError.isFailure) {
          return Result.fail(savedOrError.error);
        }
      }

      let userGroupOrError = await this.repos.userGroup.findOne({
        groupId: superAdminGroup.uniqueEntityId.toString(),
      });
      if (userGroupOrError.isFailure) {
        return Result.fail(userGroupOrError.error);
      }
      if (!_.isNil(userGroupOrError.getValue())) {
        return Result.fail({
          code: ErrorCodes.REPO_ERROR,
          message: `SuperAdmin account already exists`,
        });
      }

      let userOrError = await this.repos.user.findOne({
        email: request.email,
      });
      if (userOrError.isFailure) {
        return Result.fail(userOrError.error);
      }
      let user = userOrError.getValue();
      const spltNames = (request.name || '').split(' ');
      const firsName = spltNames.shift();
      const lastName = spltNames.join(' ');

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(request.password, salt);

      if (_.isNil(user)) {
        userOrError = User.create({
          firstName: firsName as string,
          lastName: lastName,
          email: request.email,
          password: hash,
        });
        if (userOrError.isFailure) {
          return Result.fail(userOrError.error);
        }
        user = userOrError.getValue();
        const savedOrError = await this.repos.user.save(user);
        if (savedOrError.isFailure) {
          return Result.fail(savedOrError.error);
        }
      }

      userGroupOrError = UserGroup.create({
        userId: user.uniqueEntityId.toString(),
        groupId: superAdminGroup.uniqueEntityId.toString(),
      });

      if (userGroupOrError.isFailure) {
        return Result.fail(userGroupOrError.error);
      }

      const userGroup = userGroupOrError.getValue();
      const savedOrError = await this.repos.userGroup.save(userGroup);
      if (savedOrError.isFailure) {
        return Result.fail(savedOrError.error);
      }

      const tokenOrError = await this.services.jwt.generate({
        userId: user.uniqueEntityId.toString(),
        email: user.email,
        groups: [superAdminGroup.uniqueEntityId.toString()],
      });

      if (tokenOrError.isFailure) {
        return Result.fail(tokenOrError.error);
      }

      return Result.ok({ token: tokenOrError.getValue() });
    } catch (err) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: (err as Error)?.message,
      });
    }
  }
}
