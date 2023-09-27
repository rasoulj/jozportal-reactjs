import React from 'react';
import {ConnectedRouter} from 'connected-react-router'
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';

import configureStore, {history} from './store';
//import './firebase/firebase';
import App from './containers/App';
import {runTest} from "./util";

export const store = configureStore();

// runTest();

const MainApp = () =>
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={App}/>
            </Switch>
        </ConnectedRouter>
    </Provider>;

export default MainApp;
