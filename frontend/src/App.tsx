import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { GamePageStore } from './stores/GamePageStore'
import { SetupPageStore } from './stores/SetupPageStore'
import { WelcomePageStore } from './stores/WelcomePageStore'

import { BasePageView } from './views/BasePageView';
import { GamePageView } from './views/GamePageView'
import { SetupPageView } from './views/SetupPageView'
import { WelcomePageView } from './views/WelcomePageView'


const App: React.FC = () => {
  return (
    <div className="App" style={{height: "100%", width: "100%" }}>
      <BasePageView>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Welcome</Link>
                </li>
                <li>
                  <Link to="/setup">Setup</Link>
                </li>
                <li>
                  <Link to="/game">Game</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/">
                <WelcomePageView store={WelcomePageStore} />
              </Route>
              <Route path="/setup">
                <SetupPageView store={SetupPageStore} />
              </Route>
              <Route path="/game">
                <GamePageView store={GamePageStore} />
              </Route>
            </Switch>
          </div>
        </Router>
      </BasePageView>
    </div>
  );
}

export default App;
