import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import asyncComponent from '../../util/asyncComponent';

const Routes = ({match}) => {


    const {url} = match;
    return <Switch>
        <Route path={`${url}/sample-page`} component={asyncComponent(() => import('./SamplePage'))}/>
        <Route path={`${url}/home`} component={asyncComponent(() => import('./Home'))}/>
        <Route path={`${url}/about-us`} component={asyncComponent(() => import('./AboutUs'))}/>
        <Route path={`${url}/transaction-fee`} component={asyncComponent(() => import('./TransactionFee'))}/>
        <Route path={`${url}/orders`} component={asyncComponent(() => import('./Orders'))}/>
        <Route path={`${url}/wallet/transactions`} component={asyncComponent(() => import('./Wallet/Transactions'))}/>
        <Route path={`${url}/wallet/:cur/:amount`} component={asyncComponent(() => import('./Wallet/CurrencyView'))}/>
        <Route path={`${url}/wallet`} component={asyncComponent(() => import('./Wallet'))}/>
        <Route path={`${url}/rates/history`} component={asyncComponent(() => import('./Rates/History'))}/>
        <Route path={`${url}/rates`} component={asyncComponent(() => import('./Rates'))}/>
        <Route path={`${url}/agency-rates`} component={asyncComponent(() => import('./Rates/AgencyRates'))}/>
        <Route path={`${url}/statement`} component={asyncComponent(() => import('./Statement'))}/>
        <Route path={`${url}/customer-management/:uid`} component={asyncComponent(() => import('./CustomerManagement/CustomerView'))}/>
        <Route path={`${url}/customer-management`} component={asyncComponent(() => import('./CustomerManagement'))}/>
        <Route path={`${url}/agent-management/:uid`} component={asyncComponent(() => import('./CustomerManagement/CustomerView'))}/>
        <Route path={`${url}/agent-management`} component={asyncComponent(() => import('./AgentManagement'))}/>
        <Route path={`${url}/branch-settings`} component={asyncComponent(() => import('./Settings/branch'))}/>
        <Route path={`${url}/agency-settings`} component={asyncComponent(() => import('./Settings/agency'))}/>
        <Route path={`${url}/agent-settings`} component={asyncComponent(() => import('./Settings/agent'))}/>
        <Route path={`${url}/not-implemented`} component={asyncComponent(() => import('./NotImpl'))}/>
        <Route path={`${url}/branch-management/:bid/:uid`} component={asyncComponent(() => import('./CustomerManagement/CustomerView'))}/>
        <Route path={`${url}/branch-management/:bid`} component={asyncComponent(() => import('./BranchManagement/ViewBranch'))}/>
        <Route path={`${url}/branch-management`} component={asyncComponent(() => import('./BranchManagement'))}/>
        <Route path={`${url}/services/transfer`} component={asyncComponent(() => import('./Services/transfer'))}/>
        <Route path={`${url}/services/exchange`} component={asyncComponent(() => import('./Services/exchange'))}/>
        <Route path={`${url}/services/:type`} component={asyncComponent(() => import('./Services/topup'))}/>
        {/*<Route component={asyncComponent(() => import("app/routes/extraPages/routes/404"))}/>*/}
    </Switch>;
};


export default withRouter(Routes);

