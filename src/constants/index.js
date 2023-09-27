export const delColor = "danger";

export const appVer = "1.0.9";
export const contactUsCard = "BEGIN:VCARD VERSION:3.0 N:Wallet;No;Name;; FN:No Name Wallet TEL;TYPE=CELL:+447937011819 TEL;TYPE=CELL:+447937011819 EMAIL;TYPE=HOME:info@nonamewallet.com ORG:No Name Wallet Company TITLE:Support END:VCARD";

export const WhiteCopies = {
    nnw: "nnw",
    fanoos: "fanoos",
    maabar: "maabar",
    bahbahan: "bahbahan",
    tav: "tav",
};

export const ActiveWhiteCopy = WhiteCopies.bahbahan;

/*
const webUrl = "http://www.nonamewallet.com";
const supportEmail = "support@nonamewallet.com";
const supportTel = "+964 783 170 8035";

 */

export const WhiteCopyConfig = {
    [WhiteCopies.nnw]: {
        webUrl: "http://www.nonamewallet.com",
        supportEmail: "support@nonamewallet.com",
        supportTel: "+964 783 170 8035",

        logo2: require("assets/logo2-nnw.png"),
        logo3: require("assets/logo3-nnw.png"),
        mainTitle: "No Name Wallet",
        copyrightTitle: "Copyright NO Name Wallet Project (c) 2020",
    },
    [WhiteCopies.fanoos]: {
        webUrl: "http://www.nonamewallet.com",
        supportEmail: "support@nonamewallet.com",
        supportTel: "+964 783 170 8035",

        logo2: require("assets/logo2-fanoos.png"),
        logo3: require("assets/logo3-fanoos.png"),
        mainTitle: "Fanoos Group",
        copyrightTitle: "Copyright Fanoos Group Project (c) 2020",
    },
    [WhiteCopies.maabar]: {
        webUrl: "http://www.nonamewallet.com",
        supportEmail: null,
        supportTel: null,

        logo2: require("assets/logo2-maabar.png"),
        logo3: require("assets/logo3-maabar.png"),
        mainTitle: "MAABAR Group",
        copyrightTitle: "Copyright MAABAR Group Project (c) 2020",
    },
    [WhiteCopies.bahbahan]: {
        webUrl: "http://www.bahbahan.com",
        supportEmail: null,
        supportTel: null,

        logo2: require("assets/logo2-bahbahan.png"),
        logo3: require("assets/logo3-bahbahan.png"),
        mainTitle: "BAHBAHAN Group",
        copyrightTitle: "Copyright BAHBAHAN Project (c) 2020",
    },
    [WhiteCopies.tav]: {
        webUrl: "http://www.bahbahan.com",
        supportEmail: null,
        supportTel: null,

        logo2: require("assets/logo2-tav.png"),
        logo3: require("assets/logo3-tav.png"),
        mainTitle: "TAV Energy",
        copyrightTitle: "Copyright TAV Project (c) 2020",
    },
};

const {logo2, logo3, mainTitle, copyrightTitle} = WhiteCopyConfig[ActiveWhiteCopy];

export const getLogo2 = () => logo2;
// export const getLogo3 = () => logo3;
// export const getMainTitle = () => mainTitle;
export const getCopyrightTitle = () => copyrightTitle;

const maabar = {
    "password": "123456",
    "phone": "+981111111111",
    "address": "address1",

    "uid": "maabar",
    "webUrl": "http://www.nonamewallet.com",
    "supportEmail": "support@nonamewallet.com",
    "supportTel": "+964 783 170 8035",

    "logo2": "static/logo2-maabar.png",
    "logo3": "static/logo3-maabar.png",
    "displayName": "MAABAR Group",
    "copyrightTitle": "Copyright MAABAR Group Project (c) 2020",
    "defaultLang": "ar",
    "hideSelectCurrencies": true,
    "wid": "new"
};


const fanoos = {
    "password": "123456",
    "phone": "+982222222222",
    "address": "address2",

    "uid": "fanoos",
    "webUrl": "http://www.nonamewallet.com",
    "supportEmail": "support@nonamewallet.com",
    "supportTel": "+964 783 170 8035",

    "logo2": "static/logo2-fanoos.png",
    "logo3": "static/logo3-fanoos.png",
    "displayName": "Fanoos Group",
    "copyrightTitle": "Copyright Fanoos Group Project (c) 2020",
    "defaultLang": "fa",
    "hideSelectCurrencies": false,
    "wid": "new"
};

const nnw = {
    "password": "123456",
    "phone": "+983333333333",
    "address": "address3",

    "uid": "nnw",
    "webUrl": "http://www.nonamewallet.com",
    "supportEmail": "support@nonamewallet.com",
    "supportTel": "+964 783 170 8035",

    "logo2": "static/logo2-nnw.png",
    "logo3": "static/logo3-nnw.png",
    "displayName": "No Name Wallet",
    "copyrightTitle": "Copyright NO Name Wallet Project (c) 2020",
    "defaultLang": "en",
    "hideSelectCurrencies": false,
    "wid": "new"
};
