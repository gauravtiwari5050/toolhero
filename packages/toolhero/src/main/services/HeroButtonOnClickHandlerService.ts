import { Result } from "../../shared/core/Result";
import { ErrorCodes } from "../../shared/domain/ErrorCodes";
import { HeroButton } from "../valueObjects/HeroButton";
import { HeroExecutionContext } from "../valueObjects/HeroExecutionContext";
import { HeroFunction, HeroFunctionOutputSerialised } from "../valueObjects/HeroFunctions";

export interface IHeroButtonOnClickHandlerService {
    runHeroFunction(args: { heroFunction: HeroFunction; button: HeroButton; context: HeroExecutionContext }): Promise<Result<HeroFunctionOutputSerialised>>;
}

export class HeroButtonOnClickHandlerService implements IHeroButtonOnClickHandlerService {
    async runHeroFunction({ heroFunction, context }: { heroFunction: HeroFunction | null | undefined; context: HeroExecutionContext; }): Promise<Result<HeroFunctionOutputSerialised>> {
        try {
            if (!heroFunction) {
                return Result.ok({
                    type: 'void'
                })
            }
            const response = await heroFunction(context);
            let type = 'void';
            const outputSerialised: HeroFunctionOutputSerialised = {
                type,
            }
            if (typeof response !== 'undefined') {
                outputSerialised.type = response.constructor?.name;
                outputSerialised.button = (response as HeroButton).serialise(context.event?.source?.button?.path || "unknown");
            }

            return Result.ok(outputSerialised);
        } catch (err) {
            return Result.fail({
                code: ErrorCodes.INTERNAL_SERVER_ERROR,
                message: `Could not evaluate handler`
            })
        }
    }

}