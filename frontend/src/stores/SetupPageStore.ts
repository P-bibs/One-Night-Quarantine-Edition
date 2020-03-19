import { computed, observable, action } from "mobx";

export class SetupPageStore {

    constructor(initializer: Partial<SetupPageStore>) {
        Object.assign(this, initializer);
    }


}
