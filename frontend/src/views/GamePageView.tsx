import * as React from 'react';
import { observer } from 'mobx-react';

import { GamePageStore } from "../stores/GamePageStore"

import "../styles/GamePageStyle.scss"

interface IProps {
    store: GamePageStore
}

@observer
export class GamePageView extends React.Component<IProps> {

    render() {
        let store = this.props.store
        return (
            <div className="body">
                <div className="game-page">

                </div>
            </div>
        )
    }
}