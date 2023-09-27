import React, {useEffect, useState} from 'react';
import {BasePage, GenDialog, HeaderButton, NoData, SectionHeader} from "../../../components/TinyComponents";
import {useSelector} from "react-redux";
import {CurrencyDef} from "../../../models/Wallet";
import moment from "moment";
import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    Badge,
    TextareaAutosize
} from "@material-ui/core";
import MarketingTable, {marketingData} from "../../../components/dashboard/Common/MarketingTable";
import OrderTable from "./OrderTable";
import {toast} from "../../../util";
import {OrderStatus, OrderTypes} from "jozdan-common";
import IntlMessages from "../../../util/IntlMessages";
import TextField from "@material-ui/core/TextField";
import {Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";
import {
    acceptOrder,
    rejectOrder,
    acceptExchange,
    acceptTransfer,
    loadOrders,
    updateEffect
} from "../../../util/db_mongo";

const ORDERS_DATA = [
    {
        accountNo: "100-456-789",
        type: "Top-up",
        value: 124.10,
        cur: CurrencyDef.iqd,
        issueDate: moment().toISOString(),
        status: "issued"
    },
    {
        accountNo: "123-006-789",
        type: "Withdraw",
        value: 1124.20,
        cur: CurrencyDef.aud,
        issueDate: moment().toISOString(),
        status: "in-progress"
    },
    {
        accountNo: "123-456-001",
        type: "Top-up",
        value: 1234.30,
        cur: CurrencyDef.iqd,
        issueDate: moment().toISOString(),
        status: "issued"
    },
    {
        accountNo: "100-456-789",
        type: "Top-up",
        value: 2124.40,
        cur: CurrencyDef.usd,
        issueDate: moment().toISOString(),
        status: "issued"
    },
    {
        accountNo: "123-456-001",
        type: "Withdraw",
        value: 1211.50,
        cur: CurrencyDef.iqd,
        issueDate: moment().toISOString(),
        status: "in-progress"
    },
];

const OrderItem = ({order}) => {
    const {
        accountNo,
        type,
        value,
        cur,
        issueDate,
        status
    } = order;
    return <ListItem button>
        <ListItemAvatar>
            <Avatar alt={accountNo} src={"user.image"}/>
        </ListItemAvatar>
        <ListItemText className="br-break" primary={accountNo} secondary={moment(issueDate).format("ll")}/>
        <Badge className="mr-4 mt-2 text-uppercase" color="success" pill>Agent</Badge>
        <ListItemSecondaryAction>
            <span>{type}</span>
        </ListItemSecondaryAction>
    </ListItem>;
};


export default ({match, history: {push}}) => {
    const [edit, setEdit] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loader, setLoader] = useState(false);
    const [updater, setUpdater] = useState(0);

    const [values, setValues] = useState({});
    const {user, branch} = useSelector(({pax}) => pax);
    const {aid, bid, uid} = user || {};


    const lo = () => loadOrders({bid, status: OrderStatus.issued, limit: 100}, setOrders);

    // useEffect(() => {
    //     ordersQuery(bid, OrderStatus.issued).onSnapshot(e => {
    //         setOrders(getData(e));
    //         // console.log(getData(e));
    //     });
    // }, [updater]);

    useEffect(lo, [updater]);
    useEffect(updateEffect(lo, 14000), [updater]);

    const accept = order => setCommand({order, type: "accept"});
    const reject = order => setCommand({order, type: "reject"});
    // console.log(orders);

    const [command, setCommand] = useState({});
    const [desc, setDesc] = useState("");
    const {locale} = useIntl();

    return <BasePage
        dialogs={[
            <GenDialog
                loader={loader}
                key="accept"
                onClose={res => {
                    const {order} = command;
                    const {type} = order;
                    // console.log("type:", type);
                    setCommand({});
                    if(res !== "yes") return;
                    // console.log(res, order);

                    if(type === OrderTypes.transfer) {
                        console.log(order);
                        acceptTransfer(
                            order,
                            setLoader,
                            () => {
                                lo();
                                toast(Tran("orders.acc.mes", locale), "success");
                            },
                            err => {
                                console.log(err);
                                toast(Tran("orders.acc.err", locale));
                            },
                            locale
                        );
                    } else if(type === OrderTypes.exchange) {
                        acceptExchange(
                            order,
                            setLoader,
                            () => {
                                lo();
                                toast(Tran("orders.acc.mes", locale), "success");
                            },
                            err => {
                                console.log(err);
                                toast(Tran("orders.acc.err", locale));
                            },
                            locale
                        );
                    } else acceptOrder(order, setLoader,
                        () => {
                            lo();
                            toast(Tran("orders.acc.mes", locale), "success");
                        },
                        err => {
                            console.log(err);
                            toast(Tran("orders.acc.err", locale));
                        },
                        locale
                    );
                }}
                body={<div style={{width: "100%"}}>
                    <h4><IntlMessages id={"pages.orders.accept_order.mes"} /></h4>
                </div>}
                title={<IntlMessages id={"pages.orders.accept_order"} />}
                open={command.type === "accept"}
                actions={[
                    {label: <IntlMessages id="button.yes"/>, value: "yes"},
                    {label: <IntlMessages id="button.no"/>, value: "no", color: "primary"},
                ]}
            />,
            <GenDialog
                loader={loader}
                key="reject"
                onClose={res => {
                    const {order} = command;
                    setCommand({});
                    setDesc("");
                    // console.log("desc", desc);
                    if(res !== "yes") return;
                    // console.log(res, order);
                    rejectOrder(order, desc, setLoader,
                        () => {
                            lo();
                            toast(Tran("orders.rej.mes", locale), "success");
                        },
                        () => toast(Tran("orders.rej.err", locale)),
                        locale
                    );
                }}
                title={<IntlMessages id={"pages.orders.reject_order"} />}
                body={<div style={{width: "100%"}}>
                    <h4><IntlMessages id={"pages.orders.reject_order.mes"} /></h4>
                    <TextareaAutosize rows={3} defaultValue={desc} onChange={({target: {value}}) => setDesc(value)} style={{width: "100%"}} placeholder="Description" />
                </div>}
                open={command.type === "reject"}
                actions={[
                    {label: <IntlMessages id="button.yes"/>, value: "yes"},
                    {label: <IntlMessages id="button.no"/>, value: "no", color: "primary"},
                ]}
            />
        ]}
        loader={loader}
        tid="pages.orders"
        match={match}>

        <SectionHeader
            right={<div>
                <HeaderButton icon="edit" color="green" tid="pages.rates.history"
                              onClick={() => push("rates/history")}/>
            </div>}
            tid="orders.current">

            {/*<MarketingTable data={marketingData} />*/}

            <div className="m-5"/>
            {orders.length === 0 ? <NoData loader={loader}/> : <OrderTable
                data={orders}
                rejectOrder={reject}
                acceptOrder={accept}
                // acceptOrder={ => setOpenConfirm(true)}
            />}

        </SectionHeader>

    </BasePage>;
};

