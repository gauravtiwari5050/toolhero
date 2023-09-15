import { IHeroButtonSerialised } from "./HeroButton";

export interface HeroUIEvent {
    source: {
        button?: IHeroButtonSerialised
    }
}
export interface HeroExecutionContext {
    event?: HeroUIEvent;
}
