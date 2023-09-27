import React, {useEffect, useState} from "react";
import {FormGen, FormGenTypes, GenDialog} from "./TinyComponents";
import {getFieldError} from "../models/User";
import {toast, validateEmail, validPassword} from "../util";
import {changePassword} from "../util/db_mongo";
import {getErrorMessage} from "jozdan-common";
import {Tran} from "../lngProvider";
import {useIntl} from "react-intl";

const Model = {
    currentPassword: "currentPassword",
    password: "password",
    confirm: "confirm",
};

const Form = {
    [Model.currentPassword]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.cur_pass",
        type: FormGenTypes.password
    },
    [Model.password]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.new_pass",
        type: FormGenTypes.password
    },
    [Model.confirm]: {
        className: "col-md-12 col-12",
        required: true,
        label: "form.confirm",
        type: FormGenTypes.password
    },
};


export const ChangePasswordDialog = ({open, setOpen}) => {

    const [values, setValues] = useState({});
    const [loader, setLoader] = useState(false);

    const setValue = (f, v) => setValues({...values, [f]: v});
    const {locale} = useIntl();

    const getError = (f, v) => {
        if (v === undefined) return false;
        switch (f) {
            case Model.confirm:
                return v !== values[Model.password];
            case Model.password:
            case Model.currentPassword:
                return !validPassword(v);
            default:
                return v === "";
        }
    };

    return <GenDialog
        loader={loader}
        title={Tran("page.settings.change_pass", locale)}
        open={open}
        body={<FormGen
            models={Form}
            setValue={setValue}
            values={values}
            getError={getError}
            getErrorMessage={(f, v) => getFieldError(f, v, v => !getError(f, v))}
        />}
        actions={[
            {label: Tran("page.settings.change_pass", locale), value: "done", color: "green"},
            {label: Tran("cancel", locale), value: "cancel", color: "secondary"},
        ]}
        onClose={res => {
            if (res === "cancel") {
                setValues({});
                return setOpen(false);
            }
            const err = Object.keys(Form).map(f => getFieldError(f, values[f], p => !!p && !getError(f, p))).filter(p => !!p);
            err.forEach(mes => toast(mes, "error"));
            if (err.length === 0) {
                // console.log(values);
                const {currentPassword, password} = values || {};
                changePassword(currentPassword, password, setLoader,
                    err => toast(getErrorMessage(err)),
                    () => {
                        toast("Password has been changed successfully", "success");
                        setValues({});
                        setOpen(false);
                    }
                );
            }
        }}
    />
};
