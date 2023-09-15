import { ValueObject } from "../../shared/domain/ValueObject";
import { HeroText, IHeroTextSerialised as IHeroTextSerialised } from "./HeroText";


type HeroInputMember = HeroText;
type HeroInputMemberSerialised = IHeroTextSerialised
export interface IHeroInputProps {
    members: {
        type: string;
        member: HeroInputMember
    }[];
}

export interface IHeroInputSerialized {
    path: string;
    members: {
        type: string;
        member: HeroInputMemberSerialised
    }[];
}



export class HeroInput extends ValueObject<IHeroInputProps> {
    public async serialise(): Promise<IHeroInputSerialized> {
        const members: {
            type: string;
            member: HeroInputMemberSerialised
        }[] = [];
        let index = 0;
        for (const member of this.props.members) {

            members.push({
                type: member.type,
                member: await member.member.serialise()
            });
            index += 1;
        }
        return { path: "", members }
    }

    public static deserialise(props: IHeroInputSerialized): HeroInput {
        const heroInputProps: IHeroInputProps = {
            members: []
        }
        for (const serialisedMember of props.members) {
            let heroInputMember: HeroInputMember | null = null;
            if (serialisedMember.type === "HeroText") {
                heroInputMember = HeroText.deserialise(serialisedMember.member);
            }
            if (heroInputMember) {
                heroInputProps.members.push({
                    type: serialisedMember.type,
                    member: heroInputMember
                });
            }
        }
        return new HeroInput(heroInputProps);
    }
    public static New(): HeroInput {
        return new HeroInput({
            members: [],
        })
    }

    public add(input: HeroInputMember) {
        this.props.members.push({
            type: input.type(),
            member: input
        });
    }

    public valueOf(name: string): string | undefined | null {
        const member = this.props.members.find((member) => {
            return member.member.name === name
        });
        return member?.member.value
    }

}