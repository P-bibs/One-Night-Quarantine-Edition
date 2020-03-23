import { observable, action } from "mobx";
import { DO_DEPLOY } from '../environmentVariables'

const DEBUG = false;
export class GamePageStore {

    constructor(initializer: Partial<GamePageStore>) {
        Object.assign(this, initializer);

        let url = new URL(window.location.href)
        this.code = url.searchParams.get("code") as string
        this.name = url.searchParams.get("name") as string

        if (DEBUG) {
            this.gameState = {
                players: [{name: "paul"}, {name: "zack"}, {name: "logan"}, {name: "harry"}, {name: "benny"}],
                characters: []
            }
            return
        }
        if (DO_DEPLOY) {
            console.log(`attempting to connect to ws://${url.hostname}/OneNight/data?code=${this.code}`)
            this.socket = new WebSocket(`ws://${url.hostname}/OneNight/data?code=${this.code}`)
        } else{
            console.log(`attempting to connect to ws://${url.hostname}:8080/data?code=${this.code}`)
            this.socket = new WebSocket(`ws://${url.hostname}:8080/data?code=${this.code}`)

        }
        
        this.socket.onopen = (event) => {
            this.sendMessage({
                message_type: "control",
                message_subtype: "noOp",
            })
        }
        this.socket.onmessage = (event) => {
            let message = JSON.parse(event.data);
            // Update game state
            if (message.message_type == "game_state_update") {
                this.gameState = message.data;
            }

            if (this.gameState.state === "setup") {
                let newUrl = new URL(window.location.href)
                this.socket.close()
                newUrl.pathname = DO_DEPLOY ? '/OneNight/setup' : '/setup'
                newUrl.search = `name=${this.name}&code=${this.code}`
                window.location.href = newUrl.href
            }

            // Set whether or not this player is in audience
            if (this.gameState.players.filter((x: any) => x.name === this.name).length === 0) {
                this.isAudience = true;
            } else {
                this.isAudience = false;
            }

            if (!this.isAudience) {
                this.playerCardNumber = this.gameState.players.findIndex((x: any) => x.name === this.name)
                // Set initial character
                if (!this.initialCharacter) {
                    this.initialCharacter = this.gameState.players.filter((x: any) => x.name === this.name)[0].card.character
                }
                // Set tokens
                this.tokens = this.gameState.players[this.playerCardNumber].card.tokens

                this.isThumbOut = this.gameState.players[this.playerCardNumber].isThumbOut
            }
            

            console.log("Received initial game state")
            console.log(message)
            this.isLoading = false;
        }
    }

    readonly socket: WebSocket;

    @observable
    public name: string;

    @observable
    public code: string;

    @observable
    public gameState: any = {}

    @observable
    public isLoading: boolean = true;

    @observable
    public playerCardNumber: number;

    @observable
    public isAudience: boolean;

    @observable
    public isThumbOut: boolean;

    @observable
    public eyesClosed: boolean = false;

    @observable
    public initialCharacter: string;

    @observable
    public tokens: string[];
    
    @observable
    public currentlySwapping: number | null = null;

    @observable
    public dropdownCardNumber: number = -1;

    @action
    swapCards(cardNumber: number) {
        if (this.currentlySwapping === null) {
            this.currentlySwapping = cardNumber
        } else {
            this.sendMessage({
                message_type: "card_action",
                message_subtype: "swap",
                data: [this.currentlySwapping, cardNumber]
            });
            this.currentlySwapping = null;
        }
        this.createDropdown(-1)
    }

    @action
    togglePeekCard(cardNumber: number) {
        if (this.gameState.players[cardNumber].card.isExposed) {
            this.sendMessage({
                message_type: "card_action",
                message_subtype: "peek",
                action_type: "hide",
                data: cardNumber
            })
        } else {
            this.sendMessage({
                message_type: "card_action",
                message_subtype: "peek",
                action_type: "reveal",
                data: cardNumber
            })
        }
        this.createDropdown(-1)
    }

    @action
    toggleHighlight(cardNumber: number) {
        if (this.gameState.players[cardNumber].card.isHighlighted) {
            this.sendMessage({
                message_type: "card_action",
                message_subtype: "highlight",
                action_type: "unselect",
                data: cardNumber
            })
        } else {
            this.sendMessage({
                message_type: "card_action",
                message_subtype: "highlight",
                action_type: "select",
                data: cardNumber
            })
        }
        this.createDropdown(-1)
    }

    @action
    giveToken(cardNumber: number, token_type: string) {
        this.sendMessage({
            message_type: "player_action",
            message_subtype: "token",
            action_type: token_type,
            data: cardNumber
        })
        this.createDropdown(-1)
    }

    @action
    toggleThumb(cardNumber: number) {
        if (this.isThumbOut) {
            this.sendMessage({
                message_type: "player_action",
                message_subtype: "thumb",
                action_type: "hide",
                data: cardNumber
            })
        } else {
            this.sendMessage({
                message_type: "player_action",
                message_subtype: "thumb",
                action_type: "stick_out",
                data: cardNumber
            })
        }
    }

    @action
    createDropdown(cardNumber: number) {
        console.log("Creating dropdown")
        console.log(cardNumber)
        console.log(this.dropdownCardNumber)
        if (cardNumber === -1 || cardNumber === this.dropdownCardNumber) {
            this.dropdownCardNumber = -1
        } else {
            this.dropdownCardNumber = cardNumber
        }
    }

    @action
    restartGame() {
        this.sendMessage({
            message_type: "control",
            message_subtype: "restart_game"
        })
    }

    @action
    sendMessage(message: any) {
        console.log("Sending message")
        console.log(message)
        this.socket.send(JSON.stringify(message))
    }

}
