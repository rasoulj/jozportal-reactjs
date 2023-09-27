import {getFormError} from "../util";
import {FormGenTypes} from "../components/TinyComponents";



export const Model = {
    confirm: "confirm",
    password: "password",
    email: "email",
    address: "address",
    displayName: "displayName",
    phone: "phone",
    status: "status",
};

const Errors = {
    [Model.address]: "Address cannot left empty",
    [Model.displayName]: "Display Name cannot left empty",
    [Model.confirm]: "Passwords do not match",
    [Model.password]: "Password is not valid, password length is at least 6 characters",
    [Model.email]: "Enter a valid e-mail",
    [Model.phone]: "Enter a valid phone number",
};


export const Form = {
    [Model.displayName]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.displayName",
        type: FormGenTypes.text
    },
    [Model.address]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.address",
        type: FormGenTypes.text
    },
    // [Model.email]: {
    //     className: "col-md-12 col-12",
    //     required: true,
    //     label: "form.email",
    //     type: FormGenTypes.email
    // },
    [Model.phone]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.phone",
        type: FormGenTypes.phone
    },
    [Model.password]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.password",
        type: FormGenTypes.password
    },
    [Model.confirm]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.confirm",
        type: FormGenTypes.password
    },
};


export function getFieldError(field, value, isValid = p => p !== "") {
    return getFormError(field, value, isValid, Errors);//  isValid(value) ? "" : ERRORS[field];
}

export const Roles = {
    AGENCY: "AGENCY",
    BRANCH: "BRANCH",
    AGENCY_ADMIN: "1-agencyAdmin",
    BRANCH_ADMIN: "2-branchAdmin",
    BRANCH_AGENT: "3-branchAgent",
    CUSTOMER: "4-branchCustomer",
    NONE: "5-none"
};


export const UserStatus = {
    ACTIVE: "active",
    DISABLE: "disable",
    // DELETED: "deleted",
};
