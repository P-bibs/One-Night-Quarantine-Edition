import { computed, observable, action } from "mobx";
import { act } from "react-dom/test-utils";

export class WelcomePageStore {

    constructor(initializer: Partial<WelcomePageStore>) {
        Object.assign(this, initializer);
    }

    @observable
    public name: String = "";

    @action
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.name = event.target.value;
    }
}
