import React, {useEffect, useState} from "react"
import {FormGen, GenDialog} from "./TinyComponents";
import {toast} from "../util";
import IntlMessages from "../util/IntlMessages";

export const ViewModelDialog = (
    {
        open,
        setOpen,
        onDone,
        tid,
        initValues = {},
        loader = false,
        getError = () => false,
        getFieldError = () => "",
        Form = {}
    }
) => {

    const [values, setValues] = useState({});
    const setValue = (f, v) => setValues({...values, [f]: v});

    console.log("initValues-ViewModelDialog", initValues);

    useEffect(() => {
        setValues(initValues);
    }, [initValues]);

    return <GenDialog
        loader={loader}
        open={open}
        title={<IntlMessages id={tid}/>}
        body={<FormGen
            models={Form}
            setValue={setValue}
            values={values}
            getError={getError}
            getErrorMessage={(f, v) => getFieldError(f, v, v => !getError(f, v))}
        />}
        actions={[
            {label: "add", value: "save", color: "green"},
            {label: "cancel", value: "cancel", color: "secondary"},
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

