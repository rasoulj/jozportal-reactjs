import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../actions";
import {getOrderTypeName, Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";
import {BasePage, FormGen, FormGenTypes, GenDialog, HeaderButton, SectionHeader} from "../../../components";
import {CurrencyDef, OrderTypes, toTwoDigit} from "jozdan-common";
import {getCurrencyName, toast} from "../../../util";
import {getFieldError} from "../../../models/User";
import {FormHelperText} from "@material-ui/core";
import {Button} from "reactstrap";
import {blockAmount, saveOrder} from "../../../util/db_mongo";

const Model = {
    cur: 'cur',
    // type: "type",
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

    if(f === Model.cur) return v === DEF_VALUE[Model.cur];
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


const TopUpPage = ({match, history}) => {
    const {locale} = useIntl();
    const [opts, setOpts] = useState(DEF_VALUE);
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);

    const {type} = getParams(match);

    const cur = opts[Model.cur];
    const amount = opts[Model.amount];

    const goHome = () => history.push("/app/home");

    const setValue = (f, v) => setOpts({...opts, [f]: v});

    let hasError = Object.keys(Model).map(f => getError(f, opts[f])).find(e => e);
    // for(const f of Object.keys(Model)) {
    //     hasError = hasError || getError(f, opts[f]);
    // }

    const {user} = useSelector(({pax}) => pax);
    const {wid} = user || {};

    const params =  {
        type,
        cur,
        amount,
        wid,
    };// getParams(route, "type cur amount back wid");

    console.log("params", params);

    return <BasePage
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
                        saveOrder(user, params, setLoader, () => {
                            // console.log(params);
                            if(type === OrderTypes.withdraw) {
                                blockAmount(params, setLoader, () => {
                                    toast("Order has been created", "success");
                                    goHome();
                                }, onError)
                            } else goHome();
                        }, onError);

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
        <Button className={hasError ? "bg-gray" : "mt-2 bg-green"} block onClick={() => {
            // toast("Order has been created", "success");
            // history.push("/app/home");
            // return;
            if(hasError) return;
            setOpen(true);
        }} >
            {Tran("pages.confirm")}
        </Button>
    </BasePage>
}

export default TopUpPage;