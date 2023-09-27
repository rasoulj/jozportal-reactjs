import React from 'react';
import CustomScrollbars from 'util/CustomScrollbars';
import Navigation from "../../components/Navigation";
import {useSelector} from "react-redux";
import {Roles} from "../../models/User";

const HOME_MENU = {
    name: 'pages.home',
    type: 'item',
    link:'/app/home'
};

const WALLET_MENU = {
    name: 'pages.wallet',
    type: 'item',
    link:'/app/wallet'
};


const BRANCH_MANAGEMENT = {
    name: 'pages.branchManagement',
    type: 'item',
    link:'/app/branch-management'
};


const SETTINGS_A_MENU = {
    name: 'pages.settings',
    type: 'item',
    link:'/app/agency-settings'
};

const SETTINGS_B_MENU = {
    name: 'pages.settings',
    type: 'item',
    link:'/app/branch-settings'
};

const SETTINGS_G_MENU = {
    name: 'pages.settings',
    type: 'item',
    link:'/app/agent-settings'
};


const AGENT_MANAGEMENT_MENU = {
    name: 'pages.agent_management',
    type: 'item',
    link:'/app/agent-management'
};

const CUSTOMER_MANAGEMENT_MENU = {
    name: 'pages.customer_management',
    type: 'item',
    link:'/app/customer-management'
};

const STATEMENT_MENU = {
    name: 'pages.statement',
    type: 'item',
    link:'/app/statement'
};

const ORDERS_MENU = {
    name: 'pages.orders',
    type: 'item',
    link:'/app/orders'
};

const RATES_MENU = {
    name: 'pages.rates',
    type: 'item',
    link:'/app/rates'
};

const AGENCY_RATES_MENU = {
    name: 'pages.agency_rates',
    type: 'item',
    link:'/app/agency-rates'
};


const TRANSACTION_FEE_MENU = {
    name: 'pages.transaction_fee',
    type: 'item',
    link:'/app/transaction-fee'
};


const ABOUT_US_MENU = {
    name: 'pages.about_us',
    type: 'item',
    link:'/app/about-us'
};

const TOP_UP_MENU = {
    name: 'pages.topUp',
    type: 'item',
    link:'/app/services/topUp'
};

const WITHDRAW_MENU = {
    name: 'pages.withdraw',
    type: 'item',
    link:'/app/services/withdraw'
};

const TRANSFER_MENU = {
    name: 'pages.transfer',
    type: 'item',
    link:'/app/services/transfer'
};

const EXCHANGE_MENU = {
    name: 'pages.exchange',
    type: 'item',
    link:'/app/services/exchange'
};


const NONE_MENU = [HOME_MENU];

const MENUS = {
    [Roles.AGENCY_ADMIN]: [
        HOME_MENU,
        BRANCH_MANAGEMENT,
        AGENCY_RATES_MENU,
        // RATES_MENU, //DEL
        // ORDERS_MENU, //DEL
        TRANSACTION_FEE_MENU,
        WALLET_MENU,
        SETTINGS_A_MENU,
        ABOUT_US_MENU
    ],
    [Roles.BRANCH_ADMIN]: [
        HOME_MENU,
        AGENT_MANAGEMENT_MENU,
        CUSTOMER_MANAGEMENT_MENU,
        RATES_MENU,
        STATEMENT_MENU,
        ORDERS_MENU,
        WALLET_MENU,
        SETTINGS_B_MENU,
        ABOUT_US_MENU,
    ],
    [Roles.BRANCH_AGENT]: [
        HOME_MENU,
        //AGENT_MANAGEMENT_MENU,
        // CUSTOMER_MANAGEMENT_MENU,
        //RATES_MENU,
        //STATEMENT_MENU,
        ORDERS_MENU,
        WALLET_MENU,
        SETTINGS_G_MENU,
        ABOUT_US_MENU,
    ],
    [Roles.CUSTOMER]: [
        HOME_MENU,
        TOP_UP_MENU,
        WITHDRAW_MENU,
        TRANSFER_MENU,
        EXCHANGE_MENU,
        WALLET_MENU,
        // SETTINGS_A_MENU,
    ],
    [Roles.NONE]: NONE_MENU,
};


function getMenu(user) {
    const {role} = user || {role: Roles.NONE};
    // console.log("role", role);
    return MENUS[role] || [];
}

const SideBarContent = () => {

    const {user, agency} = useSelector(({pax}) => pax);


    // console.log("SideBarContent.role", user || {role: Roles.NONE});

    return (
        <CustomScrollbars className=" scrollbar">
            <Navigation menuItems={getMenu(user)}/>
        </CustomScrollbars>
    );
};

export default SideBarContent;
