import * as React from 'react';
import { observer } from 'mobx-react';

import { WelcomePageStore } from "../stores/WelcomePageStore"

import "../styles/WelcomePageStyle.scss"

interface IProps {
    store: WelcomePageStore
}

@observer
export class WelcomePageView extends React.Component<IProps> {

    render() {
        let store = this.props.store
        return (
            <div className="body">
                <div className="welcome-page">
                    
                </div>
            </div>
        )
    }
}