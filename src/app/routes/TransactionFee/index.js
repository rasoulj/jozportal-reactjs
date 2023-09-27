import React, {useEffect, useState} from 'react';
import {BasePage, FormGen, FormGenTypes, HeaderButton, SectionHeader} from "../../../components/TinyComponents";
import {fillModel, showErrors, toast, T} from "../../../util";
import {loadFees, saveFees} from "../../../util/db_mongo";
import {useSelector} from "react-redux";
import {getOrderTypeName, Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";

const Services = {
    "membership": "Membership",
    "topUp": "Top-up",
    "withdraw": "Withdraw",
    "exchange": "Exchange",
    "transfer": "Transfer",
    "airplaneTicket": "Airplane Ticket",
    // "se7": "Service #7",
};


function getModel(locale) {
    return fillModel(Services, f => {
        return {
            className: "col-md-6 col-12",
            required: true,
            label: getOrderTypeName(f, locale), // Services[f],
            type: FormGenTypes.number
        }
    });
}



export default ({match}) => {
    const {locale} = useIntl();
    const Model = getModel(locale);

    const [edit, setEdit] = useState(false);
    const [loader, setLoader] = useState(false);
    const [updater, setUpdater] = useState(0);

    const [values, setValues] = useState(fillModel(Model, () => 0));
    const {user, branch} = useSelector(({pax}) => pax);
    const {aid, bid, uid} = user || {};




    const getError = (f, v, isRun = true) => {
        if(v === undefined && isRun) return false;
        const val = 1*v;
        if(isNaN(val)) return true;
        return val < 0;
    };// || 1*v > 100;

    const getErrorMessage = (f, v, isRun = true) => {
        if(isRun && v === undefined) return "";
        console.log(f,v, getError(f, v));

        return getError(f, v, isRun) ? `Invalid value for ${Services[f]} (must enter between 0 and 100)` : "";
    };

    useEffect(() => {
        if(!updater) loadFees(aid, setLoader, setValues, err => {
            // console.log(err);
            console.log("err: ", err.toString());
            toast("Error loading fees");
        });
    }, [updater]);


    return <BasePage

        loader={loader}
        tid="pages.transaction_fee"
        match={match}>
        <SectionHeader
            right={<div>
                <HeaderButton disabled={!edit} icon="save" tid="save" color="red" onClick={() => {
                    const errs = Object.keys(Model).map(f => getErrorMessage(f, values[f], false)).filter(e => e !== "");
                    showErrors(errs);
                    if(errs.length > 0) return;

                    saveFees(aid, uid, values, setLoader,
                        () => toast("Transaction Fees has been saved successfully.", "success"),
                        () => toast("Transaction Fees cannot be saved", "error")
                    );


                    setEdit(false);
                }} />
                <HeaderButton disabled={edit} color={"green"} icon="edit" tid="edit" onClick={() => setEdit(true)}/>
            </div>}
            tid="tran.services">

            <FormGen
                values={values}
                setValue={(f, v) => setValues({...values, [f]: v})}
                models={Model}
                getError={getError}
                getErrorMessage={getErrorMessage}
                getDisabled={(f, v) => !edit}
            />

        </SectionHeader>


    </BasePage>;
};

