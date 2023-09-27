import React from "react";
import IntlMessages from "./IntlMessages";
import {useIntl} from "react-intl";
import {Tran} from "../lngProvider";
import {CurrencyDef} from "jozdan-common";

var _reactNotifications = require("react-notifications");

const ValidToastTypes = ['error', 'info', 'success', 'warning'];

export function toast(message, type = "error", header, timeout = 3000) {
    _reactNotifications.NotificationManager[ValidToastTypes.indexOf(type) >= 0 ? type : 'info'](message, header, timeout);
}

export function notImpl() {
    toast("**Oops!: Not implemented yet!")
}


const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const rePhone = /^\+{0,2}[0-9]+/;

export function validateEmail(email) {
    return reEmail.test(String(email).toLowerCase());
}

export function validString(str) {
    return str;
}

export function validPassword(str) {
    return str && str.length >= 6;
}

export function validPhone(phone) {
    return rePhone.test(phone);
}


export function getFormError(field, value, isValid = p => p !== "", errors = {}) {
    return isValid(value) ? "" : errors[field];
}

export function camelCase(str = "") {
    return !str ? str : str.split(" ").map(p => p[0].toUpperCase() + p.substring(1));
}

export function fillModel(Model, getValue) {
    const all = {};
    Object.keys(Model).forEach(field => {
        all[field] = getValue(field);
    });
    return all;
}

export function getInitValues(Model, initValue) {
    return fillModel(Model, f => initValue);
}

export function commafy(num) {
    if (!num) return '0';
    var str = num.toString().split('.');

    if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }

    // if (str[1] && str[1].length >= 4) {
    //     str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    // }

    return str.join('.');
}

export function showErrors(errs = []) {
    errs.forEach(e => toast(e));
}

//+98 913 383 4091

const CODE = [4, 11, 9, 2, 14, 5, 0, 13, 10, 6, 1, 8, 12, 3, 7];
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];

const SPACES = "+-() ";
export function buildCustomerNumber(phone) {

    let p = phone || "";
    for(const x of SPACES) p = p.split(x).join("");
    while (p.length < 15) p = '0'+p;


    if(p.length > 15) p = p.substring(p.length-15, p.length);
    // console.log("ppp", p);

    //if(!p.every(p => p >= '0' && p <= '9')) return "NA";

    let a = [];
    for(const ch of p) a.push(9-1*ch);
    if(!a.every(x => !isNaN(x) && x >= 0 && x <= 9)) return "NA";

    // console.log(a);

    //
    // let sum = 0;
    // for(const i in arr) {
    //     console.log(i + " "+ arr[i]);
    //     sum += (1+i)*arr[i];
    // }
    // console.log(sum);

    // for(let i=0; i<15; i++) a[i] = i;

    //a: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    // console.log("a", a);
    // let b = [];
    // for(let i=0; i<8; i++) {
    //     if(i === 7) {
    //         b[14] = a[14];
    //     } else {
    //         b[2*i] = a[i];
    //         b[2*i+1] = a[i+7];
    //     }
    // }
    // //b: [0, 7, 1, 8, 2, 9, 3, 10, 4, 11, 5, 12, 6, 13, 14]
    // // console.log("b", b);
    //
    // let c = [];
    // for(let i=0; i<8; i++) {
    //     if(i === 7) {
    //         c[14] = b[14];
    //     } else {
    //         c[2*i] = b[i];
    //         c[2*i+1] = b[i+7];
    //     }
    // }
    // //c: [0, 10, 7, 4, 1, 11, 8, 5, 2, 12, 9, 6, 3, 13, 14]
    // // console.log("c", c);
    //
    //

    //console.log(arr);

    let c = [];
    for(let i=0; i<15; i++) {
        c[i] = a[CODE[i]];
    }

    // let sum = 0;
    // for(let i=0; i<15; i++) {
    //     // console.log(i + " "+ c[i]);
    //     sum += (1+i)*c[i];
    // }
    c[15] = checkSum(c);
    // console.log(sum, c[15], sum%10);


    return c.join("");


    // return p;
}

export function sumDigits(n) {
    let sum = 0;
    while (n > 0) {
        sum += n % 10;
        n = Math.floor(n / 10);
    }
    return sum;
}

export function sumDigits0(n) {
    while (n >= 10) n = sumDigits(n);
    return n;
}

function checkSum(c) {
    let sum = 7;
    for(let i=0; i<15; i++) {
        const a = 1*c[i];
        // if(isNaN(a) || a < 0 || a > 9) return -2537;
        sum += PRIMES[i]*a;
    }
    return sumDigits0(sum);
}

export const getFlagUri = cur => {
    return require(`assets/flags/${cur}.png`);
    // const {cc} = CurrencyDef[cur || "usd"];
    // if(cc === "ir") return require("assets/itc.png");
    // return `https://www.countryflags.io/${cc}/shiny/48.png`;
};


export function formalCustomerNumber(number) {
    return (number || "").split("-").join("");
}

export function validCustomerNumber(number) {
    const p = formalCustomerNumber(number || "");
    if(p.length !== 16) return false;
    let sum = 0;
    let c = [];
    for(let i=0; i<16; i++) {
        const a = 1*p[i];
        if(isNaN(a) || a < 0 || a > 9) return false;
        c.push(a);
    }
    console.log(c);
    return 1*p[15] === checkSum(c);
}

export function stdCustomerNumber(number) {
    // return number;
    if(!number || number.length !== 16) return "NA";
    return [
        number.substring(0, 4),
        number.substring(4, 8),
        number.substring(8, 12),
        number.substring(12, 16),
    ].join("-");
}

export function range(from = 0, to = 100) {
    let arr = [];
    for(let i=from; i<to; i++) arr.push(i);
    return arr;
}

export function chunck(arr = [], len = 10) {
    let ret = [];
    for(let i=0; i<arr.length; i+=len) ret.push(arr.slice(i, i+len));
    return ret;
}

export function union(arr1, arr2) {
    let l = arr1 || [];
    for(let a of arr2) {
        if(!l.includes(a)) l.push(a);
    }
    return l;

}

export function runTest() {
    // console.log("runTest", chunck(range(0, 16)));

    // console.log("runTest", union(range(30, 63), range(50, 70)))

    for(let i=0; i<20; i++) {
        // const {id} = users[i];
        const phone = "+9891234567"+(i < 10 ? "8"+i : (i).toString());
        const cn = buildCustomerNumber(phone);

        console.log(phone, stdCustomerNumber(cn), validCustomerNumber(cn));
    }
}

export function createWid(user) {
    const {phone} = user || {};
    return !phone ? undefined : buildCustomerNumber(phone);
}

export function T2(id) {
    return <IntlMessages id={id}/>;
}

export function T3(id) {
    const {formatMessage} = useIntl();
    return formatMessage({ id }) || id;
}

export const T4 = (id) => id;

export function getCurrencyName(cur, locale) {
    return Tran(`cur.${cur}.l`, locale);
}

export function getCurrencySymbol(cur, locale) {
    return Tran(`cur.${cur}.sym`, locale);
}

export function toUpperCase(cur, locale) {
    return Tran(`cur.${cur}.s`, locale);
}

