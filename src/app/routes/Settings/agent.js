import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";
import {
    BasePage, HeaderButton, SectionHeader,
    ChangePasswordDialog, UserEditForm, UserSummary, ViewEditUserSection
} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../actions";
import {useIntl} from "react-intl";
import {Tran} from "../../../lngProvider";

export default ({match}) => {
    const [changePassword, setChangePassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const {branch, user} = useSelector(({pax}) => pax);
    const dispatch = useDispatch();
    const {locale} = useIntl();

    return <BasePage
        loader={loader}
        dialogs={[
            <ChangePasswordDialog open={changePassword} setOpen={setChangePassword} />
        ]}
        tid="pages.settings"
        match={match}>

        <SectionHeader tid="branch.info">
            <UserSummary user={branch} />
        </SectionHeader>
        <ViewEditUserSection title="agent.info" user={user} setLoader={setLoader} onSave={user => dispatch(setValues({user}, true))} />

        <SectionHeader tid="general">
            <Button onClick={() => setChangePassword(true)} variant="contained" color="primary" className="mr-4">{Tran("page.settings.change_pass", locale)}</Button>
        </SectionHeader>

    </BasePage>;
};

