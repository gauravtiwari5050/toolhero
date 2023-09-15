import * as _ from "lodash";
import { EnumJobStatus, Job } from "../../modules/jobs/domain/aggregates/Job";
import { JobRepo } from "../../modules/jobs/domain/repos/jobs/JobRepo";
import { AnalyzeSnipJob } from "../../modules/main/jobs/AnlayzeSnipJob";
import { Result } from "../core/Result";
import { EnumAppJobName } from "../domain/AppJob";

export const jobsClassMap: Record<string, any> = {
  [EnumAppJobName.ANALYZE_SNIP]: AnalyzeSnipJob,
};

export class Jobs {
  public async run() {
    const jobRepo = new JobRepo();

    let job: Job = null;
    try {
      console.log("Will run");
      const jobEid = process.env.JOB_EID as string;

      if (_.isEmpty(jobEid)) {
        throw new Error("jobEid not present in payload");
      }
      const jobOrError = await jobRepo.findByEid(jobEid);
      if (jobOrError.isFailure) {
        throw new Error(jobOrError.error.message);
      }
      job = jobOrError.getValue();
      if (!job) {
        throw new Error(`No job found with jobEid ${jobEid}`);
      }

      const Klass: any = jobsClassMap[job.name];

      const instanceOfJobKlass = new Klass(job.payload);
      let status = EnumJobStatus.SUCCESS;
      try {
        const responseOrError =
          (await instanceOfJobKlass.execute()) as Result<void>;
        if (responseOrError.isFailure) {
          console.log(responseOrError.error);
          status = EnumJobStatus.ERROR;
        }
      } catch (err: unknown) {
        console.error(err);
        status = EnumJobStatus.ERROR;
      }

      job.status = status;
      const savedOrError = await jobRepo.save(job);
      if (savedOrError.isFailure) {
        throw new Error(savedOrError.error.message);
      }
    } catch (err: unknown) {
      console.error(err);
      if (job) {
        job.status = EnumJobStatus.EXCEPTION;
        const savedOrError = await jobRepo.save(job);
        if (savedOrError.isFailure) {
          throw new Error(savedOrError.error.message);
        }
      }
    }
  }
}
