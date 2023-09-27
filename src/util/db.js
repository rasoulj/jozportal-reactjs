/*
import {firestore, auth, serverTimestamp, increment} from "../firebase/firebase";
import {
    buildCustomerNumber,
    camelCase,
    formalCustomerNumber,
    getCurrencyName,
    stdCustomerNumber,
    toast,
    toUpperCase
} from "./index";
import {updatedAt, C, OrderTypes, OrderStatus, CurrencyDef, toTwoDigit} from "jozdan-common"
import {Roles} from "../models/User";
import {v4 as uuid} from "uuid";
import moment from "moment";
import {getOrderTypeName, Tran} from "../lngProvider";

const serverToken = "AAAASq7-ohM:APA91bGxLcOfw69XhSl0mJnQ026YqhyBLriCS3E-5gQDjpiOkm34H_GUJJKrFGBHQkuiB35ph90r4LcMH7XtU0FuMAuhImhu5agT-kC7xg37YSNOKaAjtsT8_SMiwoHNBuCUgYyFiWhp";

export const createOrderNo = function () {

    const r = Math.floor(1000*Math.random());
    const rand = r < 100 ? "0"+r : r < 10 ? "00"+r : ""+r;

    const now = Date.now();

    const cc = now+rand;
    // console.log(cc);
    return cc.substring(cc.length-16);

};

export function loadUserById(uid, setLoader, setValue, onError = console.log) {
    setLoader(true);
    const path = `${C.users}/${uid}`;
    firestore
        .doc(path)
        .get()
        .then(pp => setValue(pp.exists ? pp.data() : null))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadUser(setLoader, setValue) {
    const {uid} = auth.currentUser || {uid: "NA"};
    loadUserById(uid, setLoader, setValue);
}




export function createUserFirebase(user, setLoader, onCreated, onError) {
    const {email, password, phone} = user;
    if(!phone) {
        // toast("Cannot create user with no phone");
        onError({message: "Cannot create user with no phone"});
        return;
    }

    loadUsers({phone}, setLoader, users => {
        if (users && users.length > 0) {
            //DELETED
            const {aid} = users[0];
            if(!!aid && aid.startsWith("DELETED")) onCreated(users[0]);
            else onError({message: "A user with this phone number already registered"});
        } else auth.createUserWithEmailAndPassword(email, password).then(({user}) => {
            console.log(user);
            onCreated(user);
        }).catch(onError).finally(() => setLoader(false));
    }, onError);


}

export function loadAgency(aid, setLoader, setValue) {
    setLoader(true);
    // const {uid} = auth.currentUser || {uid: "NA"};
    const path = `${C.users}/${aid}`;
    firestore
        .doc(path)
        .get()
        .then(pp => setValue(pp.exists ? pp.data() : null))
        .finally(() => setLoader(false));
}

export function getData({docs}) {
    return (docs || []).map(d => {
        return {id: d.id, ...d.data()};
    });
}



export function loadBranches(aid, setLoader, setValue) {
    setLoader(true);
    firestore
        .collection(C.users)
        .where("aid", "==", aid)
        .where("role", "==", Roles.BRANCH)
        .get()
        .then(pp => setValue(getData(pp)))
        .finally(() => setLoader(false));
}

export function rejectOrder(order, desc, setLoader, onDone, onError, locale = "en") {
    // console.log("order", order);
    const {id, type, amount, wid, cur} = order;

    let batch = firestore.batch();

    let orderRef = firestore.doc(`${C.orders}/${id}`);
    batch.update(orderRef, {status: OrderStatus.rejected, desc});
    if(type === OrderTypes.withdraw || type === OrderTypes.exchange || type === OrderTypes.transfer) {
        let walletRef = firestore.doc(`${C.wallets}/${wid}`);
        batch.set(walletRef, {[cur]: increment(amount), [cur+"-blocked"]: increment(-amount)}, {merge: true});
    }

    setLoader(true);
    batch.commit().then(() => {
        onDone();

        loadUserByWid(wid, setLoader, user => {
            sendTranNotification({...order, status: OrderStatus.rejected}, user, locale);
        }, console.log);

    }).catch(onError).finally(() => setLoader(false));
    // firestore.doc(path)
    //     .update({status, desc})
    //     .then(onDone)
    //     .catch(onError)
    //     .finally(() => setLoader(false));
}


export function loadUserByWid(wid, setLoader, setValue, onError) {
    let q = firestore.collection(C.users).where("wid", "==", wid);
    setLoader(true);
    // setValue(pp.empty ? {} : pp.docs[0].data())
    q.get().then(pp => setValue(pp.empty ? null : pp.docs[0].data())).catch(onError).finally(() => setLoader(false));
}



function getTransDesc(transaction, user, locale) {
    const {wid, amount, cur, type, status} = transaction;

    return Tran(`orders.${status === OrderStatus.accepted ? "acc" : "rej"}.mes`, locale);
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


export function loadUsersByWid(wids, setLoader, setValue, onError) {
    let q = firestore.collection(C.users).where("wid", "in", wids);
    setLoader(true);
    q.get().then(pp => setValue(getData(pp))).catch(onError).finally(() => setLoader(false));
}


export function sendNotificationForTransactions(transactions, setLoader, onDone, onError, lang) {
    // const {wid, amount, cur, desc, type} = transaction;
    const wids = transactions.map(t => t.wid);
    // console.log("wids", wids);
    loadUsersByWid(wids, setLoader, users => {
        for (const transaction of transactions) {
            transaction.status = OrderStatus.accepted;
            const {wid} = transaction;
            const user = users.find(u => u.wid === wid);
            sendTranNotification(transaction, user, lang);
            // console.log("tran", tran);
        }
        if(onDone) onDone();
        // console.log("users", users.map(p => p.token));
    }, onError);


}

// function getExchangeTransactions(params) {
//     const {amount, oAmount, cur, ocur, bwid, wid, bid} = params || {};
//     return [
//         //TODO: {amount: -amount, wid: formalCustomerNumber(wid), cur, desc: `Exchanged to ${toUpperCase(ocur)}`, type: OrderTypes.exchange, ocur, oAmount, bid},
//         {amount: oAmount, wid: formalCustomerNumber(wid), cur: ocur, desc: `Exchanged from ${toUpperCase(cur)}`, type: OrderTypes.exchange, ocur: cur, oAmount, bid},
//
//         {amount: amount, wid: formalCustomerNumber(bwid), cur, desc: `Exchanged from ${toUpperCase(ocur)} by User=${wid}`, type: OrderTypes.exchange, ocur, oAmount, owid: wid, bid},
//         {amount: -oAmount, wid: formalCustomerNumber(bwid), cur: ocur, desc: `Exchanged to ${toUpperCase(cur)} by User=${wid}`, type: OrderTypes.exchange, ocur, oAmount, owid: wid, bid},
//     ];
// }


export function acceptExchange(order, setLoader, onSave, onError, locale = "en") {
    // const transactions = getExchangeTransactions(order);
    const {updatedAt: issueDate, id, cur, amount, wid, transactions = []} = order;
    let batch = firestore.batch();

    let orderRef = firestore.doc(`${C.orders}/${id}`);
    batch.update(orderRef, {status: OrderStatus.accepted});

    const path = `${C.wallets}/${wid}`;
    let walletRef = firestore.doc(path);
    batch.set(walletRef, {
        [cur+"-blocked"]: -amount
    }, {merge: true});


    console.log("order", order);
    const trans = (transactions || []).filter(p => !!p.amount);
    for (const transaction of trans) {
        console.log("transaction", transaction);
        const {bid, wid, amount, cur, desc, type, ocur = "", oAmount = 0.0, cwid = "", fee = 0.0, hasDone} = transaction;
        if (wid && wid.length > 0) {
            const path = `${C.wallets}/${wid}`;
            let ref = firestore.doc(path);
            if(!hasDone) batch.set(ref, {[cur]: increment(amount)}, {merge: true});

            let refHist = firestore.doc("hist/" + uuid());
            batch.set(refHist, {
                bid,
                isPositive: amount >= 0,
                desc,
                cur,
                type,
                wid,
                ocur,
                oAmount,
                cwid,
                fee,
                amount: Math.abs(amount),
                updatedAt: serverTimestamp(),
                issueDate,
                orderNo: createOrderNo()
            }, {merge: true});
        }
    }
    setLoader(true);
    batch.commit().then(() => {
        sendNotificationForTransactions(transactions, setLoader, onSave, onError, locale);
    }).catch(err => {
        console.log("Error ---", err);
        onError(err);
        // setLoader(false);
    }).finally(() => setLoader(false));
}


export function acceptTransfer(order, setLoader, onSave, onError, locale = "en") {
    const {updatedAt: issueDate, id, cur, amount, wid, transactions, stage, bid, obid, branch: {displayName: bname}, obranch: {displayName: oname}} = order;

    let orderRef = firestore.doc(`${C.orders}/${id}`);

    if(!stage) {//Step #1
        setLoader(true);
        orderRef.set({
            stage: 2,
            bid: obid,
            orig_bid: bid
        }, {merge: true}).then(() => {
            loadUsersByWid([wid], setLoader, users => {
                if(!users || users.loader === 0) return;
                const body = "Your transfer has been approved at "+bname+", waiting to be approved at: "+oname;
                sendNotification({title: bname, body}, users[0]);
            }, onError);
            onSave();
        }).catch(onError).finally(() => setLoader(false));
        return;
    }

    let batch = firestore.batch();

    batch.update(orderRef, {status: OrderStatus.accepted});

    const path = `${C.wallets}/${wid}`;
    let walletRef = firestore.doc(path);
    batch.set(walletRef, {
        [cur+"-blocked"]: -amount
    }, {merge: true});


    console.log("order", order);
    const trans = (transactions || []).filter(p => !!p.amount);
    for (const transaction of trans) {
        console.log("transaction", transaction);
        const {bid, wid, amount, cur, desc, type, ocur = "", oAmount = 0.0, cwid = "", fee = 0.0, hasDone} = transaction;
        if (wid && wid.length > 0) {
            const path = `${C.wallets}/${wid}`;
            let ref = firestore.doc(path);

            if(!hasDone) batch.set(ref, {[cur]: increment(amount)}, {merge: true});

            let refHist = firestore.doc("hist/" + uuid());
            batch.set(refHist, {
                bid,
                isPositive: amount >= 0,
                desc,
                cur,
                type,
                wid,
                ocur,
                oAmount,
                cwid,
                fee,
                amount: Math.abs(amount),
                updatedAt: serverTimestamp(),
                issueDate,
                orderNo: createOrderNo()
            }, {merge: true});
        }
    }
    setLoader(true);
    batch.commit().then(() => {
        sendNotificationForTransactions(transactions, setLoader, onSave, onError, locale);
    }).catch(err => {
        console.log("Error ---", err);
        onError(err);
        // setLoader(false);
    }).finally(() => setLoader(false));
}


export function acceptOrder(order, setLoader, onDone, onError, locale = "en") {
    let batch = firestore.batch();
    // const {id} = order;
    console.log("order", order);
    // return;
    const {updatedAt: issueDate, id, uid, cur, amount, type, wid} = order;

    console.log("wid", wid);



    let orderRef = firestore.doc(`${C.orders}/${id}`);
    batch.update(orderRef, {status: OrderStatus.accepted});

    const path = `${C.wallets}/${wid}`;
    let walletRef = firestore.doc(path);
    batch.set(walletRef, {
        [cur]: increment(type === OrderTypes.topUp ? amount : 0),
        [cur+"-blocked"]: increment(type === OrderTypes.withdraw ? -amount : 0)
    }, {merge: true});

    let refHist = firestore.doc("hist/"+uuid());
    batch.set(refHist, {
        ...order,
        isPositive: amount >= 0,
        desc: "Offline order",
        amount: Math.abs(amount),
        updatedAt: serverTimestamp(),
        issueDate
    }, {merge: true});

    setLoader(true);
    batch.commit().then(() => {
        onDone();

        loadUserByWid(wid, setLoader, user => {
            sendTranNotification({...order, status: OrderStatus.accepted}, user, locale);
        }, console.log);

    }).catch(onError).finally(() => setLoader(false));

}

export function updateWallet(order, setLoader, onDone, onError) {
    const {uid, cur, amount, type} = order;
    const path = `${C.wallets}/${uid}`;
    console.log(path);
    setLoader(true);
    firestore.doc(path)
        // .update({[cur]: firestore.FieldValue.increment(type === OrderTypes.topUp ? amount : -amount)})
        .set({[cur]: increment(type === OrderTypes.topUp ? amount : -amount)}, {merge: true})
        .then(onDone)
        .catch(onError)
        .finally(() => setLoader(false));
}

export function ordersQuery(bid, status) {
    return firestore
        .collection(C.orders)
        .where("bid", "==", bid || "")
        .where('status', "==", status || "");
}

export function loadOrders(bid, status, setLoader, setValue, onError) {
    setLoader(true);
    ordersQuery(bid, status)
        .get()
        .then(pp => setValue(getData(pp)))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function loadUsersQuery(query) {
    const {aid, bid, uid, status, role, phone, wid, email, limit} = query || {};
    let q = firestore.collection(C.users);
    if(email) q = q.where("email", "==", email);
    if(phone) q = q.where("phone", "==", phone);
    if(wid) q = q.where("wid", "==", formalCustomerNumber(wid));
    if(aid) q = q.where("aid", "==", aid);
    if(bid) q = q.where("bid", "==", bid);
    if(uid) q = q.where("uid", "==", uid);
    if(status) q = q.where("status", "==", status);
    if(role) q = q.where("role", "==", role);
    if(limit) q = q.limit(limit);
    return q;
}

export function fillPhones(setLoader, onDone, onError) {
    return;//
    setLoader(true);
    let q = firestore.collection(C.users).where("role", "==", Roles.BRANCH).get().then(async pp => {
        const users = getData(pp);
        // console.log(users);
        for(const i in users) {
            const {id} = users[i];
            const phone = "+9893534567"+(i < 10 ? "8"+i : (i).toString());
            const wid = buildCustomerNumber(phone);
            await firestore.collection(C.users).doc(id).set({phone, wid}, {merge: true});
            console.log(phone, id, wid);
        }
    }).catch(onError).finally(() => setLoader(false));


}

export function loadUsers(query, setLoader, setValue, onError) {
    setLoader(true);
    loadUsersQuery(query).get().then(pp => setValue(getData(pp))).catch(onError).finally(() => setLoader(false));
}


export function loadBranch(bid, setLoader, setValue) {
    setLoader(true);
    firestore
        .doc(`${C.users}/${bid}`)
        .get()
        .then(pp => setValue(pp.exists ? pp.data() : null))
        .finally(() => setLoader(false));
}



export function saveBranch(branch, setLoader, onSaved, onError = console.log) {
    const {bid, phone} = branch;

    if(!phone) {
        onError({message: "Branch has no PHONE, cannot be saved"});
        return;
    }


    const path = `${C.users}/${bid}`;
    setLoader(true);
    firestore.doc(path).set({
        ...branch,
        wid: buildCustomerNumber(phone),
        role: Roles.BRANCH,
        uid: bid
    }, {merge: true}).then(onSaved).catch(onError).finally(() => {
        setLoader(false)
    });
}

export function saveBranch_old(branch, setLoader, onSaved) {
    const {bid} = branch;
    const path = `${C.branches}/${bid}`;
    setLoader(true);
    firestore.doc(path).set(branch).finally(() => {
        onSaved();
        setLoader(false)
    });
}



export function createUserAndAccount(user, setLoader, onSaved, onError) {
    let batch = firestore.batch();


}

export function saveUser(user, setLoader, onSaved, onError) {
    // console.log("auth.currentUser.uid", auth.currentUser.uid);
    if(!user) return;
    const {uid, phone} = user;
    if(!uid) {
        toast("User has no uid, cannot be saved", "error");
        return;
    }
    if(!phone) {
        toast("User has no PHONE, cannot be saved", "error");
        return;
    }
    const path = `${C.users}/${uid}`;
    setLoader(true);
    firestore
        .doc(path)
        .set({...user, wid: buildCustomerNumber(phone)})
        .then(() => {
            // setLoader(false);
            if(onSaved) onSaved(user);
        })
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadRates(aid, setLoader, setValue, onError, limit = 1) {
    if(!aid) return;
    setLoader(true);
    firestore
        .collection(C.rates)
        .where("aid", "==", aid)
        .orderBy(updatedAt, "desc")
        .limit(limit).get().then(pp => {
            console.log("loadRates: ", pp.docs[0].data());
            if(limit === 1) setValue(pp.empty ? {} : pp.docs[0].data());
            else setValue(pp.empty ? [] : pp.docs.map(p => p.data()));
        }).catch(onError).finally(() => setLoader(false));
}

export function loadRatesBranch(bid, setLoader, setValue, onError, limit = 1) {
    if(!bid) return;
    setLoader(true);
    firestore
        .collection(C.rates)
        .where("bid", "==", bid)
        .orderBy(updatedAt, "desc")
        .limit(limit).get().then(pp => {
        // console.log(pp.docs[0].data());
        if(limit === 1) setValue(pp.empty ? {} : pp.docs[0].data());
        else setValue(pp.empty ? [] : pp.docs.map(p => p.data()));
    }).catch(onError).finally(() => setLoader(false));
}


export function loadFees(aid, setLoader, setValue, onError, limit = 1) {
    if(!aid) return;
    setLoader(true);
    firestore
        .collection(C.fees)
        .where("aid", "==", aid)
        .orderBy(updatedAt, "desc")
        .limit(limit).get().then(pp => {
        console.log(pp.docs[0].data());
        if(limit === 1) setValue(pp.empty ? {} : pp.docs[0].data());
        else setValue(pp.empty ? [] : pp.docs.map(p => p.data()));
    }).catch(onError).finally(() => setLoader(false));
}

export function saveRates(aid, uid, rates, setLoader, onSaved, onError) {
    setLoader(true);
    firestore.collection(C.rates).add({
        aid,
        uid,
        ...rates,
        updatedAt: serverTimestamp()
    }).then(onSaved).catch(onError).finally(() => setLoader(false));
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



function calcRatesHistoryDummy(rates) {
    const {H = INIT_H, bronze: {b}} = rates || {bronze: {b: 1}};
    const d = 0;//getDayOfYear();
    for(const cur in CurrencyDef) {
        let price = b*(cur === "usd" ? 1 : rates[cur]);
        H[cur][d] = price;
        for(let i=d+1; i<=d+366; i++) {
            const rand = 1+(2*Math.random()-1)/20.0;
            price *= rand;
            H[cur][i%366] = i % 7 >= 5 ? -3 : price;
        }
    }
    return H;
}


export function saveRatesBranch(bid, uid, rates, setLoader, onSaved, onError) {
    if(!rates) return;
    if(rates.aid) delete rates.aid;

    // console.log("rates22", calcRatesHistoryDummy(rates));

    // return;

    setLoader(true);
    firestore.collection(C.rates).add({
        bid,
        uid,
        H: calcRatesHistory(rates),
        // H: calcRatesHistoryDummy(rates),
        ...rates,
        updatedAt: serverTimestamp()
    }).then(onSaved).catch(onError).finally(() => setLoader(false));
}


export function saveFees(aid, uid, fees, setLoader, onSaved, onError) {
    setLoader(true);
    firestore.collection(C.fees).add({
        aid,
        uid,
        ...fees,
        updatedAt: serverTimestamp()
    }).then(onSaved).catch(onError).finally(() => setLoader(false));
}



export function walletQuery(wid) {
    return firestore.doc(`${C.wallets}/${wid}`)
}

export function changePassword(password, newPassword, setLoader, onError, onDone) {
    if(!auth || !auth.currentUser) {
        onError({message: "User not logged in"});
        return;
    }

    const {email} = auth.currentUser;

    // console.log("auth.currentUser.email: ", email);
    // return;
    setLoader(true);

    auth.signInWithEmailAndPassword((email || "").toLowerCase(), password).then(authUser => {
        auth.currentUser
            .updatePassword(newPassword)
            .then(onDone)
            .catch(onError)
            .finally(() => setLoader(false));
    }).catch(err => {
        setLoader(false);
        onError(err);
    });
}

export function isEmpty(querySnapShot) {
    return !querySnapShot || querySnapShot.empty;
}


export function transHistQuery(limit, opt = {}) {
    const {orderNo, cur, type, dateFrom, dateTo, amountFrom, amountTo, wid, bid} = opt;
    // console.log("limit, cur", limit, cur);
    let q = firestore.collection("hist");
    if (bid && bid !== "") q = q.where("bid", "==", bid);
    if (wid && wid !== "") q = q.where("wid", "==", wid);
    if (cur && cur !== "") q = q.where("cur", "==", cur);
    if (type && type !== "") q = q.where("type", "==", type);
    if (orderNo && orderNo !== "") q = q.where("orderNo", "==", orderNo);
    if (amountFrom) q = q.where("amount", ">", amountFrom);
    if (amountTo) q = q.where("amount", "<=", amountTo);
    if(amountFrom || amountTo) q = q.orderBy("amount");
    if (dateFrom) q = q.where(updatedAt, ">=", dateFrom);
    if (dateTo) q = q.where(updatedAt, "<=", dateTo);
    if (limit) q = q.limit(limit);
    return q.orderBy(updatedAt, "desc");
}

*/