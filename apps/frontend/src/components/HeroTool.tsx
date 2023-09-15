import HeroText from "./HeroText";
import { useContext } from "react";
import { HeroToolContext, IHeroToolContext } from "../context/HeroToolContext";
import RunTool from "./RunTool";
import HeroOutput from "./HeroOutput";

const HeroTool = () => {
    const { state } = useContext<IHeroToolContext>(HeroToolContext);
    return (
        <>
            <div className="py-4 px-4 bg-gray-300 mb-4">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {state.tool?.name}
                </h2>
            </div>
            <div className="px-4">
                {
                    state.tool?.input.members.map((member) => {
                        if (member.type === "HeroText") {
                            return <HeroText text={member.member} />
                        }
                        return <div />
                    })
                }
            </div>
            <div className="px-4 py-4">
                <RunTool></RunTool>
            </div>
            <div className="px-4 py-4">
                <HeroOutput />
            </div>
        </>
    );
};

export default HeroTool;