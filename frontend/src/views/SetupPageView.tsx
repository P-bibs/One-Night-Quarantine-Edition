import * as React from 'react';
import { observer } from 'mobx-react';

import Button from 'react-bootstrap/Button';


import { SetupPageStore } from "../stores/SetupPageStore"

import "../styles/SetupPageStyle.scss"

interface IProps {
    store: SetupPageStore
}

@observer
export class SetupPageView extends React.Component<IProps> {

    render() {
        let store = this.props.store
        if (store.isLoading) {
            return <div>loading</div>
        } else {
            return (
                <div className="setup-page">
                    <h1>Code: <em>{store.code}</em></h1>
                    <div className="players">
                        <h1>Players</h1>
                        {store.gameState.players.map((player: any) => 
                            <div className="player">{player.name}</div>
                        )}
                    </div>
                    <h1>Characters</h1>
                    <div className="characters">
                        {store.characters.map((characterSet, i) => 
                            <div className="character-set" key={store.characterGroupLabels[i]}>
                                <h2>{store.characterGroupLabels[i]}</h2>
    
                                <div className="character-tile-grid">
                                    {characterSet.map(characterName =>
                                        <div className="character-tile" key={characterName} onClick={(() => store.toggleCharacter(characterName))}>
                                            <div>{characterName}</div>
                                            <div>{store.gameState.characters_enabled.includes(characterName) ? "☒" : "☐"} </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <Button
                        disabled={store.gameState.players.length !== store.gameState.characters_enabled.length - 3}
                        onClick={store.beginGame.bind(store)}
                        variant="primary">
                            Begin Game
                    </Button>
                </div>
            )
        }
        
    }
}