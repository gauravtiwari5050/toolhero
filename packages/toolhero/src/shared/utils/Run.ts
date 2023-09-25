import * as _ from 'lodash';
import minimist from 'minimist';
import { CreateAdminAccount } from '../../runners/CreateAdminAccount';

export const runnerClassMap: any = {
  CreateAdminAccount,
};

export class Run {
  private getCommandLineDetails() {
    const runnerLineArgsArray = process.argv.slice(2);
    const parsedCommandLine = minimist(runnerLineArgsArray);
    const runnerName = parsedCommandLine._.shift();
    if (_.isEmpty(runnerName)) {
      throw new Error('Please provide a runner');
    }
    // @ts-ignore
    delete parsedCommandLine._;
    return { runnerName, options: parsedCommandLine };
  }

  public async run() {
    const { runnerName, options } = this.getCommandLineDetails();
    // @ts-ignore
    const RunnerClass = runnerClassMap[runnerName];
    if (_.isNil(RunnerClass)) {
      throw new Error(`No runner registered with ${runnerName}`);
    }
    const object = new RunnerClass({ options });
    await object.run();
  }

  public async runByName(runnerName: string, options: any): Promise<any> {
    const RunnerClass = runnerClassMap[runnerName];
    if (_.isNil(RunnerClass)) {
      throw new Error(`No runner registered with ${runnerName}`);
    }
    const object = new RunnerClass({ options });
    return object.run();
  }
}
