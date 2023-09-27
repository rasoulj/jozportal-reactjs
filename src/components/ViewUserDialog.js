import React from "react"
import {ViewModelDialog} from "./ViewModelDialog";
import {FormGen, FormGenTypes} from "./TinyComponents";
import {getFieldError, Model, UserStatus} from "../models/User";
import {camelCase, validateEmail, validPassword} from "../util";

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
    [Model.email]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.email",
        type: FormGenTypes.email,
        readonly: true,
    },
    [Model.phone]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.phone",
        type: FormGenTypes.phone,
        readonly: true,
    },
    [Model.status]: {
        className: "col-md-12 col-12 mt-3",
        required: true,
        label: "form.user_status",
        type: FormGenTypes.select,
        readonly: false,
        options: Object.keys(UserStatus).map(k => {
            const v = UserStatus[k];
            return {v, l: v}
        })
    },
};

const getError = (f, v) => {
    return v === undefined ? false : f === Model.email ? !validateEmail(v) : v === "";
};

export const ViewUserDialog = ({open, setOpen, onDone, tid, initValues = {}, loader = false}) => {
    console.log("ViewUserDialog-inni", initValues);
    const props = {open, setOpen, onDone, tid, initValues, loader, getError, getFieldError, Form}; //getError, getFieldError, Form
    return ViewModelDialog(props);
};


export const UserEditForm = ({setValue, user = {}, disabled = false}) => {
    return <FormGen
        getDisabled={() => disabled}
        getError={getError}
        getErrorMessage={getFieldError}
        models={Form}
        values={user}
        setValue={setValue}
    />
};
