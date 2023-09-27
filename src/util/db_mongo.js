import {Roles} from "../models/User";
import {CurrencyDef, OrderStatus, toTwoDigit} from "jozdan-common";
import {getOrderTypeName, Tran} from "../lngProvider";
import {getCurrencyName} from "./index";
import {createOrderNo, sendNotificationForTransactions} from "./db";

export const isDebug = true;
// export const baseApiUrl = "http://localhost:2537";
const _baseUrlDebug = "http://157.90.207.53:2537";
const _baseUrlProduction = "http://135.181.237.237:2537";

export const baseApiUrl = isDebug ? _baseUrlDebug : _baseUrlProduction;

const axios = require('axios');//.default;
const serverToken = "AAAASq7-ohM:APA91bGxLcOfw69XhSl0mJnQ026YqhyBLriCS3E-5gQDjpiOkm34H_GUJJKrFGBHQkuiB35ph90r4LcMH7XtU0FuMAuhImhu5agT-kC7xg37YSNOKaAjtsT8_SMiwoHNBuCUgYyFiWhp";

function getTransDesc(transaction, user, locale) {
    const {wid, amount, cur, type, status} = transaction;

    return Tran(`orders.${status === OrderStatus.accepted ? "acc" : "rej"}.mes`, locale);
}


function sendNotification(notif, user) {
    const {token} = user || {};
    if (!token) return;

    const notification_body = {
        notification: {...notif, sound: 'default',},
        priority: "high",
        data: {more: "Salaam", id: 1, sound: 'default'},
        apns: { payload: { aps: { sound: 'default', } } },
        registration_ids: [token]
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            // replace authorization key with your key
            'Authorization': `key=${serverToken}`,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(notification_body)
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.error(error);
    });


    // console.log(`NOTIF: ${type} ${desc}`);
}


function sendTranNotification(transaction, user, locale) {
    const {token} = user || {};
    if (!token) return;
    console.log("desc", transaction);
    const {wid, amount, cur, type, status} = transaction;
    const body = getTransDesc(transaction, user, locale);
    const title = `${getOrderTypeName(type, locale)} ${toTwoDigit(amount)} ${getCurrencyName(cur, locale)}`;

    sendNotification({title, body}, user);
}

export function setAuthToken(token) {
    axios.defaults.headers.common['x-access-token'] = token;
}


const q = function(obj) {
    const str = [];
    for (const p in obj)
        if (obj.hasOwnProperty(p) && obj[p]) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};

const doResults = (setValue, onError) => ({data: d}) => {
    console.log("doResults", d);
    const {data, status} = d;
    if(!status) onError(d);
    else setValue(data);
};


