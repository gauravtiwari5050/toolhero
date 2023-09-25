import * as _ from 'lodash';

export class Runner {
  public options: any;

  public dryRun: boolean | undefined;

  constructor(params: { options: any }) {
    this.options = params.options;
  }

  public requires(options: any): void {
    let requiredArgumentsObject: any = {};

    if (typeof options === 'string') {
      const splitOptions = _.trim(options).split(',');

      _.map(splitOptions, (splitOption) => {
        requiredArgumentsObject[_.trim(splitOption)] = '';
      });
    } else {
      requiredArgumentsObject = options;
    }

    const missingMessages: any[] = [];

    _.map(requiredArgumentsObject, (error, requiredArg) => {
      let message: any = error;

      if (_.isEmpty(message)) {
        message = `\nPlease provide ${requiredArg}`;
      }
      if (
        _.isNil(this.options[requiredArg]) ||
        _.isUndefined(this.options[requiredArg])
      ) {
        missingMessages.push(message);
      }
    });

    if (!_.isEmpty(missingMessages)) {
      throw new Error(missingMessages.join(''));
    }
  }

  public async beforeRun(): Promise<void> {
    this.dryRun = this.options.dryRun !== 'off';
  }

  public async run(): Promise<any> {
    throw new Error('Not implemented');
  }
}
