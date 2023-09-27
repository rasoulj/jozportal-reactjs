//ViewEditUserSection
import React, {useEffect, useState} from "react"
import {HeaderButton, SectionHeader} from "./TinyComponents";
import {saveUser} from "../util/db_mongo";
import {toast} from "../util";
import {setValues} from "../actions";
import {getErrorMessage} from "jozdan-common";
import {UserSummary} from "./UserSummary";
import {UserEditForm} from "./ViewUserDialog";
import {useIntl} from "react-intl";
import {ChangePasswordDialog} from "./ChangePasswordDialog";

export function ViewEditUserSection({user, title, setLoader, onSave, onError}) {
    const [edit, setEdit] = useState(false);
    const [editUser, setUser] = useState(user);
    const setValue = (k, v) => setUser({...user, [k]: v});
    const [changePassword, setChangePassword] = useState(false);

    const {referred} = editUser || {};

    useEffect(() => {
        setUser(user)
    }, [user]);

    // console.log("user", user);
    const {locale} = useIntl();

    const verifyUser = () => {
        saveUser({...editUser, referred: true}, setLoader, () => {
            toast("User has been verified successfully", "success");
            setValue("referred", true);
            if (onSave) onSave(editUser);
        }, err => toast(getErrorMessage(err)));
    };


    return <SectionHeader
        tid={title}
        right={<div>
            <HeaderButton color="amber" icon="close" disabled={!edit} tid="cancel" onClick={() => setEdit(false)}/>
            <HeaderButton color="red" icon="save" disabled={!edit} tid="save" onClick={() => {
                console.log("editUser", editUser);
                saveUser(editUser, setLoader,
                    () => {
                        toast("User has been successfully saved", "success");
                        setEdit(false);
                        if (onSave) onSave(editUser);
                    },
                    err => toast(getErrorMessage(err))
                );
                setEdit(false);
            }}/>
            <HeaderButton color="green" icon="edit" disabled={edit} tid="edit" onClick={() => setEdit(true)}/>
            <HeaderButton color="red" icon="check" disabled={referred} tid="Verify" onClick={verifyUser}/>
            {/*<HeaderButton color="primary" icon="lock" disabled={edit} tid="page.settings.change_pass"*/}
            {/*              onClick={() => setChangePassword(true)}/>*/}
        </div>}>
        {!edit ? <UserSummary user={user}/> : <UserEditForm user={editUser} setValue={setValue} disabled={!edit}/>}
        <ChangePasswordDialog open={changePassword} setOpen={setChangePassword} />
    </SectionHeader>;
}

