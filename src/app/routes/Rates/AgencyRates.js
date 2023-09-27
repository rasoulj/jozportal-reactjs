import React, {useEffect, useState} from 'react';
import {
    BasePage,
    FormGen,
    FormGenTypes,
    HeaderButton,
    SectionHeader,
    SolidCards
} from "../../../components/TinyComponents";

import {getForm, getError} from "../../../models/Rate";
import {camelCase, getCurrencyName, notImpl, showErrors, toast} from "../../../util";
import {Currencies, CurrencyDef} from "../../../models/Wallet";
import {loadRates, saveRates} from "../../../util/db_mongo";
import {useSelector} from "react-redux";

import {RateCardStyle, isValid} from "./index"
import {useIntl} from "react-intl";

export default ({match, history: {push}}) => {
    const [edit, setEdit] = useState(false);
    const [loader, setLoader] = useState(false);
    const [updater, setUpdater] = useState(0);

    const [values, setValues] = useState({});
    const {user, branch} = useSelector(({pax}) => pax);
    const {aid, bid, uid} = user || {};
    const {defCurrency = "iqd"} = branch || {};

    console.log("branch", branch);

    const setValue = (w, f, v) => {

        const obj = values[w] || {};
        obj[f] = v;
        setValues({...values, [w]: obj});
    };

    const setValueBase = (f, v) => {
        setValues({...values, [f]: v});
    };



    const getFieldError = (field, value, Form = RatesForm) => {
        // const [cur, b] = field.split("_");
        return isValid(value) ? "" : `A positive number must be entered for ${Form[field].label}`;
    };

    // const UsdForm = getWalletForm();
    // console.log("UsdForm", UsdForm);

    useEffect(() => {
        if(!updater) loadRates(aid, setLoader, setValues, err => {
            // console.log(err);
            console.log("err: ", err.toString());
            toast("Error loading rates");
        });
    }, [updater]);

    const {locale} = useIntl();
    const RatesForm = getForm(defCurrency, locale);

    return <BasePage
        loader={loader}
        tid="pages.agency_rates"
        match={match}

    >
        <SectionHeader
            title={`${getCurrencyName("usd", locale)} / ${getCurrencyName(defCurrency, locale)}`}
            //tid="pages.rates.currentRates"
            right={<div className="d-flex flex-row">
                <HeaderButton disabled={!edit} color="danger" icon="save" tid="save" onClick={() => {

                    const errs = Object.keys(RatesForm).map(f => getFieldError(f, values[f])).filter(e => e !== "");

                    showErrors(errs);
                    // errs.forEach(e => toast(e, "error"));
                    if (errs.length > 0) return;

                    saveRates(aid, uid, values, setLoader,
                        () => toast("Rates has been saved successfully.", "success"),
                        () => toast("Rates cannot be saved", "error")
                    );
                    console.log(values);

                    setEdit(false);
                }}/>
                <HeaderButton disabled={!edit} color="teal" icon="globe" title="Load from XE.com" onClick={() => {
                    const rand = {};
                    Currencies.forEach(f => {
                        const v = 1 + Math.floor(100 * Math.random()) / 100;
                        rand[f] = v;
                        //console.log(f, v);
                        //setValueBase(f, v);
                    });
                    // console.log(rand);
                    setLoader(true);
                    setTimeout(() => {
                        setValues({...values, ...rand});
                        setLoader(false);
                    }, 1500);
                    //console.log(values);
                    // setUpdater(updater+1);
                }}/>
                <HeaderButton color="indigo" disabled={edit} icon="edit" tid="edit" onClick={() => setEdit(true)}/>
                <HeaderButton icon="edit" color="green" tid="pages.rates.history"
                              onClick={() => push("rates/history")}/>
            </div>}
        >
            <div className="d-flex flex-wrap">
                <FormGen
                    models={RatesForm}
                    values={values}
                    setValue={setValueBase}
                    getDisabled={(f, v) => !edit}
                    getError={getError}
                    getErrorMessage={(f, v) => v === undefined ? "" : getFieldError(f, v)}
                />
            </div>
        </SectionHeader>


    </BasePage>;
};

