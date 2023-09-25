import { GroupRepo } from '../main/repos/group/GroupRepo';
import { UserRepo } from '../main/repos/user/UserRepo';
import { UserGroup } from '../main/repos/userGroup/UserGroup';
import { UserGroupRepo } from '../main/repos/userGroup/UserGroupRepo';
import { CreateAdminAccountUseCase } from '../main/useCases/CreateAdminAccountUseCase';
import { JsonWebTokenService } from '../shared/services/JwtTokenService';
import { HeroApplication } from '../toolhero/HeroApplication';
import { Runner } from './Runner';

export class CreateAdminAccount extends Runner {
  async run(): Promise<any> {
    console.log('Will create admin account');
    const heroApp = new HeroApplication({
      secret: 'abracadabra',
      mongoUrl: 'mongodb://localhost:27017/toolhero',
    });
    await heroApp.initialise();
    const useCase = new CreateAdminAccountUseCase(
      {
        user: new UserRepo(heroApp),
        group: new GroupRepo(heroApp),
        userGroup: new UserGroupRepo(heroApp),
      },
      { jwt: new JsonWebTokenService(heroApp) }
    );

    const response = await useCase.execute({
      name: 'Gaurav Tiwari',
      email: 'gaurav@toolhero.com',
      password: 'abracadabra',
    });
    console.log(response);
  }
}
