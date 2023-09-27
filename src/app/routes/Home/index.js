import React, {useState} from 'react';
import {BasePage} from "../../../components/TinyComponents";
import {useSelector} from "react-redux";
import {Roles} from "../../../models/User";
import {Button} from "reactstrap";
import IntlMessages from "../../../util/IntlMessages";
import {Link} from "react-router-dom";

function removePlus(phone) {
    if(!phone || phone.length < 1) return phone;
    return phone.startsWith("+") ? phone.substring(1) : phone;
}

const CustomerMainMenuButtons = [
    {link: "/app/services/topUp", title: "pages.topUp"},
    {link: "/app/services/withdraw", title: "pages.withdraw"},
    {link: "/app/services/transfer", title: "pages.transfer"},
    {link: "/app/services/exchange", title: "pages.exchange"},
]

export function CustomerMainMenu({visible = true, history}) {
    if(!visible) return <div />;
    return <div className="row">
        {CustomerMainMenuButtons.map((p, i) => {
            const {link, title} = p;
            return <div className="col-12 col-md-6">
                <Button block onClick={() => history.push(link)}>
                    {title}
                </Button>
            </div>
        })}
    </div>
}

export default ({match, history}) => {
    const [loader, setLoader] = useState(false);

    const {user} = useSelector(({pax}) => pax);
    const {role} = user || {role: "a"};

    const isCustomer = role === Roles.CUSTOMER;

    return <BasePage
        loader={loader}
        tid="pages.home"
        match={match}>

        <CustomerMainMenu visible={isCustomer} history={history} />

        {/*{buildCustomerNumber("989191007008")}*/}
        {/*<Button onClick={() => {*/}

        {/*    return;*/}

        {/*    const {aid} = {aid: "agency2"};*/}
        {/*    if (aid) loadBranches(aid, setLoader, branches => {*/}
        {/*        //"964913383400"*/}
        {/*        //console.log(branches);*/}
        {/*        // console.log(branches.map(p => p.phone));*/}
        {/*        // return;*/}

        {/*        // for(const branch of branches) {*/}

        {/*            return;*/}
        {/*            const branch = branches[18];*/}


        {/*            // const branch = branches.find(p => p.phone === "964913383400");*/}
        {/*            console.log(branch);*/}

        {/*            const {phone: p} = branch;*/}

        {/*            const phone = removePlus(p);*/}
        {/*            console.log(phone);*/}

        {/*            const user = {...branch, email: `${phone}@nnw.click`, password: "123456"};*/}
        {/*            console.log("user", user);*/}

        {/*            createUserFirebase(user, setLoader, user => {*/}
        {/*                const {uid} = user;*/}
        {/*                console.log("uid", uid);*/}

        {/*                saveBranch({...branch, xid: uid}, setLoader, () => toast("Branch saved"));*/}

        {/*                toast("Branch user has been created");*/}
        {/*            }, console.log);*/}
        {/*        //}*/}
        {/*        // const user = {...phone, email: ``}*/}


        {/*    });*/}
        {/*    //fillPhones(setLoader, () => toast("DONE", "success"), e => toast(getErrorMessage(e)))*/}
        {/*}}>Create users</Button>*/}

        {/*<Button onClick={() => {*/}
        {/*    loadBranches("agency2", setLoader, data => {*/}
        {/*        console.log("loadBranches", data);*/}
        {/*        // for(const branch of data) {*/}
        {/*        //     console.log("loadBranches-branch", branch);*/}
        {/*        //     //saveBranch(branch, setLoader, () => console.log("Saved", branch));*/}
        {/*        // }*/}
        {/*    });*/}
        {/*}}>Copy Agencies</Button>*/}

        {/*{validCustomerNumber(number) ? "Valid" : "Non-valid"}*/}
    </BasePage>;
};
