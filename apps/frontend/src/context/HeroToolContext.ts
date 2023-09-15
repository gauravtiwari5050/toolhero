import React from 'react';
import lodashSet from "lodash.set"
import { HeroFunctionOutputSerialised } from 'toolhero/src/main/valueObjects/HeroFunctions';
import { IHeroOutputSerialized } from 'toolhero/src/main/valueObjects/HeroOutput';
import { IHeroTextSerialised } from 'toolhero/src/main/valueObjects/HeroText';
import { IHeroToolSerialised } from 'toolhero/src/main/valueObjects/HeroTool';
export enum EnumHeroToolAction {
    UPDATE_HERO_TEXT = "UPDATE_HERO_TEXT",
    SET_HERO_OUTPUT = "SET_HERO_OUTPUT",
    UPDATE_TOOL_RUN_STATUS = "UPDATE_TOOL_RUN_STATUS",
    UPDATE_HERO_FUNCTION_OUTPUT = "UPDATE_HERO_FUNCTION_OUTPUT"
}

export interface IHeroToolStateActionPayload {
    heroText?: IHeroTextSerialised;
    heroOutput?: IHeroOutputSerialized;
    toolRunStatus?: "IDLE" | "ERROR" | "SUCCESS" | "PROCESSING";
    heroFunctionOutput?: HeroFunctionOutputSerialised;
}
export interface IHeroToolStateAction {
    type: EnumHeroToolAction;
    payload: IHeroToolStateActionPayload
}
export interface IHeroToolState {
    tool?: IHeroToolSerialised | null;
    output: IHeroOutputSerialized | null;
    toolRunStatus: "IDLE" | "ERROR" | "SUCCESS" | "PROCESSING"
}
export interface IHeroToolContext {
    state: IHeroToolState,
    dispatch: React.Dispatch<IHeroToolStateAction>;
}

const reducers: Record<
    EnumHeroToolAction,
    (state: IHeroToolState, payload: IHeroToolStateActionPayload) => IHeroToolState
> = {
    [EnumHeroToolAction.UPDATE_HERO_TEXT]: (state: IHeroToolState, _payload: IHeroToolStateActionPayload): IHeroToolState => {
        const heroTextMember = state.tool?.input.members.find((member) => {
            return member.type === "HeroText" && member.member.name === _payload.heroText?.name;
        });
        if (heroTextMember) {
            heroTextMember.member.value = _payload.heroText?.value as string;
        }

        return state;
    },
    [EnumHeroToolAction.SET_HERO_OUTPUT]: function (state: IHeroToolState, payload: IHeroToolStateActionPayload): IHeroToolState {
        if (payload.heroOutput) {
            state.output = payload.heroOutput;
        }

        return state;
    },
    [EnumHeroToolAction.UPDATE_TOOL_RUN_STATUS]: function (state: IHeroToolState, payload: IHeroToolStateActionPayload): IHeroToolState {
        if (payload.toolRunStatus) {
            state.toolRunStatus = payload.toolRunStatus;
        }
        return state;
    },
    [EnumHeroToolAction.UPDATE_HERO_FUNCTION_OUTPUT]: function (state: IHeroToolState, payload: IHeroToolStateActionPayload): IHeroToolState {
        if (!payload.heroFunctionOutput) {
            return state
        }
        if (payload.heroFunctionOutput.type === 'void') {
            return state
        }
        if (payload.heroFunctionOutput.type === 'HeroButton') {
            const path = payload.heroFunctionOutput.button?.path as string
            if (!path) {
                return state;
            }
            const pathWithDots = path.replace(/-/g, '.') + '.value';
            lodashSet(state, pathWithDots, payload.heroFunctionOutput.button)
            return { ...state };
        }
        return state
    }
}

export const HeroToolStateReducer = (
    state: IHeroToolState,
    action: IHeroToolStateAction
): IHeroToolState => {
    const { type, payload } = action;
    const updatedState = reducers[type](state, payload);
    return { ...updatedState };
};
export const HeroToolContext = React.createContext<IHeroToolContext>({
    state: {
        tool: null,
        output: null,
        toolRunStatus: "IDLE"
    },
    dispatch: () => undefined
})