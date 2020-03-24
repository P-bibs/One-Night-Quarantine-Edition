import * as React from 'react';
import { observer } from 'mobx-react';

import { MdSwapHoriz, MdSearch, MdSecurity, MdLens } from 'react-icons/md'
import { FaHighlighter } from 'react-icons/fa'
import { IoIosArrowDropdownCircle } from 'react-icons/io'

import { GamePageStore } from '../stores/GamePageStore';

import "../styles/GamePageStyle.scss"

import background from '../assets/background.jpg'

import alien from '../assets/alien.jpg'
import alpha_wolf from '../assets/alpha_wolf.jpg'
import apprentice_seer from '../assets/apprentice_seer.jpg'
import blob from '../assets/blob.jpg'
import bodyguard from '../assets/bodyguard.jpg'
import cow from '../assets/cow.jpg'
import curator from '../assets/curator.jpg'
import doppelganger from '../assets/doppelganger.jpg'
import dream_wolf from '../assets/dream_wolf.jpg'
import drunk from '../assets/drunk.jpg'
import exposer from '../assets/exposer.jpg'
import groob from '../assets/groob.jpg'
import hunter from '../assets/hunter.jpg'
import insomniac from '../assets/insomniac.jpg'
import leader from '../assets/leader.jpg'
import mason from '../assets/mason.jpg'
import mortician from '../assets/mortician.jpg'
import mystic_wolf from '../assets/mystic_wolf.jpg'
import pi from '../assets/pi.jpg'
import psychic from '../assets/psychic.jpg'
import rascal from '../assets/rascal.jpg'
import revealer from '../assets/revealer.jpg'
import robber from '../assets/robber.jpg'
import seer from '../assets/seer.jpg'
import sentinel from '../assets/sentinel.jpg'
import synthetic_alien from '../assets/synthetic_alien.jpg'
import tanner from '../assets/tanner.jpg'
import troublemaker from '../assets/troublemaker.jpg'
import village_idiot from '../assets/village_idiot.jpg'
import villager from '../assets/villager.jpg'
import werewolf from '../assets/werewolf.jpg'
import witch from '../assets/witch.jpg'
import zerb from '../assets/zerb.jpg'

interface IProps {
    card: any
    cardNumber: number
    store: GamePageStore
}

@observer
export class GameCard extends React.Component<IProps> {

    render() {
        let card = this.props.card
        let store = this.props.store
        let image;
        if (card.character == "Alien 1") { image = alien}
        else if (card.character == "Alien 2") { image = alien}
        else if (this.props.card.character === "Alpha Wolf") { image = alpha_wolf}
        else if (this.props.card.character === "Apprentice Seer") { image = apprentice_seer}
        else if (this.props.card.character === "Blob") { image = blob}
        else if (this.props.card.character === "Bodyguard") { image = bodyguard}
        else if (this.props.card.character === "Cow") { image = cow}
        else if (this.props.card.character === "Curator") { image = curator}
        else if (this.props.card.character === "Doppelganger") { image = doppelganger}
        else if (this.props.card.character === "Dream Wolf") { image = dream_wolf}
        else if (this.props.card.character === "Drunk") { image = drunk}
        else if (this.props.card.character === "Exposer") { image = exposer}
        else if (this.props.card.character === "Groob") { image = groob}
        else if (this.props.card.character === "Hunter") { image = hunter}
        else if (this.props.card.character === "Insomniac") { image = insomniac}
        else if (this.props.card.character === "Leader") { image = leader}
        else if (this.props.card.character === "Mason 1") { image = mason}
        else if (this.props.card.character === "Mason 2") { image = mason}
        else if (this.props.card.character === "Mortician") { image = mortician}
        else if (this.props.card.character === "Mystic Wolf") { image = mystic_wolf}
        else if (this.props.card.character === "P.I.") { image = pi}
        else if (this.props.card.character === "Psychic") { image = psychic}
        else if (this.props.card.character === "Rascal") { image = rascal}
        else if (this.props.card.character === "Revealer") { image = revealer}
        else if (this.props.card.character === "Robber") { image = robber}
        else if (this.props.card.character === "Seer") { image = seer}
        else if (this.props.card.character === "Sentinel") { image = sentinel}
        else if (this.props.card.character === "Synthetic Alien") { image = synthetic_alien}
        else if (this.props.card.character === "Tanner") { image = tanner}
        else if (this.props.card.character === "Troublemaker") { image = troublemaker}
        else if (this.props.card.character === "Village Idiot") { image = village_idiot}
        else if (this.props.card.character === "Villager 1") { image = villager}
        else if (this.props.card.character === "Villager 2") { image = villager}
        else if (this.props.card.character === "Villager 3") { image = villager}
        else if (this.props.card.character === "Werewolf 1") { image = werewolf}
        else if (this.props.card.character === "Werewolf 2") { image = werewolf}
        else if (this.props.card.character === "Witch") { image = witch}
        else if (this.props.card.character === "Zerb") { image = zerb}
        
        let card_tag;
        let isHighlighted = card.isHighlighted ? " highlighted" : ""
        if (card.isExposed) {
            card_tag = <img className={"card" + isHighlighted} src={image} />
        } else {
            card_tag = <img className={"card" + isHighlighted} src={background} />
        }

        return (
            <div className="card-area">
                {card_tag}
                <div className="button-bar">
                    <div className="icon-button"
                        style={{transform: store.dropdownCardNumber === this.props.cardNumber ? "rotate(180deg)" : ""}}
                        onClick={() => store.createDropdown(this.props.cardNumber)}>
                        <IoIosArrowDropdownCircle />
                    </div>
                    {store.dropdownCardNumber === this.props.cardNumber ? 
                    <div style={{position: "relative", width: "0px", height: "0px"}}>
                        <div className="dropdown-list">
                            <div className="dropdown-entry"
                                onClick={() => store.swapCards(this.props.cardNumber)}>
                                {!(store.currentlySwapping == null) ? `Swap with ${store.gameState.players[store.currentlySwapping].name}` : "Swap"}
                            </div>
                            <div className="dropdown-entry"
                                onClick={() => store.togglePeekCard(this.props.cardNumber)}>
                                Peek
                            </div>
                            <div className="dropdown-entry"
                                onClick={() => store.toggleHighlight(this.props.cardNumber)}>
                                Highlight
                            </div>
                            <div className="dropdown-entry"
                                onClick={() => store.giveToken(this.props.cardNumber, "shield")}>
                                Give Shield Token
                            </div>
                            <div className="dropdown-entry"
                                onClick={() => store.giveToken(this.props.cardNumber, "random")}>
                                Give Artifact
                            </div>
                        </div>
                    </div>
                    :
                    ""
                    }
                    {card.tokens.map((tokenName: any) => 
                        <div className="token">
                            {tokenName === "shield" ? <MdSecurity /> : ""}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}