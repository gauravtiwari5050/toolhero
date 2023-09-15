import { ValueObject } from "../../shared/domain/ValueObject";
import { HeroExecutionContext } from "./HeroExecutionContext";
import { HeroFunctions } from "./HeroFunctions";
import { HeroInput, IHeroInputSerialized } from "./HeroInput";
import { HeroOutput } from "./HeroOutput";

export type IOnHeroToolRun = (input: HeroInput, context: HeroExecutionContext) => Promise<HeroOutput>;
export interface IHeroToolProps {
    name: string;
    input: HeroInput;
    onSubmit: IOnHeroToolRun;
    functions: HeroFunctions;
}
export interface IHeroToolSerialised {
    path: string;
    name: string;
    input: IHeroInputSerialized
}

export class HeroTool extends ValueObject<IHeroToolProps> {
    public async serialise(): Promise<IHeroToolSerialised> {
        return {
            path: "",
            name: this.props.name,
            input: await this.props.input.serialise()
        }
    }
    public static New(name: string): HeroTool {
        return new HeroTool({
            name,
            input: HeroInput.New(),
            onSubmit: async (_payload: HeroInput) => {
                return HeroOutput.New()
            },
            functions: HeroFunctions.New()
        })
    }

    get input(): HeroInput {
        return this.props.input;
    }

    get functions(): HeroFunctions {
        return this.props.functions
    }

    run(onRun: IOnHeroToolRun) {
        this.props.onSubmit = onRun;
        return this
    }

    get onSubmit(): IOnHeroToolRun {
        return this.props.onSubmit
    }

}