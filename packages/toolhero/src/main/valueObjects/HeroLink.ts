import { ValueObject } from "../../shared/domain/ValueObject";



export interface IHeroLinkProps {
    name: string;
    meta: Record<string, any>;
    to?: string;
}

export interface IHeroLinkSerialised {
    path: string;
    name: string;
    meta: Record<string, any>;
    to?: string;
}


export class HeroLink extends ValueObject<IHeroLinkProps> {
    public serialise(path: string): IHeroLinkSerialised {
        return {
            path,
            name: this.props.name,
            meta: this.props.meta,
            to: this.props.to
        }
    }
    public static deserialise(serialised: IHeroLinkSerialised): HeroLink {
        return new HeroLink({
            name: serialised.name,
            meta: serialised.meta,
            to: serialised.to,
        })
    }
    public static New(name: string): HeroLink {
        return new HeroLink({
            name: name,
            meta: {},
        })
    }

    public to(to: string): HeroLink {
        this.props.to = to;
        return this;
    }
    public addMetaData(key: string, value: string): HeroLink {
        this.props.meta[key] = value;
        return this;
    }
}