import { useContext } from 'react';
import { EnumHeroToolAction, HeroToolContext, IHeroToolContext } from '../context/HeroToolContext';
import { ApiClient } from '../client/ApiClient';

const RunTool = () => {
    const { dispatch, state } = useContext<IHeroToolContext>(HeroToolContext);
    const ctaMap = {
        IDLE: "Run",
        ERROR: "Something went wrong. Please try again",
        SUCCESS: "Run again",
        PROCESSING: "Running ..."
    }
    return (
        <button className="btn btn-primary" onClick={async () => {
            if (state?.tool) {
                if (state.toolRunStatus === "PROCESSING") {
                    return
                }
                dispatch({
                    type: EnumHeroToolAction.UPDATE_TOOL_RUN_STATUS,
                    payload: {
                        toolRunStatus: "PROCESSING"
                    }
                })
                dispatch({
                    type: EnumHeroToolAction.SET_HERO_OUTPUT,
                    payload: {
                        heroOutput: undefined
                    }
                })
                const apiClient = new ApiClient();
                const responseOrError = await apiClient.runTool(state?.tool);
                if (responseOrError.isFailure) {
                    return dispatch({
                        type: EnumHeroToolAction.UPDATE_TOOL_RUN_STATUS,
                        payload: {
                            toolRunStatus: "ERROR"
                        }
                    })
                }

                dispatch({
                    type: EnumHeroToolAction.SET_HERO_OUTPUT,
                    payload: {
                        heroOutput: responseOrError.getValue()
                    }
                })

                dispatch({
                    type: EnumHeroToolAction.UPDATE_TOOL_RUN_STATUS,
                    payload: {
                        toolRunStatus: "SUCCESS"
                    }
                })


            }

        }}>{ctaMap[state.toolRunStatus]}</button>
    );
};

export default RunTool;