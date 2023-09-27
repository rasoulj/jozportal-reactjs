import React, {useEffect, useState} from 'react';

import {
    BasePage, FlatList,
    FormGen,
    HeaderButton, NoData,
    SectionHeader, UserItemView,
    CreateUserDialog
} from "../../../components";
import {useSelector} from "react-redux";
import {toast} from "../../../util";
import moment from "moment";

import {Roles, UserStatus, Model as UserModel} from "../../../models/User";
import {getFieldError, Form as BranchForm, Model} from "../../../models/Branch";
import {TimeForm, ValidTimePicker} from "../../../models/Rate";
import {getErrorMessage} from "jozdan-common";
import {T} from "../../../util"
import {Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";
import {loadUserById, saveUser, loadUsers} from "../../../util/db_mongo";

const defColor = "cyan";

function removePlus(phone) {
    if(!phone || phone.length < 1) return phone;
    return phone.startsWith("+") ? phone.substring(1) : phone;
}


function getParams({params}) {
    const {bid} = params;
    return {bid};
}

function getModelBranch(bid) {
    if(bid !== "0") return BranchForm;
    const phone = BranchForm[Model.phone];
    return {...BranchForm, phone: {...phone, readonly: false}};
}

export default ({match, history}) => {
    // const {bid} = getParams(match);

    const {user} = useSelector(({pax}) => pax);
    const {aid} = user || {};

    const [bid, setBid] = useState(getParams(match).bid);
    const [loader, setLoader] = useState(false);
    const [updater, setUpdater] = useState(0);
    const [openAddAdmin, setOpenAddAdmin] = useState(false);


    const [edit, setEdit] = useState(bid === "0");
    const [status, setStatus] = useState(UserStatus.ACTIVE);
    const [address, setAddress] = useState(null);
    const [phone, setPhone] = useState("");
    const [displayName, setDisplayName] = useState(null);
    const [defCurrency, setDefCurrency] = useState(null);
    const [values, setValues] = useState({validFrom: moment(), validTo: moment()});

    const [users, setUsers] = useState([]);

    const setValue = {
        address: setAddress,
        displayName: setDisplayName,
        defCurrency: setDefCurrency,
        status: setStatus,
        phone: setPhone
    };

    const {locale} = useIntl();
    const title = edit ? (bid === "0" ? Tran("branch.new", locale) : Tran("branch.edit", locale)) : Tran("branch.view", locale);

    useEffect(() => {
        if (bid !== "0") {
            if (!edit && updater === 0) loadUserById(bid, setLoader, ({address, displayName, defCurrency, validFrom, validTo, phone = "", status}) => {
                setAddress(address);
                setDisplayName(displayName);
                setDefCurrency(defCurrency);
                setPhone(phone);
                setStatus(status);
                console.log("phone", phone);
                setValues({validFrom: moment(validFrom), validTo: moment(validTo)});
            });



            loadUsers({bid, role: Roles.BRANCH_ADMIN}, setLoader, v => setUsers(v));
        }
    }, [updater]);


    return <BasePage
        dialogs={[<CreateUserDialog
            loader={loader}
            tid="pages.viewBranch.info.addAdmin"
            open={openAddAdmin}
            setOpen={setOpenAddAdmin}
            onDone={user => {
                console.log(user);
                delete user[UserModel.confirm];
                setOpenAddAdmin(false);



                saveUser({
                        ...user,
                        // uid,
                        bid,
                        aid,
                        role: Roles.BRANCH_ADMIN,
                        status: UserStatus.ACTIVE,
                    }, setLoader,
                    () => {
                        setUpdater(updater + 1);
                        toast(Tran("branch.msg1", locale), "success");
                    },
                    err => {
                        console.log(err);
                        toast(Tran("branch.err1", locale), "error")
                    });

                // createUserFirebase(
                //     user,
                //     setLoader,
                //     (fuser) => {
                //         console.log(fuser);
                //         const {uid} = fuser;
                //         console.log("fuser.uid", uid);
                //
                //         setOpenAddAdmin(false);
                //
                //         delete user[UserModel.password];
                //         delete user[UserModel.confirm];
                //
                //         saveUser({
                //                 ...user,
                //                 uid,
                //                 bid,
                //                 aid,
                //                 role: Roles.BRANCH_ADMIN,
                //                 status: UserStatus.ACTIVE,
                //             }, setLoader,
                //             () => {
                //                 setUpdater(updater + 1);
                //                 toast(Tran("branch.msg1", locale), "success");
                //             },
                //             err => {
                //                 console.log(err);
                //                 toast(Tran("branch.err1", locale), "error")
                //             });
                //     },
                //     (e) => {
                //         toast(getErrorMessage(e));
                //         console.log(e);
                //         // const {message} = e;
                //         // toast(message || "User cannot be created", "error")
                //     })
            }}/>
        ]}
        title={title}
        subTitle="pages.viewBranch.info"
        tid="pages.viewBranch"
        loader={loader}
        match={match}>

        <SectionHeader tid="pages.viewBranch.info" right={<div>
            <HeaderButton disabled={!edit} icon="save" tid="save" color="red" onClick={() => {
                console.log("values", values);

                // return;

                let err = [
                    getFieldError("displayName", displayName, p => !!p),
                    getFieldError("address", address, p => !!p),
                    getFieldError("phone", phone, p => !!p)
                ].filter(p => p !== "");

                if(values.validTo <= values.validFrom) err.push(Tran("branch.err2", locale));

                if (err.length > 0) {
                    err.forEach(e => toast(e, "error"));
                    return;
                }

                const nbid = bid === "0" ? undefined : bid;


                const branchData = {
                    aid,
                    uid: nbid,
                    displayName,
                    address,
                    defCurrency: defCurrency || "iqd",
                    status,
                    phone,
                    role: Roles.BRANCH,
                    validFrom: (values.validFrom || moment()).toISOString(),
                    validTo: (values.validTo || moment()).toISOString(),
                    // ...values
                };

                if(!nbid) branchData.password = "123456";

                console.log("branchData", branchData);

                //moment().toISOString();

                const onSave = () => {
                    setBid(nbid);
                    setEdit(false)
                };
                const onErr = err => toast(getErrorMessage(err));
                // const save = () => saveBranch(branchData, setLoader, onSave, onErr);



                saveUser(branchData, setLoader, onSave, onErr);

                // if(bid === "0") {
                //     const user = {...branchData, email: `${phone}@nnw.click`, password: "123456"};
                //     createUserFirebase(user, setLoader, user => {
                //         const {uid} = user;
                //         // console.log("uid", uid);
                //
                //         saveBranch({...branchData, xid: uid}, setLoader, onSave, onErr);
                //
                //         //toast("Branch user has been created");
                //     }, console.log);
                // } else saveBranch(branchData, setLoader, onSave, onErr);
            }}/>
            <HeaderButton disabled={edit} color={"green"} icon="edit" tid="edit" onClick={() => setEdit(true)}/>
        </div>}>
            <FormGen
                models={getModelBranch(bid)}
                setValue={(f, v) => setValue[f](v)}
                getDisabled={(f, v) => !edit}
                getError={(f, v) => v === ""}
                getErrorMessage={(f, v) => getFieldError(f, v)}
                values={{address, displayName, defCurrency, status, phone}}
            />

            <ValidTimePicker prefix={"branch.working_time"} setValues={(f, v) => setValues({...values, [f]: v})} values={values} readOnly={!edit} />

        </SectionHeader>


        <SectionHeader
            visible={bid !== "0"}
            tid="pages.branchManagement.adminManager"
            right={<HeaderButton tid="pages.viewBranch.info.addAdmin" color={defColor} icon="plus" onClick={() => {
                setOpenAddAdmin(true);
            }}/>}
        >
            <FlatList
                noData={<NoData loader={loader} mid="pages.viewBranch.noAdmin"/>}
                loader={loader}
                data={users}
                renderItem={(user, key) => <UserItemView
                    onClick={() => history.push(`${bid}/${user.uid}`)}
                    color={defColor}
                    user={user}
                    key={key}
                />}
            />
        </SectionHeader>


    </BasePage>;
};
