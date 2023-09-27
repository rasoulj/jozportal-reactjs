import React, {useEffect, useState} from 'react';
import {
    BasePage,
    FlatList, FormGenTypes,
    HeaderButton,
    ListItemText2,
    NoData,
    SectionHeader
} from "../../../components/TinyComponents";
import {useSelector} from "react-redux";
import {Avatar, Button, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {CurrencyDef, OrderTypes, stdCustomerNumber, toTwoDigit} from "jozdan-common";
import {getCurrencyName, getFlagUri, toast, toUpperCase} from "../../../util";
import {FormGen} from "../../../components";
import {useIntl} from "react-intl";
import {getOrderTypeName, Tran} from "../../../lngProvider";
import moment from "moment";
import {ExportToExcel} from "../../../util/ExportToExcel";
import {loadHist} from "../../../util/db_mongo";



const LIMIT_LEN = 15;

//cur, type, dateFrom, dateTo, amountFrom, amountTo, wid
const Model = {
    cur: 'cur',
    type: "type",
    dateFrom: "dateFrom",
    dateTo: "dateTo",
    amountFrom: "amountFrom",
    amountTo: "amountTo",
    wid: "wid",
    orderNo: "orderNo"
};

const DEF_VALUE = {
    cur: "(all)",
    type: "all",
};

const getForm = locale => {
    return {
        [Model.cur]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.cur}`),
            type: FormGenTypes.select,
            options: [{l: "statement.allCurrencies", v: DEF_VALUE.cur}, ...Object.keys(CurrencyDef).map(v => {
                return {l: getCurrencyName(v, locale), v};
            })]
        },
        [Model.type]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.type}`),
            type: FormGenTypes.select,
            options: Object.keys(OrderTypes).map(v => {
                return {l: getOrderTypeName(v, locale), v: v === OrderTypes.all ? null : v};
            })
        },
        [Model.amountFrom]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.amountFrom}`),
            type: FormGenTypes.number,
        },
        [Model.amountTo]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.amountTo}`),
            type: FormGenTypes.number,
        },
        [Model.dateFrom]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.dateFrom}`),
            type: FormGenTypes.date,
        },
        [Model.dateTo]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.dateTo}`),
            type: FormGenTypes.date,
        },
        [Model.wid]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.wid}`),
            type: FormGenTypes.text,
        },
        [Model.orderNo]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.orderNo}`),
            type: FormGenTypes.text,
        },

    };
};

function normalDateFrom(d2) {
    if (!d2) return d2;
    let d = moment(d2);
    return new Date(d.year(), d.month(), d.date());
}

function normalDateTo(d2) {
    if (!d2) return d2;
    let d = moment(d2);
    return new Date(d.year(), d.month(), d.date(), 23, 59, 59);
}

export function formatForExport(item) {
    if(!item) return {};
    const {orderNo, amount, desc, cur, wid, updatedAt} = item;

    return {
        orderNo,
        amount: toTwoDigit(amount, "en"),
        cur: toUpperCase(cur, "en"),
        desc,
        wid: stdCustomerNumber(wid),
        updatedAt: moment(updatedAt).format("lll"),
    }
}

function Item({
                  item,
                  onClick = () => {
                  }
              }) {
    const {amount, desc, cur, wid, updatedAt, isPositive} = item;

    var am = toTwoDigit(amount);
    if(!isPositive) am = `(${am})`;

    return <ListItem button onClick={onClick}>
        <Avatar className="mr-3 bg-transparent">
            <img style={{width: 64, height: 64}} src={getFlagUri(cur)} alt={toUpperCase(cur)}/>
        </Avatar>
        <ListItemText2 primary={am} secondary={desc} third={stdCustomerNumber(wid) + `  (${moment(updatedAt).format("lll")})`}/>
        <ListItemSecondaryAction button>
            <Button onClick={onClick} color="secondary">
                <i className="zmdi zmdi-chevron-right zmdi-hc-fw zmdi-hc-2x text-white"/>
            </Button>
        </ListItemSecondaryAction>
    </ListItem>;
}

export default ({match}) => {
    const [updater, setUpdater] = useState(0);
    const [loader, setLoader] = useState(false);
    const [trans, setTrans] = useState([]);
    const [limit, setLimit] = useState(LIMIT_LEN);
    const [opts, setOpts] = useState(DEF_VALUE);

    const {user: {bid}} = useSelector(({pax}) => pax);
    const {locale} = useIntl();

    console.log("ooopt", opts);

    const loadData = () => {
        const copts = JSON.parse(JSON.stringify(opts));

        const {amountFrom, amountTo, dateFrom, dateTo} = copts;
        const hasAmount = amountFrom || amountTo;
        const hasDate = dateFrom || dateTo;

        if(hasAmount && hasDate) {
            toast(Tran("tran.error.mutual", locale));
            return;
        }

        // setLoader(true);
        console.log("copts", copts);
        if(copts.cur === DEF_VALUE.cur) delete copts.cur;
        if(copts.type === DEF_VALUE.type) delete copts.type;
        if(!copts.orderNo) delete copts.orderNo;

        copts.dateFrom = normalDateFrom(copts.dateFrom);
        copts.dateTo = normalDateTo(copts.dateFrom);

        loadHist({...copts, bid, limit}, setTrans, setLoader);

        // transHistQuery(limit, {...copts, bid}).get().then(pp => {
        //     setTrans(isEmpty(pp) ? [] : pp.docs.map(p => p.data()));
        // }).catch(console.log).finally(() => setLoader(false));
    };

    useEffect(loadData, [updater, limit]);


    const setValue = (f, v) => setOpts({...opts, [f]: v});

    console.log(trans);

    // console.log(getForm(locale));

    return <BasePage
        loader={loader}
        tid="pages.statement"
        match={match}>

        <SectionHeader tid="statement.filters" right={<div>
            <HeaderButton
                tid="statement.applyFilters"
                color="green"
                icon="view-week"
                onClick={loadData}
            />
            <HeaderButton
                tid="statement.clearFilters"
                color="red"
                icon="close"
                onClick={() => {
                    setOpts(DEF_VALUE);
                    setUpdater(updater+1);
                }}
            />
        </div>}>

            <FormGen models={getForm(locale)} values={opts} setValue={setValue}/>

        </SectionHeader>

        <SectionHeader tid="statement.result" right={<ExportToExcel data={(trans || []).map(formatForExport)} />}>
            <FlatList
                renderItem={(item, index) => <Item key={index} item={item}/>}
                data={trans || []}
                loader={loader}
                noData={<NoData/>}
            />
            {limit <= trans.length && <div className="d-flex justify-content-center">
                <Button onClick={() => setLimit(limit+LIMIT_LEN)}>
                    {Tran("tran.load_more", locale)}
                </Button>
            </div>}
        </SectionHeader>

    </BasePage>;
};

