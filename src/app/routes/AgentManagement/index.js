import React, {useEffect, useState} from 'react';
import {
    BasePage,
    FlatList,
    HeaderButton,
    NoData,
    SectionHeader,
    UserItemView,
    CreateUserDialog
} from "../../../components";
import {useSelector} from "react-redux";
import {loadUsers, saveUser} from "../../../util/db_mongo";
import {toast} from "../../../util";
import {Model as UserModel, Roles, UserStatus} from "../../../models/User";

const defColor = "green";

export default ({match, history}) => {

    const {user} = useSelector(({pax}) => pax);
    const {aid, bid} = user || {};

    const [loader, setLoader] = useState(false);
    const [users, setUsers] = useState([]);
    const [updater, setUpdater] = useState(0);

    const [openAddAgent, setOpenAddAgent] = useState(false);


    useEffect(() => {
        // loadUsersQuery({aid, bid, role: Roles.BRANCH_AGENT}).onSnapshot(e => {
        //     setUsers(getData(e));
        //     // console.log(getData(e));
        // });
        loadUsers({aid, bid, role: Roles.BRANCH_AGENT}, setLoader, setUsers, () => toast("Cannot load users", "error"));
    }, [updater]);

    // const phones = [
    //     "+989133834091",
    //     "00989133834091",
    //     "+989132857528",
    //     "+61499506010",
    //     "+61499506011",
    // ];
    //
    // for(let phone of phones) {
    //     const code = buildCustomerNumber(phone);
    //     console.log(phone, stdCustomerNumber(code), validCustomerNumber(code));
    // }
    //
    // console.log(stdCustomerNumber("1234567890abcdef"));

    return <BasePage
        loader={loader}
        dialogs={[<CreateUserDialog
            loader={loader}
            tid="pages.agent_management.addAgent"
            open={openAddAgent}
            setOpen={setOpenAddAgent}
            onDone={user => {
                console.log(user);

                setOpenAddAgent(false);

                // delete user[UserModel.password];
                delete user[UserModel.confirm];

                saveUser({
                        ...user,
                        bid,
                        aid,
                        role: Roles.BRANCH_AGENT,
                        status: UserStatus.ACTIVE
                    }, setLoader,
                    () => {
                        setUpdater(updater+1);
                        toast("User has been created successfully", "success");
                    },
                    err => {
                        console.log(err);
                        toast("User cannot be created", "error")
                    });
            }}/>
        ]}
        tid="pages.agent_management"
        match={match}>
        <SectionHeader
            right={<HeaderButton tid="pages.agent_management.addAgent" color={defColor} icon="plus" onClick={() => {
                setOpenAddAgent(true);
            }}/>}
            tid="pages.agent_management.agents_list">
            {/*<p>aid: {aid}</p>*/}
            {/*<p>bid: {bid}</p>*/}

            <FlatList
                loader={loader}
                data={users}
                noData={<NoData mid="pages.agent_management.noAgent" loader={loader} />}
                renderItem={(user, key) => <UserItemView
                    onClick={() => history.push(`agent-management/${user.uid}`)}
                    color={defColor}
                    key={key}
                    user={user}
                />}
            />
        </SectionHeader>
    </BasePage>;
};

