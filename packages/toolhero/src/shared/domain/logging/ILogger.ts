export interface ILogger {
  log(severity: string, message?: any, data?: any): void;
  info(message?: string, data?: any): void;
  error(message?: string, data?: any): void;
  warn(message?: string, data?: any): void;
  debug(message?: string, data?: any): void;

  setMemberId(memberId: string): void;
  setOrganisationId(organisationId: string): void;
}
