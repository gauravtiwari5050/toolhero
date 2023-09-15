
import { useContext } from 'react';
import { IHeroTextSerialised } from 'toolhero/src/main/valueObjects/HeroText';
import { EnumHeroToolAction, HeroToolContext, IHeroToolContext } from '../context/HeroToolContext';

const HeroText = (props: { text: IHeroTextSerialised }) => {
    const { dispatch } = useContext<IHeroToolContext>(HeroToolContext);
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.text.name}>
                {props.text.name}
            </label>
            <input value={props.text.value || ""} onChange={(e) => {
                dispatch({
                    type: EnumHeroToolAction.UPDATE_HERO_TEXT,
                    payload: {
                        heroText: {
                            ...props.text,
                            value: e.target.value
                        }
                    }
                })
            }} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Username" />
        </div>
    );
};

export default HeroText;