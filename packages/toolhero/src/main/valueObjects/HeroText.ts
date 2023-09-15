import { ValueObject } from "../../shared/domain/ValueObject";

export type IDefaultString = () => string | Promise<string>;


export interface IHeroTextProps {
    name: string;
    value: string | null;
    default: IDefaultString | null;
}

export interface IHeroTextSerialised {
    path: string;
    name: string;
    value: string | null;
}


export class HeroText extends ValueObject<IHeroTextProps> {
    public async serialise(): Promise<IHeroTextSerialised> {
        let value = null;
        if (this.props.value) {
            if (typeof this.props.value === "function") {
                value = await (this.props.value as unknown as IDefaultString)();
            } else {
                value = this.props.value
            }
        }
        return {
            path: "",
            name: this.props.name,
            value
        }
    }
    public static deserialise(serialised: IHeroTextSerialised): HeroText {
        return new HeroText({
            name: serialised.name,
            value: serialised.value,
            default: null
        })
    }
    public static New(name: string): HeroText {
        return new HeroText({
            name,
            value: null,
            default: null
        })
    }
    public default(value: string | IDefaultString) {
        if (typeof value === "function") {
            this.props.default = value
        } else[
            this.props.value = value
        ]
        return this
    }



    get name(): string {
        return this.props.name;
    }
    get value(): string {
        return this.props.value as string
    }
}