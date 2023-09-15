import { ValueObject } from "../../shared/domain/ValueObject";
import { HeroButton, IHeroButtonSerialised } from "./HeroButton";
import { HeroExecutionContext } from "./HeroExecutionContext";


export type HeroFunctionOutput = HeroButton | void
export type HeroFunctionOutputSerialised = {
    type: string;
    button?: IHeroButtonSerialised;
}

export type HeroFunction = (context: HeroExecutionContext) => Promise<HeroFunctionOutput>;

export interface IHeroFunctionsProps {
    members: {
        name: string;
        func: HeroFunction
    }[];
}

export interface IHeroFunctionsSerialized {
    path: string;
    members: {
        name: string;
    }[];
}



export class HeroFunctions extends ValueObject<IHeroFunctionsProps> {
    public async serialise(): Promise<IHeroFunctionsSerialized> {
        const members: {
            name: string
        }[] = [];
        let index = 0;
        for (const member of this.props.members) {
            members.push({
                name: member.name,
            });
            index += 1;
        }
        return { path: "", members }
    }


    public static New(): HeroFunctions {
        return new HeroFunctions({
            members: [],
        })
    }


    public register(name: string, func: HeroFunction) {
        const existing = this.props.members.find((member) => {
            return member.name === name;
        })
        if (existing) {
            existing.func = func
        } else {
            this.props.members.push({
                name,
                func
            })
        }
    }

    public find(name: string | null | undefined): HeroFunction | null | undefined {
        if (!name) {
            return null
        }
        const func = this.props.members.find((member) => {
            return member.name == name
        })
        return func?.func
    }





}