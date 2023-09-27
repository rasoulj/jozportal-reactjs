import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux";
import QRCode from "react-qr-code";
import {CurrencyDef, encodeWID, OrderTypes} from "jozdan-common";
import {getCurrencyName, stdCustomerNumber} from "../util";
import TextField from "@material-ui/core/TextField/TextField";
import {FormGen, FormGenTypes, parseInt2} from "./TinyComponents";
import {useIntl} from "react-intl";
import {getOrderTypeName} from "../lngProvider";

const Model = {
    cur: "cur",
    type: "type",
    amount: "amount"
};

const getForm = locale => {
    return {
        [Model.cur]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.cur}`),
            type: FormGenTypes.select,
            options: Object.keys(CurrencyDef).map(v => {
                return {l: getCurrencyName(v, locale), v};
            })
        },
        [Model.type]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.type}`),
            type: FormGenTypes.select,
            options: [OrderTypes.topUp, OrderTypes.withdraw].map(v => {
                return {l: getOrderTypeName(v, locale), v};
            })
        },
        [Model.amount]: {
            className: "col-md-12 col-12",
            label: (`orders.amount`),
            type: FormGenTypes.number2,
        },
    }
};


function getQRValue({cur, type, amount}) {
    return ["nnw", 1*parseInt2(amount), cur, type === OrderTypes.withdraw ? "W" : "T"].join("|");
}

export function ViewWidValueQRCode({visible = true, title = ""}) {
    const {user, branch} = useSelector(({pax}) => pax);
    const {defCurrency = "iqd"} = branch || {};

    const {wid} = user || {};

    const {locale} = useIntl();

    const [opts, setOpts] = useState({
        [Model.cur]: defCurrency,
        [Model.type]: OrderTypes.topUp,
        [Model.amount]: 0
    });

    const setValue = (f, v) => setOpts({...opts, [f]: v});

    const qrValue = getQRValue(opts);

    const bgcolor = opts[Model.amount] ? "white" : "red";

    return !!visible && <div className="d-flex flex-row">
        <div className={`p-2 bg-${bgcolor}`}>
            <QRCode bgColor={bgcolor} value={qrValue} size={210}/>
        </div>
        <div className="p-3 align-self-center">
            <span className="text-grey">{title}</span>
            <h1>{stdCustomerNumber(wid)}</h1>
            <FormGen
                models={getForm(locale)}
                values={opts}
                setValue={setValue}
            />
        </div>
    </div>;

}
