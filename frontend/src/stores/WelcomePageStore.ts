import { computed, observable, action } from "mobx";

export class WelcomePageStore {

    constructor(initializer: Partial<WelcomePageStore>) {
        Object.assign(this, initializer);
    }

    @observable
    public code: string = "";

    @observable
    public name: string = "";

    @action
    handleCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.code = event.target.value;
    }
    @action
    handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.name = event.target.value;
    }

    @action
    newGame() {
        if (this.name !== "") {
            window.location.href = `/setup?name=${this.name}`
        }
    }

    @action
    joinGame() {
        if (this.code.length === 4 && this.name) {
            window.location.href = `/setup?name=${this.name}&code=${this.code}`
        }
    }
}
