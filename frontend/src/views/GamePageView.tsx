import * as React from 'react';
import { observer } from 'mobx-react';

import Button from 'react-bootstrap/Button';

import { GamePageStore } from "../stores/GamePageStore"

import "../styles/GamePageStyle.scss"
import { GameCard } from './GameCard';

interface IProps {
    store: GamePageStore
}

@observer
export class GamePageView extends React.Component<IProps> {

    render() {
        let store = this.props.store
        if (store.isLoading) {
            return <h1>loading</h1>
        } else {
            return (
                <div className="game-page">
                    {store.isAudience ?
                    <div className="personal-area">
                        <h2>You are in the audience</h2>
                    </div>
                    :
                    <div className="personal-area">
                        <h2>Your initial card:</h2>
                        <p>{store.initialCharacter}</p>
                        <h2>Your tokens:</h2>
                        {store.tokens.map(token => <p>{token}</p>)}
                        <Button variant="primary"
                            onClick={ () => store.toggleThumb(store.playerCardNumber) }>
                                {store.isThumbOut ? "Hide Thumb" : "Stick Out Thumb" }
                        </Button>
                    </div>
                    }
                    {store.eyesClosed ? 
                        <div className="play-area">
                            <div className="eyes-closed">
                                <Button variant="danger" onClick={() => store.eyesClosed = false}>
                                    Open Eyes
                                </Button>
                            </div>
                        </div>
                    :
                        <div className="play-area">
                            <h1>Players</h1>
                            <div className="card-grid">
                                {store.gameState.players.map((player: any, i: number) => 
                                    (i < store.gameState.players.length - 3 ?
                                    <div className="player-area">
                                        <div className="player-name">
                                            {player.name + `(${i+1})` + (player.isThumbOut ? "👍" : "")}
                                        </div>
                                        <GameCard card={player.card} store={store} cardNumber={i}/>
                                    </div>
                                    :
                                    ""
                                    )
                                )}
                            </div>
                            <h1>Center Cards</h1>
                            <div className="card-grid">
                                {store.gameState.players.map((player: any, i: number) => 
                                    (i >= store.gameState.players.length - 3 ?
                                    <div className="player-area">
                                        <div className="player-name">{player.name}</div>
                                        <GameCard card={player.card} store={store} cardNumber={i}/>
                                    </div>
                                    :
                                    ""
                                    )
                                )}
                            </div>
                            <Button variant="danger" onClick={() => store.eyesClosed = true}>
                                Close Eyes
                            </Button>
                        </div>
                    }
                </div>
            )
        }
    }
}