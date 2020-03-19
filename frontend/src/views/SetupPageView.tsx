import * as React from 'react';
import { observer } from 'mobx-react';

import { SetupPageStore } from "../stores/SetupPageStore"

import "../styles/SetupPageStyle.scss"

interface IProps {
    store: SetupPageStore
}

@observer
export class SetupPageView extends React.Component<IProps> {

    render() {
        let store = this.props.store
        return (
            <div className="body">
                <div className="setup-page">

                </div>
            </div>
        )
    }
}