import {SET_PAX_VALUE, SIGNOUT_USER} from "../constants/ActionTypes";
import {AGENCY, AID, BRANCH, DEF_AGENCY, getItem, setItem, USER} from "../util/loacalDB";
import {ActiveWhiteCopy} from "../constants";




const initialPax = {
    loader: false,
    [AID]:  ActiveWhiteCopy, // "bahbahan", // getItem(AID, "nnw"),
    [USER]:  getItem(USER),
    [AGENCY]: getItem(AGENCY, DEF_AGENCY),
    [BRANCH]: getItem(BRANCH),
};

const pax = (state = initialPax, action) => {
    const {type = "NA", payload = {}} = action;
    switch (type) {
        case SET_PAX_VALUE: {
            const {dictValues, save} = payload;
            if(save) {
                for(const key of Object.keys(dictValues)) {
                    const value = dictValues[key];
                    setItem(key, value);
                    //TODO: if(key === 'token') createClient();
                }
            }
            return {...state, ...dictValues};
        }

        case SIGNOUT_USER: {
            setItem(USER);
            setItem(AGENCY);
            setItem(BRANCH);
            return {...state, [AGENCY]: null, [BRANCH]: null, [USER]: null};
        }
        default: return state;
    }
};

export default pax;
