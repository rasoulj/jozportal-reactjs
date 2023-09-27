import {SET_PAX_VALUE} from "../constants/ActionTypes";

export const setValues = (dictValues = {}, save = false) => {
    for(const key in dictValues) {
        if(!dictValues[key] && dictValues[key] !== 0) dictValues[key] = "";
    }
    return {
        type: SET_PAX_VALUE,
        payload: {dictValues, save}
    }
};


export const setLoader = (loader = true) => {
    return setValues({loader});
};
