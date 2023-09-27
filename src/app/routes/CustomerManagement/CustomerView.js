import React, {useEffect, useState} from 'react';
import {
    BasePage,
    HeaderButton,
    SectionHeader,
    UserEditForm,
    UserWallet,
    ViewEditUserSection
} from "../../../components";
import {getErrorMessage, primary} from "jozdan-common";
import {loadUserById} from "../../../util/db_mongo";
import {toast} from "../../../util";
import UserInfo from "../../../components/UserInfo";

function getParams({params}) {
    const {uid} = params;
    return {uid};
}

function getType(history) {
    //customer-management
    const {location: {pathname}} = history;
    const p = pathname.split("/");
    if(p.includes("customer-management")) return "roles.4-branchCustomer";
    else if(p.includes("agent-management")) return "roles.3-branchAgent";
    else if(p.includes("branch-management")) return "roles.2-branchAdmin";
    else return "NA";

}

function CustomerView({match, history}) {
    const {uid} = getParams(match);
    const type = getType(history);

    const [edit, setEdit] = useState(false);
    const [user, setUser] = useState({});
    const [loader, setLoader] = useState({});

    useEffect(() => {
        loadUserById(uid, setLoader, setUser);
    }, [uid]);

    const setValue = (k, v) => setUser({...user, [k]: v});

    return <BasePage loader={loader} match={match} tid={`${type}`} >
        <ViewEditUserSection setLoader={setLoader} user={user} title={"general"} onSave={user => setUser(user)} />
    </BasePage>
}

export default CustomerView;
