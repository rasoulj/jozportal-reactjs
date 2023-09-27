import React, {useEffect, useState} from 'react';
import {BasePage, SimpleLineChart, SolidCards} from "../../../components/TinyComponents";
import {useSelector} from "react-redux";
import {loadRates} from "../../../util/db_mongo";
import {getCurrencyName, toast} from "../../../util";
import {Currencies, CurrencyDef, CurrencyForeColor} from "../../../models/Wallet";
import {useIntl} from "react-intl";

function getRates(rates = [], wallet) {
    return rates.map(rate => rate[wallet]);
}

export default ({match}) => {
    const [loader, setLoader] = useState(false);
    // const [updater, setUpdater] = useState(0);

    const [rates, setRates] = useState([]);
    const {user} = useSelector(({pax}) => pax);
    const {aid, bid, uid} = user || {};

    // console.log("Salaam", rates);

    useEffect(() => {
        loadRates(aid, setLoader, setRates, err => {
            console.log("err: ", err.toString());
            toast("Error loading rates");
        }, 100);
    }, []);

    console.log("rates", rates);

    // Object.keys(WalletTypes).forEach(wallet => {
    //     console.log(wallet, getRates(rates, wallet));
    // });
    const {locale} = useIntl();

    return <BasePage
        loader={loader}
        tid="pages.rates.hist"
        match={match}
    >
        <div className="d-flex flex-wrap">

            {Currencies.map((cur, key) => <SolidCards
                title={getCurrencyName(cur, locale)}
                className="col-12 col-md-6">
                <SimpleLineChart
                    color={CurrencyForeColor[cur]}
                    key={key}
                    // title={cur.toUpperCase()}
                    data={rates}
                    yKey={cur}
                />
            </SolidCards>)}
        </div>
    </BasePage>;
};

