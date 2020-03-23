import React from 'react';

import { GamePageStore } from './stores/GamePageStore'
import { SetupPageStore } from './stores/SetupPageStore'
import { WelcomePageStore } from './stores/WelcomePageStore'

import "./index.css"

import { BasePageView } from './views/BasePageView';
import { GamePageView } from './views/GamePageView'
import { SetupPageView } from './views/SetupPageView'
import { WelcomePageView } from './views/WelcomePageView'


const App: React.FC = () => {
  let url = new URL(window.location.href)
  let body;
  if (url.pathname === "/") {
    body = <WelcomePageView store={new WelcomePageStore({})} />
  } else if (url.pathname === "/setup") {
    body = <SetupPageView store={new SetupPageStore({})} />
  } else if (url.pathname === "/game") {
    body = <GamePageView store={new GamePageStore({})} />
  }
           
  return (
    <div className="App" style={{height: "100%", width: "100%" }}>
      <BasePageView>
        {body}
      </BasePageView>
    </div>
  );
}

export default App;
