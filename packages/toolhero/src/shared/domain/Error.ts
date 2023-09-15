import { ErrorCodes } from "./ErrorCodes";


export interface Error {
    code: ErrorCodes;
    status?: number;
    message?: string;
    error?: any;
}
