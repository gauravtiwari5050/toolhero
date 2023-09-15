import { IJobSerialized } from "../../modules/jobs/domain/aggregates/Job";
import { JobRepo } from "../../modules/jobs/domain/repos/jobs/JobRepo";
import { JobsUtilityService } from "../../modules/jobs/services/JobsUtilityService";
import { SubmitJobUseCase } from "../../modules/jobs/useCases/submitJob/SubmitJobUseCase";
import { Result } from "../core/Result";
import { CloudAmqpService } from "./amqp/CloudAmqpService";

export abstract class AsyncUseCase<IRequest, IResponse> {
  abstract execute(request: IRequest): Promise<Result<IResponse>>;
  abstract numThreadsPerCore(): number;
  abstract maxRetries(): number;

  async enqueue(
    request: IRequest,
    idempotency: string
  ): Promise<Result<IJobSerialized>> {
    const submitJobUseCase = new SubmitJobUseCase(
      {
        job: new JobRepo(),
      },
      {
        utility: new JobsUtilityService(),
        amqp: new CloudAmqpService(),
      }
    );
    return submitJobUseCase.execute({
      jobName: this.constructor.name,
      idempotency,
      payload: request,
    });
  }
}
