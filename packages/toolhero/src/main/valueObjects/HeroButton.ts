import { ValueObject } from "../../shared/domain/ValueObject";

export enum EnumHeroButtonType {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}

export interface IHeroButtonProps {
    type: EnumHeroButtonType;
    name: string;
    meta: Record<string, any>;
    onClickHandler: string | null;
}

export interface IHeroButtonSerialised {
    path: string;
    type: EnumHeroButtonType;
    name: string;
    meta: Record<string, any>;
    onClickHandler: string | null
}


export class HeroButton extends ValueObject<IHeroButtonProps> {
    public serialise(path: string): IHeroButtonSerialised {
        return {
            path,
            type: this.props.type,
            name: this.props.name,
            meta: this.props.meta,
            onClickHandler: this.props.onClickHandler
        }
    }
    public static deserialise(serialised: IHeroButtonSerialised): HeroButton {
        return new HeroButton({
            type: serialised.type,
            name: serialised.name,
            meta: serialised.meta,
            onClickHandler: serialised.onClickHandler,
        })
    }
    public static New(name: string): HeroButton {
        return new HeroButton({
            type: EnumHeroButtonType.PRIMARY,
            name: name,
            meta: {},
            onClickHandler: null
        })
    }

    public onClick(onHeroButtonClick: string): HeroButton {
        this.props.onClickHandler = onHeroButtonClick;
        return this;
    }
    public addMetaData(key: string, value: string): HeroButton {
        this.props.meta[key] = value;
        return this;
    }

    get onClickHandler(): string | null {
        return this.props.onClickHandler
    }
}