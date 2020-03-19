import * as React from 'react';
import { observer } from 'mobx-react';

import Button from 'react-bootstrap/Button'

import { WelcomePageStore } from "../stores/WelcomePageStore"

import "../styles/WelcomePageStyle.scss"

interface IProps {
    store: WelcomePageStore
}

@observer
export class WelcomePageView extends React.Component<IProps> {

    render() {
        let store = this.props.store
        return (
            <div className="welcome-page">
                Code
                <input type="text" value={store.code} onChange={store.handleCodeChange.bind(store)} />
                Name
                <input type="text" value={store.name} onChange={store.handleNameChange.bind(store)} />
                <span className="button-bar">
                    <Button disabled={store.name.length === 0} onClick={store.newGame.bind(store)} variant="primary">New Game</Button>
                    <Button disabled={!store.name || store.code.length !== 4} onClick={store.joinGame.bind(store)} variant="primary">Join Game</Button>
                </span>
            </div>
        )
    }
}