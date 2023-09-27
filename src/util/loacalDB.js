function createKey(key) {
    return key + '';
}


export function getItem(key, defValue) {
    return typeof Storage === "undefined" ? defValue : JSON.parse(localStorage.getItem(createKey(key))) || defValue;
}

export function setItem(key, value) {
    if (typeof Storage === "undefined") return;
    const fkey = createKey(key);
    if (!value) localStorage.removeItem(fkey);
    else localStorage.setItem(fkey, JSON.stringify(value));
}


export const DEF_AGENCY = {
    v: "bahbahan",
    l: "BAHBAHAN",
    logo2: "static/logo2-bahbahan.png",
    logo3: "static/logo3-bahbahan.png",
};


export const DEF_AGENCY_nnw2 = {
    v: "nnw2",
    l: "No Name Wallet",
    logo2: "static/logo2-nnw.png",
    logo3: "static/logo3-nnw.png",
};


export const DEF_AGENCY_tav = {
    v: "tav",
    l: "TAV Energy",
    logo2: "static/logo2-tav.png",
    logo3: "static/logo3-tav.png",
};


export const USER = "user";
export const AGENCY = "agency";
export const BRANCH = "branch";
export const AID = "aid";