export function login(data, setLoader, setValue, onError = console.log) {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/auth`, data)
        .then(doResults(values => {
            const {authToken} = values;
            setAuthToken(authToken);
            setValue(values);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadHist(query, setValue, setLoader = () => {}, onError = console.log) {
    // setLoader(true);
    axios
        .get(`${baseApiUrl}/hist?${q(query)}`)
        .then(doResults(setValue, onError))
        .catch(onError);
    // .finally(() => setLoader(false));
}


export function loadAgencies(setLoader, setValue, onError = console.log) {
    //loadUsers({role: Roles.AGENCY}, setLoader, setValue, onError);

    setLoader(true);
    axios
        .get(`${baseApiUrl}/agencies`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function doWallets(transactions, setLoader, onSave, onError, lang) {
    setLoader(true);
    // console.log("transactions", transactions);
    axios
        .post(`${baseApiUrl}/wallets`, transactions)
        .then(doResults(() => {
            sendNotificationForTransactions(transactions, setLoader, onSave, onError, lang);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}


export function saveOrder(user, order, setLoader, onSaved, onError) {
    if (!user) {
        onError("No user");
        return;
    }

    const doc = {
        ...freshDoc(order),
        ...freshDoc(user),
        orderNo: createOrderNo(),
        status: OrderStatus.issued
    };

    console.log(doc);

    setLoader(true);
    axios
        .post(`${baseApiUrl}/orders`, doc)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function blockAmount(params, setLoader, onDone, onError) {
    const {wid, amount, cur, fee} = params || {};
    if(!wid) {
        onError("No Wallet defined");
        return;
    }
    const am = amount-(!fee ? 0 : fee);
    const doc = {
        [cur]: -am,
        [`${cur}-blocked`]: am
    };


    setLoader(true);
    axios
        .post(`${baseApiUrl}/wallets/${wid}`, doc)
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadInvoice(invoiceNo, setLoader, setValue, onError = console.log) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/gateway/invoice/${invoiceNo}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}


export function loadUserById(uid, setLoader, setValue, onError = console.log) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/users/${uid}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadWallet(wid, setLoader, setValue, onError = console.log) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/wallets/${wid}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function saveUser(user, setLoader, onSaved, onError) {
    axios
        .post(`${baseApiUrl}/users`, user)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}


export function loadAgency(aid, setLoader, setValue, onError = console.log) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/users/${aid}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadBranches(aid, setLoader, setValue, onError = console.log) {
    loadUsers({aid, role: Roles.BRANCH}, setLoader, setValue, onError);
}

export function saveBranch(branch, setLoader, onSaved, onError = console.log) {

}

export function rejectOrder(order, desc, setLoader, onDone, onError, locale = "en") {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/orders/rejectOrder`, order)
        .then(doResults(({notif, user}) => {
            sendTranNotification(notif, user, locale);
            onDone();
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadUserByWid(wid, setLoader, setValue, onError) {
    //TODO:
}

export function loadUsersByWid(wids, setLoader, setValue, onError) {
    //TODO:
}

export function acceptExchange(order, setLoader, onSave, onError, locale = "en") {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/orders/acceptExchange`, order)
        .then(doResults(transactions => {
            sendNotificationForTransactions(transactions, setLoader, onSave, onError, locale);
            onSave();
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function acceptTransfer(order, setLoader, onSave, onError, locale = "en") {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/orders/acceptTransfer`, order)
        .then(doResults(data => {
            const {stage, notif, transactions, user} = data;
            if(!stage) sendTranNotification(notif, user, locale);
            else sendNotificationForTransactions(transactions, setLoader, onSave, onError, locale);
            onSave();
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function acceptOrder(order, setLoader, onDone, onError, locale = "en") {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/orders/acceptOrder`, order)
        .then(doResults(({notif, user}) => {
            console.log(notif, user);
            sendTranNotification(notif, user, locale);
            onDone();
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function updateWallet(order, setLoader, onDone, onError) {

}

export function ordersQuery(bid, status) {
    //TODO:
    //TODO:
}

export function loadOrders(query, setValue, setLoader = () => {}, onError = console.log) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/orders?${q(query)}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadUsersQuery(query) {

}

export function loadUsers(query, setLoader, setValue, onError) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/users?${q(query)}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function loadBranch(bid, setLoader, setValue) {

}


export function loadRates(aid, setLoader, setValue, onError, limit = 1) {
    axios
        .get(`${baseApiUrl}/rates?${q({aid, limit})}`)
        .then(doResults(rates => {
            if(limit === 1) setValue(rates && rates.length > 0 ? rates[0] : {});
            else setValue(rates || []);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadRatesBranch(bid, setLoader, setValue, onError, limit = 1) {
    if(!bid) return;
    axios
        .get(`${baseApiUrl}/rates?${q({bid, limit})}`)
        .then(doResults(rates => {
            if(limit === 1) setValue(rates && rates.length > 0 ? rates[0] : {});
            else setValue(rates || []);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function loadFees(aid, setLoader, setValue, onError, limit = 1) {
    axios
        .get(`${baseApiUrl}/fees?${q({aid, limit})}`)
        .then(doResults(rates => {
            if(limit === 1) setValue(rates && rates.length > 0 ? rates[0] : {});
            else setValue(rates || []);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

function freshDoc(doc) {
    if(doc._id) delete doc._id;
    if(doc.updatedAt) delete doc.updatedAt;
    if(doc.createdAt) delete doc.createdAt;
    return doc;
}

export function saveRates(aid, uid, rates, setLoader, onSaved, onError) {
    const doc = {
        aid,
        uid,
        ...freshDoc(rates)
    };

    axios
        .post(`${baseApiUrl}/rates`, doc)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

const FILLED_H = new Array(366).fill(-1.0);
function initH() {
    let H = {};
    for(const cur in CurrencyDef) {
        H[cur] = FILLED_H;
    }
    return H;
}
const INIT_H = initH();

function getDayOfYear() {
    //const m = moment();
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    console.log("day", day - 1);
    return day - 1;
}


function calcRatesHistory(rates) {
    const {H = INIT_H, bronze: {b}} = rates || {bronze: {b: 1}};
    console.log("calcRatesHistory1", H);
    const d = getDayOfYear();
    for(const cur in CurrencyDef) {
        if(!H[cur]) H[cur] = FILLED_H;
        H[cur][d] = b*(cur === "usd" ? 1 : rates[cur]);
        for(let i=d+1; i<=d+7; i++) H[cur][i%366] = -2;
    }
    console.log("calcRatesHistory2", H);
    return H;
}

export function saveRatesBranch(bid, uid, rates, setLoader, onSaved, onError) {
    if(!rates) return;
    if(rates.aid) delete rates.aid;

    const doc = {
        bid,
        uid,
        H: calcRatesHistory(rates),
        // H: calcRatesHistoryDummy(rates),
        ...freshDoc(rates)
    };

    axios
        .post(`${baseApiUrl}/rates`, doc)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));


}

export function checkPayment(data, setLoader, onSaved, onError) {
    axios
        .post(`${baseApiUrl}/gateway/check`, data)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function saveFees(aid, uid, fees, setLoader, onSaved, onError) {
    const doc = {
        aid,
        uid,
        ...freshDoc(fees)
    };

    axios
        .post(`${baseApiUrl}/fees`, doc)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function walletQuery(wid) {
    //TODO:
    //TODO:
}

export function changePassword(curPassword, newPassword, setLoader, onError, onDone) {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/users/changePassword`, {curPassword, newPassword})
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function transHistQuery(limit, opt = {}) {
    //TODO:
    //TODO:
}


export const updateEffect = (updater, timeout = 10000) => () => {
    // updater();
    const handler = setInterval(() => {
        updater();
    }, timeout);
    return () => {
        clearInterval(handler);
    }
};
