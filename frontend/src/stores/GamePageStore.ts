import { computed, observable, action } from "mobx";

export class GamePageStore {

    constructor(initializer: Partial<GamePageStore>) {
        Object.assign(this, initializer);
    }


}
