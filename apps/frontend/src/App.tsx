import './App.css'
import Navigation from "./components/Navigation"
import HeroTool from './components/HeroTool'
import { IHeroToolSerialised } from 'toolhero/src/main/valueObjects/HeroTool';
import { HeroToolContext, HeroToolStateReducer } from './context/HeroToolContext';
import React from 'react';
declare global {
  interface Window { TOOL: IHeroToolSerialised; }
}

function App() {
  const [heroToolState, heroToolDispatch] = React.useReducer(HeroToolStateReducer, {
    tool: window.TOOL,
    output: null,
    toolRunStatus: "IDLE"
  });

  return (
    <>
      <div className="mx-auto max-w-7xl sm:py-0 lg:py-4">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-4xl">{/* Content goes here */}
          <Navigation></Navigation>
          <div className="overflow-hidden rounded-sm bg-gray-200 border-t-[16px] border-gray-600 my-4">
            <HeroToolContext.Provider value={{ state: heroToolState, dispatch: heroToolDispatch }}>
              <HeroTool />
            </HeroToolContext.Provider>
          </div>
        </div>
      </div>

    </>
  )
}

export default App
