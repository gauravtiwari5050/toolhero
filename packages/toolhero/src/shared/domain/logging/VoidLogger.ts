import { ILogger } from "./ILogger";

export class VoidLogger implements ILogger {
  log(severity: string, message: any): void {
    //@ts-ignore
    console[severity](message);
  }
  info(message: any): void {
    this.log("info", message);
  }
  error(message: any): void {
    this.log("error", message);
  }
  warn(message: any): void {
    this.log("warn", message);
  }
  setMemberId(memberId: string): void {
    console.log("MemberId: ", memberId);
  }
  setOrganisationId(organisationId: string): void {
    console.log("OrganisationId: ", organisationId);
  }

  debug(message?: string, data?: any): void {
    this.log("debug", message);
  }
}
