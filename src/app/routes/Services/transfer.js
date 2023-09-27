import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../actions";
import {getOrderTypeName, Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";
import {
    BasePage,
    ErrorHelper,
    FormGen,
    FormGenTypes,
    GenDialog,
    HeaderButton,
    SectionHeader
} from "../../../components";
import {CurrencyDef, getErrorMessage, OrderTypes, toTwoDigit, WalletTypes} from "jozdan-common";
import {formalCustomerNumber, getCurrencyName, stdCustomerNumber, toast, validCustomerNumber} from "../../../util";
import {getFieldError} from "../../../models/User";
import {FormHelperText} from "@material-ui/core";
import {Button} from "reactstrap";
import {blockAmount, doWallets, loadFees, saveOrder} from "../../../util/db_mongo";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import MaterialInput from "@material-ui/core/Input";
import InputMask from "react-input-mask";
import {goBack} from "connected-react-router";

const Model = {
    cur: 'cur',
    cwid: "cwid",
    // dateFrom: "dateFrom",
    // dateTo: "dateTo",
    amount: "amount",
    // amountTo: "amountTo",
    // wid: "wid",
    // orderNo: "orderNo"
};

const DEF_VALUE = {
    [Model.cur]: "(all)",
    [Model.amount]: 0,
};

const ERRORS = {
    [Model.cur]: "err.cur",
    [Model.amount]: "err.amount",
    [Model.cwid]: "err.cwid",
};



const getForm = locale => {
    return {
        [Model.cur]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.cur}`),
            type: FormGenTypes.select,
            options: [{l: "statement.allCurrencies", v: DEF_VALUE.cur}, ...Object.keys(CurrencyDef).map(v => {
                return {l: getCurrencyName(v, locale), v};
            })],
        },
        // [Model.type]: {
        //     className: "col-md-6 col-12",
        //     label: (`form.${Model.type}`),
        //     type: FormGenTypes.select,
        //     options: Object.keys(OrderTypes).map(v => {
        //         return {l: getOrderTypeName(v, locale), v: v === OrderTypes.all ? null : v};
        //     })
        // },
        [Model.amount]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.amount}`),
            type: FormGenTypes.number,
        },
        // [Model.amountTo]: {
        //     className: "col-md-6 col-12",
        //     label: (`form.${Model.amountTo}`),
        //     type: FormGenTypes.number,
        // },
        // [Model.dateFrom]: {
        //     className: "col-md-6 col-12",
        //     label: (`form.${Model.dateFrom}`),
        //     type: FormGenTypes.date,
        // },
        // [Model.dateTo]: {
        //     className: "col-md-6 col-12",
        //     label: (`form.${Model.dateTo}`),
        //     type: FormGenTypes.date,
        // },
        // [Model.wid]: {
        //     className: "col-md-6 col-12",
        //     label: (`form.${Model.wid}`),
        //     type: FormGenTypes.text,
        // },
        // [Model.orderNo]: {
        //     className: "col-md-6 col-12",
        //     label: (`form.${Model.orderNo}`),
        //     type: FormGenTypes.text,
        // },

    };
};

function onError(err) {
    toast(err);
}

const getError = (f, v) => {
    console.log("getError", f, v);
    if(f === Model.cur) return v === DEF_VALUE[Model.cur];
    if(f === Model.cwid) return !validCustomerNumber(v);
    return 1*v <= 0;
}

const getMessage = (f, v) => {
    const err = getError(f, v);
    if(err) {
        console.log("getMessage", f, v, ERRORS[f]);
        return ERRORS[f];
    }
    return undefined;
}

function getParams({params}) {
    const {type} = params;
    return {type};
}


const TransferPage = ({match, history}) => {
    const {locale} = useIntl();
    const [opts, setOpts] = useState(DEF_VALUE);
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);

    const type = OrderTypes.transfer;

    const cur = opts[Model.cur];
    const amount = opts[Model.amount];
    const cwid = opts[Model.cwid];

    const cwidError = getMessage(Model.cwid, opts[Model.cwid]);
    const goHome = () => history.push("/app/home");

    const setValue = (f, v) => setOpts({...opts, [f]: v});

    let hasError = Object.keys(Model).map(f => getError(f, opts[f])).find(e => e);

    const {branch, user} = useSelector(({pax}) => pax);
    const {wid: bwid} = branch || {};
    const {wid, bid, aid} = user || {};


    const [fees, setFees] = useState({});

    const {transfer} = fees || {transfer: 0};

    useEffect(() => {
        loadFees(aid, setLoader, setFees, console.log, 1);
    }, [aid]);

    console.log("fees", fees);

    const onChange = ({target: {value}}) => {
        setValue(Model.cwid, value);
    };

    const fee = transfer*amount/100.0;

    const params =  {
        amount: 1*amount,
        cur,
        cwid,
        fee
    };


    const transactions = [//amount, wid, cur, cwid, fee, bid, bwid
        {amount: -params.amount, wid: formalCustomerNumber(wid), cur, desc: "Transferred to "+stdCustomerNumber(cwid), type: OrderTypes.transfer, owid: cwid, fee, bid, hasDone: true},
        {amount: -fee, wid: formalCustomerNumber(wid), cur, desc: "For Transaction fee", type: OrderTypes.fee, owid: cwid, fee, bid, hasDone: true},
        {amount: fee, wid: formalCustomerNumber(bwid), cur, desc: "Transaction fee from "+stdCustomerNumber(cwid), type: OrderTypes.fee, owid: cwid, bid},
        {amount: params.amount, wid: formalCustomerNumber(cwid), cur, desc: "Transferred from "+stdCustomerNumber(wid), type: OrderTypes.transfer, owid: wid, fee, bid},
    ];

    const doTransfer = () => doWallets(transactions, setLoader,
        () => {
            toast("Transfer has been completed successfully", "success");
            goBack();
        },
        err => toast(getErrorMessage(err)),
        locale,
    );


    console.log("locale", locale);

    return <BasePage
        loader={loader}
        dialogs={[
            <GenDialog
                actions={[
                    {label: Tran("pages.confirm", locale), value: "done", color: "green"},
                    {label: Tran("cancel", locale), value: "cancel", color: "secondary"},
                ]}
                title={"pages.confirm"}
                open={open}
                loader={loader}
                body={<h4>Are you sure to top-up <strong style={{color: 'red'}}>{toTwoDigit(opts[Model.amount]) + " " + getCurrencyName(opts[Model.cur], locale)}</strong>?</h4>}
                onClose={res => {
                    if(res === "cancel") {
                        setOpen(false);
                    } else {
                        doTransfer();
                    }
                }}
            />
        ]}
        tid={`pages.${type}`}
        match={match}>


        <FormGen
            getError={getError}
            getErrorMessage={getMessage}
            models={getForm(locale)}
            values={opts}
            setValue={setValue}
        />
        <InputMask
            value={cwid}
            onChange={onChange}
            maskChar="*"
            alwaysShowMask={true}
            style={{fontSize: 28, fontFamily: "courier"}} mask="9999-9999-9999-9999" >
            {(inputProps) => <div className="mt-4 mb-4">
                <InputLabel htmlFor={"wid"}>Wallet Number</InputLabel>
                <MaterialInput
                    helperText={"Error"}
                    error={!!cwidError}
                    type="text" {...inputProps} />
                <ErrorHelper error={cwidError} />
            </div>}
        </InputMask>
        <Button className={hasError ? "bg-gray" : "mt-2 bg-green"} block onClick={() => {
            if(hasError) return;
            setOpen(true);
        }} >
            {Tran("pages.confirm")}
        </Button>
    </BasePage>
}

export default TransferPage;