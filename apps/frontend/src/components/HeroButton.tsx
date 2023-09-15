import { IHeroButtonSerialised } from 'toolhero/src/main/valueObjects/HeroButton';
import { ApiClient } from '../client/ApiClient';
import { useContext } from 'react';
import { EnumHeroToolAction, HeroToolContext, IHeroToolContext } from '../context/HeroToolContext';

const HeroButton = ({ button }: { button: IHeroButtonSerialised }) => {
    const { dispatch, state } = useContext<IHeroToolContext>(HeroToolContext);
    return (
        <div onClick={async () => {
            if (!state.tool) {
                return;
            }
            console.log(button);
            const apiClient = new ApiClient();
            const responseOrError = await apiClient.onButtonClick(state?.tool, button);
            if (responseOrError.isFailure) {
                console.error(responseOrError.error);
                alert('Something went wrong');
            }
            const response = responseOrError.getValue();
            dispatch({
                type: EnumHeroToolAction.UPDATE_HERO_FUNCTION_OUTPUT,
                payload: {
                    heroFunctionOutput: response
                }
            })

        }}>
            <button className="btn btn-primary btn-sm">{button.name}</button>
        </div>
    );
};

export default HeroButton;