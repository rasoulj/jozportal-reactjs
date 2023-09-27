import React, {useEffect, useState} from 'react';
import {BasePage, FlatList, HeaderButton, ListItemText2, SectionHeader} from "../../../components/TinyComponents";
import {Avatar, Button, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {getCurrencyName, getFlagUri, stdCustomerNumber, sumDigits, sumDigits0} from "../../../util";
import {CurrencyDef, toTwoDigit} from "jozdan-common";
import {useDispatch, useSelector} from "react-redux";
import {UserWallet} from "../../../components";
import {useIntl} from "react-intl";
import {Tran} from "../../../lngProvider";
import {loadWallet, updateEffect} from "../../../util/db_mongo";



const WalletRow = ({cur, amount, push}) => {
    // const {name, cc} = CurrencyDef[cur] || {};
    const {locale} = useIntl();
    const name = getCurrencyName(cur, locale);
    return <ListItem key={cur} button onClick={() => push(`wallet/${cur}/${amount}`)} >
        <img className="m-2" style={{width: 64, height: 64}} src={getFlagUri(cur)}  alt={cur.toUpperCase()+" Flag"}/>
        <ListItemText2 primary={toTwoDigit(amount)} secondary={name}/>
        <ListItemSecondaryAction button>
            <Button color="secondary">
                <i className="zmdi zmdi-chevron-right zmdi-hc-fw zmdi-hc-2x "/>
            </Button>
        </ListItemSecondaryAction>
    </ListItem>
};


export default ({match, history: {push}}) => {
    const [loader, setLoader] = useState(false);
    const [wallet, setWallet] = useState({});
    const dispatch = useDispatch();
    const {user} = useSelector(({pax}) => pax);
    const {wid} = user || {};

    const updateWallet = () => {
        loadWallet(wid, () => {}, wallet => setWallet(wallet || {}));
    };


    useEffect(updateEffect(updateWallet));

    useEffect(updateWallet, []);
    // useEffect(updateWallet);

    // useEffect(() => {
    //     walletQuery(wid).onSnapshot(e => {
    //         // console.log(e);
    //         const w = !!e ? e.data() : {};
    //         // console.log("wallet: ", w);
    //         setWallet(w || {});
    //         // dispatch(setValues({wallet}));
    //     });
    // }, []);

    const {locale} = useIntl();

    return <BasePage
        loader={loader}
        tid="pages.wallet"
        match={match}>
        <UserWallet user={user} title={Tran("wid", locale)} />
        {/*{ n + ' ' + sumDigits0(n) }*/}
        <SectionHeader
            // right={<HeaderButton color="teal" icon="time-restore" tid="wallet.transactions" onClick={() => push("wallet/transactions")} />}
            tid="currencies">
            <FlatList
                loader={loader}
                data={Object.keys(CurrencyDef).map(cur => {
                    return {cur, amount: wallet[cur] || 0}
                })}
                renderItem={(data, key) => <WalletRow push={push} {...data} key={key} />}
            />
        </SectionHeader>
    </BasePage>;
};

