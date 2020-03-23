import { computed, observable, action } from "mobx";
import { DO_DEPLOY } from '../environmentVariables'
const DEBUG = false;
export class SetupPageStore {

    constructor(initializer: Partial<SetupPageStore>) {
        Object.assign(this, initializer);
        let url = new URL(window.location.href)
        let code = url.searchParams.get("code")
        this.name = url.searchParams.get("name") as string
        if (code == null) {
            let characters = "qwertyuiopasdfghjklzxcvbnm123456789"
            this.code = "" + characters[Math.floor(Math.random() * 35)] + characters[Math.floor(Math.random() * 35)] + characters[Math.floor(Math.random() * 35)] + characters[Math.floor(Math.random() * 35)]
        } else {
            this.code = code

        }

        if (DEBUG) {
            this.gameState = {
                players: [{name: "paul"}, {name: "zack"}, {name: "logan"}, {name: "harry"}, {name: "benny"}],
                characters: []
            }
            return
        }
        if (DO_DEPLOY) {
            console.log(`wss://${url.hostname}/OneNight/data?code=${this.code}`)
            this.socket = new WebSocket(`wss://${url.hostname}/OneNight/data?code=${this.code}`)
        } else {
            console.log(`ws://${url.hostname}:8080/data?code=${this.code}`)
            this.socket = new WebSocket(`ws://${url.hostname}:8080/data?code=${this.code}`)
        }
        this.socket.onopen = (event) => {
            this.sendMessage({
                message_type: "control",
                message_subtype: "introduction",
                data: this.name
            })
        }
        this.socket.onmessage = (event) => {
            let message = JSON.parse(event.data);
            if (message.message_type == "game_state_update") {
                this.gameState = message.data;
            }
            if (this.gameState.state === "game") {
                let newUrl = new URL(window.location.href)
                this.socket.close()
                newUrl.pathname = DO_DEPLOY ? '/OneNight/game' : '/game'
                newUrl.search = `name=${this.name}&code=${this.code}`
                window.location.href = newUrl.href
            }
            console.log("Recieved initial game state")
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

    readonly characters: string[][] = [
        [ "Doppelganger", "Werewolf 1", "Werewolf 2", "Minion", "Mason 1", "Mason 2", "Seer", "Robber", "Troublemaker", "Drunk", "Insomniac", "Villager 1", "Villager 2", "Villager 3", "Hunter", "Tanner" ],
        [ "Sentinel", "Alpha Wolf", "Mystic Wolf", "Apprentice Seer", "P.I.", "Witch", "Village Idiot", "Revealer", "Curator", "Dream Wolf", "Bodyguard"],
        ["Oracle", "Alien 1", "Alien 2", "Synthetic Alien", "Cow", "Groob", "Zerb", "Leader", "Psychic", "Rascal", "Exposer", "Blob", "Mortician"]
    ]
    readonly characterGroupLabels: string[] = [
        "Werewolf",
        "Daybreak",
        "Alien"
    ]

    @action
    toggleCharacter(characterName: string) {
        if (this.gameState.characters_enabled.flat().includes(characterName)) {
            this.sendMessage({
                message_type: "character_select",
                action_type: "remove",
                data: characterName
            })
        } else {
            this.sendMessage({
                message_type: "character_select",
                action_type: "add",
                data: characterName
            })
        }
    }

    @action
    beginGame() {
        this.sendMessage({
            message_type: "control",
            message_subtype: "begin_game"
        })
    }

    @action
    sendMessage(message: any) {
        this.socket.send(JSON.stringify(message))
    }

}
