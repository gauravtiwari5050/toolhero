import { useContext } from 'react';
import { HeroToolContext, IHeroToolContext } from '../context/HeroToolContext';
import HeroTable from './HeroTable';

const HeroOutput = () => {
    const { state } = useContext<IHeroToolContext>(HeroToolContext);
    if (!state.output) {
        return null
    }
    return <div id={`hero-output`}>
        {state.output.members.map((member) => {
            switch (member.type) {
                case 'HeroTable': return <HeroTable table={member.member} />; break;
                default: return <div></div>
            }
        })}

    </div>
};

export default HeroOutput;