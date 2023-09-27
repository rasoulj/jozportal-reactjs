import React, {useState} from 'react';
import {BasePage, SectionHeader} from "../../../components/TinyComponents";
import {Button} from "@material-ui/core";
import {ChangePasswordDialog, ViewEditUserSection} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../actions";
import {Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";

export default ({match}) => {
    const [changePassword, setChangePassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const {user} = useSelector(({pax}) => pax);
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

        <ViewEditUserSection title="page.settings.edit_agency" user={user} setLoader={setLoader} onSave={user => dispatch(setValues({user}, true))} />

    </BasePage>;
};

