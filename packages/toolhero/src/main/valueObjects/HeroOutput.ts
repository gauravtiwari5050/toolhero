import { ValueObject } from "../../shared/domain/ValueObject";
import { HeroButton, IHeroButtonSerialised } from "./HeroButton";
import { HeroLink, IHeroLinkSerialised } from "./HeroLink";
import { HeroTable, IHeroTableSerialised } from "./HeroTable";


type HeroOutputMember = HeroTable | HeroButton | HeroLink;
type HeroOutputMemberSerialised = IHeroTableSerialised | IHeroButtonSerialised | IHeroLinkSerialised;
export interface IHeroOutputProps {
    members: {
        type: string;
        member: HeroOutputMember
    }[];
}

export interface IHeroOutputSerialized {
    path: string;
    members: {
        type: string;
        member: HeroOutputMemberSerialised
    }[];
}



export class HeroOutput extends ValueObject<IHeroOutputProps> {
    public serialise(path: string): IHeroOutputSerialized {
        const members: {
            type: string;
            member: HeroOutputMemberSerialised
        }[] = [];
        this.props.members.map((member, index) => {
            members.push({
                type: member.type,
                member: member.member.serialise(`${path}-members-${index}-member`)
            });
        })
        return { members, path }
    }

    public static New(): HeroOutput {
        return new HeroOutput({
            members: [],
        })
    }

    public add(input: HeroOutputMember) {
        this.props.members.push({
            type: input.type(),
            member: input
        });
    }

}