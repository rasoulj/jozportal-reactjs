import {camelCase, getFormError, T} from "../util";
import {Currencies, CurrencyDef} from "./Wallet";
import {FormGenTypes} from "../components/TinyComponents";
import {UserStatus} from "./User";

export const Model = {
    address: "address",
    displayName: "displayName",
    defCurrency: "defCurrency",
    status: "status",
    phone: "phone",
};


export const Form = {
    [Model.displayName]: {
        className: "col-md-6 col-12",
        required: true,
        label: (`form.${Model.displayName}`),
        type: FormGenTypes.text
    },
    [Model.address]: {
        className: "col-md-6 col-12",
        required: true,
        label: (`form.${Model.address}`),
        type: FormGenTypes.text
    },
    [Model.phone]: {
        className: "col-md-6 col-12",
        required: true,
        label: (`form.${Model.phone}`),
        type: FormGenTypes.phone,
        readonly: true,
    },
    [Model.defCurrency]: {
        className: "col-md-6 col-12",
        required: true,
        label: (`form.${Model.defCurrency}`),
        type: FormGenTypes.select,
        options: Currencies.filter(cur => cur !== "usd").map(v => {
            return {v, l: `cur.${v}.l`}
        })
    },
    [Model.status]: {
        className: "col-md-6 col-12 mt-3",
        required: true,
        label: (`form.${Model.status}`),
        type: FormGenTypes.select,
        readonly: false,
        options: Object.keys(UserStatus).map(k => {
            const v = UserStatus[k];
            return {v, l: v}
        })
    },

};


const Errors = {
    [Model.address]: ("branch.err_address"),
    [Model.displayName]: ("branch.err_displayName"),
    [Model.phone]: ("branch.err_phone"),
};

export function getFieldError(field, value, isValid = p => p !== "") {
    return getFormError(field, value, isValid, Errors);//  isValid(value) ? "" : ERRORS[field];
}
