import {Currencies, CurrencyDef} from "./Wallet"
import {FormGenTypes, ReadOnly} from "../components/TinyComponents";
import TimePickers from "../components/TimePickers";
import React from "react";
import {getCurrencyName, toUpperCase} from "../util"
import {useIntl} from "react-intl";
import {Tran} from "../lngProvider";

export const TimeForm = {
    validFrom: {
        className: "col-md-6 col-12",
        required: true,
        label: `from`,
        type: FormGenTypes.time
    },
    validTo: {
        className: "col-md-6 col-12",
        required: true,
        label: `to`,
        type: FormGenTypes.time
    },
};

export const ValidTimePicker = ({setValues, values, readOnly = false, prefix = "valid"}) => {
    const {locale} = useIntl();

    return <div className="d-flex mb-5">
        {Object.keys(TimeForm).map((field, key) => <TimePickers key={key}
                                                                readOnly={readOnly}
                                                                className={TimeForm[field].className}
                                                                field={field}
                                                                setValue={setValues}
                                                                title={`${key === 0 ? Tran(prefix, locale) : ""} ${Tran(TimeForm[field].label, locale)}:`}
                                                                value={values[field]}
        />)}
    </div>;
};


//
// function getFields(cur) {
//     return [`${cur}_b`, `${cur}_s`];
// }
//
// function getModels() {
//     let models = {};
//     Currencies.forEach(cur => {
//         // const [b, s] = getFields(cur);
//         models[cur] = cur;
//         // models[s] = s;
//     });
//     return models;
// }
// export const Model = getModels();

export function getForm(defCurrency, locale) {
    console.log("defCurrency", defCurrency);
    let ret = {};
    const excp = ["usd"];
    Currencies.filter(cur => !excp.includes(cur)).forEach(cur => {
       ret[cur] = {
           className: "col col-12 col-md-3 col-sm-3",
           required: true,
           title: `${toUpperCase("usd", locale)}/${getCurrencyName(cur, locale)}`,
           type: FormGenTypes.number
       };
    });
    return ret;
}
//
// function getForm2() {
//     let ret = {};
//     Currencies.forEach(cur => {
//         const [b, s] = getFields(cur);
//        ret[b] = {
//            className: " col-md-6 col-12",
//            required: true,
//            label: `${cur.toUpperCase()} buy`
//        };
//         ret[s] = {
//             className: "col-md-6 col-12",
//             required: true,
//             label: `${cur.toUpperCase()} sell`
//         };
//     });
//     return ret;
// }

export const getError = (f, v) => {
    if (v === undefined) return false;
    const val = 1*v;
    // console.log("val", val);
    return  isNaN(val) || val <= 0;
};

