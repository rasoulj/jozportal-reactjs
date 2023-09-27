import React, {useState} from 'react';
import {BasePage, HeaderButton, SectionHeader} from "../../../components/TinyComponents";
import {Button} from "@material-ui/core";
import {UserSummary, ChangePasswordDialog, UserEditForm, ViewEditUserSection} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../actions";
import {Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";

export default ({match}) => {
    const [changePassword, setChangePassword] = useState(false);
    const [loader, setLoader] = useState(false);

    const [edit, setEdit] = useState(false);
    const {branch, user} = useSelector(({pax}) => pax);
    const [editUser, setUser] = useState({...user});
    const setValue = (k, v) => setUser({...user, [k]: v});
    const dispatch = useDispatch();

    const {locale} = useIntl();

    return <BasePage
        loader={loader}
        dialogs={[
            <ChangePasswordDialog open={changePassword} setOpen={setChangePassword} />
        ]}
        tid="pages.settings"
        match={match}>

        <SectionHeader tid="general">
            <Button onClick={() => setChangePassword(true)} variant="contained" color="primary" className="mr-4">{Tran("page.settings.change_pass", locale)}</Button>
        </SectionHeader>

        <ViewEditUserSection title="branch.info" user={branch} setLoader={setLoader} onSave={branch => dispatch(setValues({branch}, true))} />
        <ViewEditUserSection title="admin.info" user={user} setLoader={setLoader} onSave={user => dispatch(setValues({user}, true))} />


        {/*<SectionHeader title="Admin Info" right={<div>*/}
        {/*    <HeaderButton color="red" icon="save" disabled={!edit} title="Save" onClick={() => {*/}
        {/*        console.log("editUser", editUser);*/}
        {/*        // return;*/}
        {/*        saveUser(editUser, setLoader,*/}
        {/*            () => {*/}
        {/*                toast("User has been successfully saved", "success");*/}
        {/*                dispatch(setValues({user: editUser}, true));*/}
        {/*                setEdit(false);*/}
        {/*            },*/}
        {/*            err => toast(getErrorMessage(err))*/}
        {/*        );*/}
        {/*        setEdit(false);*/}
        {/*    }} />*/}
        {/*    <HeaderButton color="green" icon="edit" disabled={edit} title="Edit" onClick={() => setEdit(true)} />*/}
        {/*</div>}>*/}
        {/*    {!edit ? <UserSummary user={user} /> : <UserEditForm user={editUser} setValue={setValue} disabled={!edit}/>}*/}
        {/*</SectionHeader>*/}



    </BasePage>;
};

