import React, {useEffect, useState} from "react";
import {getFormError, toast, validateEmail, validPassword} from "../util";
import {FormGen, GenDialog} from "./TinyComponents";
import {Form, Model, getFieldError} from "../models/User";
import IntlMessages from "../util/IntlMessages";
import {useIntl} from "react-intl";
import {Tran} from "../lngProvider";

export const CreateUserDialog = ({open, setOpen, onDone, tid, initValues = {}, loader = false}) => {
    const [values, setValues] = useState(initValues);
    const setValue = (f, v) => setValues({...values, [f]: v});

    // console.log("initValues", initValues);
    const {locale} = useIntl();

    const getError = (f, v) => {
        if (v === undefined) return false;
        switch (f) {
            case Model.confirm:
                return v !== values[Model.password];
            case Model.password:
                return !validPassword(v);
            case Model.email:
                return !validateEmail(v);
            default:
                return v === "";
        }
    };

    useEffect(() => {
        setValues(initValues);
    }, []);

    return <GenDialog
        loader={loader}
        open={open}
        title={<IntlMessages id={tid} />}
        body={<FormGen
            models={Form}
            setValue={setValue}
            values={values}
            getError={getError}
            getErrorMessage={(f, v) => getFieldError(f, v, v => !getError(f, v))}
        />}
        actions={[
            {label: Tran("add", locale), value: "save", color: "green"},
            {label: Tran("cancel", locale), value: "cancel", color: "secondary"},
        ]}

        onClose={res => {
            if (res === "cancel") return setOpen(false);
            const err = Object.keys(Form).map(f => getFieldError(f, values[f], p => !!p && !getError(f, p))).filter(p => !!p);
            err.forEach(mes => toast(mes, "error"));
            if (err.length === 0) {
                if (onDone) onDone(values);
                else setOpen(false);
            }
        }}
    />;
};
