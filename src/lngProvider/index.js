import enLang from './entries/en-US';
import zhLang from './entries/zh-Hans-CN';
import arLang from './entries/ar_SA';
import itLang from './entries/it_IT';
import esLang from './entries/es_ES';
import frLang from './entries/fr_FR';
import faLang from "./entries/fa_IR";
import trLang from "./entries/tr_TUR";
import kuLang from "./entries/ku_TR";

const AppLocale = {
    en: enLang,
    zh: zhLang,
    ar: arLang,
    it: itLang,
    es: esLang,
    fr: frLang,
    fa: faLang,
    tr: trLang,
    ku: kuLang
};

export default AppLocale;

export function Tran(id, locale) {
    if(!locale || locale.length < 2) return id;
    // console.log("locale", locale, locale.substring(0, 2), AppLocale["ar"]);
    const {messages} = AppLocale[locale.substring(0, 2)] || {messages: {}};
    return messages[id] || id;
}

export function getOrderTypeName(id, locale) {
    return Tran(`tran.services.${id}`, locale);
}
