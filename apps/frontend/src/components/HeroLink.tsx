import { IHeroLinkSerialised } from 'toolhero/src/main/valueObjects/HeroLink';

const HeroLink = ({ link }: { link: IHeroLinkSerialised }) => {
    return (
        <div>
            {

                link.to && <a target="_blank" className="link-primary" href={link.to}>{link.name}</a>
            }
            {

                !link.to && <p>{link.name}</p>
            }
        </div>
    );
};

export default HeroLink;