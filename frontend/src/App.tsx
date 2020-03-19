import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { GamePageStore } from './stores/GamePageStore'
import { SetupPageStore } from './stores/SetupPageStore'
import { WelcomePageStore } from './stores/WelcomePageStore'

import "./index.css"

import { BasePageView } from './views/BasePageView';
import { GamePageView } from './views/GamePageView'
import { SetupPageView } from './views/SetupPageView'
import { WelcomePageView } from './views/WelcomePageView'


const App: React.FC = () => {
  return (
    <div className="App" style={{height: "100%", width: "100%" }}>
      <BasePageView>
        <Router>
            <Switch>
              <Route path="/">
                <WelcomePageView store={new WelcomePageStore({})} />
              </Route>
              <Route path="/setup">
                <SetupPageView store={new SetupPageStore({})} />
              </Route>
              <Route path="/game">
                <GamePageView store={new GamePageStore({})} />
              </Route>
            </Switch>
        </Router>
      </BasePageView>
    </div>
  );
}

export default App;
