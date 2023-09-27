import React, {useEffect, useState} from 'react';
import {
    BasePage,
    FormGen,
    FormGenTypes,
    HeaderButton,
    SectionHeader,
    SolidCards
} from "../../../components/TinyComponents";

import {getForm, getError, TimeForm, ValidTimePicker} from "../../../models/Rate";
import {camelCase, getCurrencyName, notImpl, showErrors, toast} from "../../../util";
import {Currencies, CurrencyDef} from "../../../models/Wallet";
import {loadRates, loadRatesBranch, saveRatesBranch} from "../../../util/db_mongo";
import {useSelector} from "react-redux";
import TimePickers from "../../../components/TimePickers";
import moment from "moment";
import {getErrorMessage, WalletColors, WalletTypes} from "jozdan-common";
import {useIntl} from "react-intl";
export const RateCardStyle = "col-sm-12 col-md-6 col-12";
export const isValid = p => 1 * p > 0;

const T = "T";

function getWalletTypeTitle(wallet, defCurrency, locale) {
    if(Object.keys(WalletTypes).length === 1) return getCurrencyName("usd", locale)+  " / "+getCurrencyName(defCurrency, locale);
    return `${camelCase(wallet)} Rates`;
}

function getWalletForm() {
    const all = {};
    Object.keys(WalletTypes).forEach(wallet => {
        // const [b, s] = getFields(wallet);
        // const w = camelCase(wallet);
        all[wallet] = {
            s: {
                className: "col-md-6 col-12",
                required: true,
                label: `USD-Sell`,
                type: FormGenTypes.number
            },
            b: {
                className: "col-md-6 col-12",
                required: true,
                label: `USD-Buy`,
                type: FormGenTypes.number
            }
        }
    });
    return all;
}

export default ({match, history: {push}}) => {
    const [edit, setEdit] = useState(false);
    const [loader, setLoader] = useState(false);
    const [updater, setUpdater] = useState(0);

    const [values, setValues] = useState({});
    const {user, branch} = useSelector(({pax}) => pax);
    const {aid, bid, uid} = user || {};
    console.log("branch", branch);
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

    const {locale} = useIntl();
    const RatesForm = getForm(defCurrency, locale);


    const getFieldError = (field, value, Form = RatesForm) => {
        // const [cur, b] = field.split("_");
        return isValid(value) ? "" : `A positive number must be entered for ${Form[field].label}`;
    };

    const UsdForm = getWalletForm();
    console.log("UsdForm", UsdForm);

    useEffect(() => {
        if (!updater) loadRatesBranch(bid, setLoader, values => {
            console.log("rates-loadRatesBranch", values);
            const {validFrom, validTo} = values;
            setValues({...values, validFrom: moment(validFrom), validTo: moment(validTo)});
        }, err => {
            toast(getErrorMessage(err));
        });
    }, [updater]);

    console.log("values", values);



    return <BasePage
        loader={loader}
        tid="pages.rates"
        match={match}

    >
        <SectionHeader
            // title={`USD in ${CurrencyDef[defCurrency]}`}
            tid={getCurrencyName(defCurrency)}
            //tid="pages.rates.currentRates"
            right={<div className="d-flex flex-row">
                <HeaderButton disabled={!edit} color="danger" icon="save" tid="save" onClick={() => {

                    const {validFrom, validTo} = values || {};
                    let errs = [];

                    const mm = moment();
                    const dd = mm.toISOString().split(T)[0];

                    const timeFrom = (validFrom || mm).toISOString().split(T)[1];
                    const timeTo = (validTo || mm).toISOString().split(T)[1];
                    // const timeTo = validTo.toISOString();

                    // console.log("timeFrom", timeFrom);

                    if(timeFrom >= timeTo) errs.push("To time is NOT After From time.");

                    // console.log("RatesModel", RatesModel);
                    Object.keys(WalletTypes).forEach(wallet => {
                        const w = `${camelCase(wallet)} `;
                        const wvals = values[wallet] || {};
                        const form = UsdForm[wallet];
                        form.b.label = w + form.b.label;
                        errs.push(...['b', 's'].map(f => getFieldError(f, wvals[f], form)).filter(e => e !== ""));
                    });
                    errs.push(...Object.keys(RatesForm).map(f => getFieldError(f, values[f])).filter(e => e !== ""));

                    showErrors(errs);
                    // errs.forEach(e => toast(e, "error"));
                    if (errs.length > 0) return;

                    const rates = {...values, validFrom: [dd, timeFrom].join(T), validTo: [dd, timeTo].join(T)};
                    console.log("rates", rates);

                    // return; //TODO:

                    saveRatesBranch(bid, uid, rates, setLoader,
                        () => toast("Rates has been saved successfully.", "success"),
                        () => toast("Rates cannot be saved", "error")
                    );

                    setEdit(false);
                }}/>
                <HeaderButton color="indigo" disabled={edit} icon="edit" tid="edit" onClick={() => setEdit(true)}/>
                <HeaderButton icon="edit" color="green" tid="pages.rates.history"
                              onClick={() => push("rates/history")}/>
            </div>}
        >

            <h4 className="font-weight-bold text-amber text-center" >{moment().format("ll")}</h4>
            <ValidTimePicker
                readOnly={!edit}
                values={values}
                setValues={setValueBase}
            />

            <div className="d-flex flex-wrap">


                {Object.keys(WalletTypes).map((wallet, key) => <SolidCards
                    key={key}
                    className={`${RateCardStyle} bg-${WalletColors[wallet]}`}
                    header={getWalletTypeTitle(wallet, defCurrency, locale)}>
                    <FormGen
                        className="mb-5"
                        models={UsdForm[wallet]}
                        setValue={(f, v) => setValue(wallet, f, v)}
                        values={values[wallet]}
                        getDisabled={(f, v) => !edit}
                        getError={getError}
                        getErrorMessage={(f, v) => v === undefined ? "" : getFieldError(f, v, UsdForm[wallet])}
                    />
                </SolidCards>)}
            </div>


        </SectionHeader>

        <SectionHeader
            tid="pages.rates.otherRates"
            right={<HeaderButton disabled={!edit} color="teal" icon="globe" tid="tid.load_from" onClick={() => {
                loadRates(aid, setLoader, v => setValues({...values, ...v}), err => {
                    toast(getErrorMessage(err));
                });
            }}/>}
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

