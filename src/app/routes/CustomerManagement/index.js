import React, {useEffect, useState} from 'react';
import {
    BasePage,
    FlatList,
    HeaderButton,
    NoData,
    SectionHeader,
    UserItemView,
    CreateUserDialog, FormGenTypes, FormGen,

} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {Roles, UserStatus, Model as UserModel} from "../../../models/User";
import {toast} from "../../../util";
import {CurrencyDef, OrderTypes} from "jozdan-common";
import {Tran} from "../../../lngProvider";
import {useIntl} from "react-intl";
import {Button} from "@material-ui/core";
import {setValues} from "../../../actions";
import {loadUsers, saveUser} from "../../../util/db_mongo";

const defColor = "danger";

const LIMIT_LEN = 15;

const Model = {
    wid: "wid",
    email: "email",
    phone: "phone"
};

const getForm = locale => {
    return {
        [Model.wid]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.wid}`),
            type: FormGenTypes.text,
        },
        [Model.phone]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.phone}`),
            type: FormGenTypes.phone,
        },
        [Model.email]: {
            className: "col-md-6 col-12",
            label: (`form.${Model.email}`),
            type: FormGenTypes.email,
        },

    };
};


export default ({match, history}) => {
    const [openAddAgent, setOpenAddAgent] = useState(false);
    const dispatch = useDispatch();

    // const setOpenAddAgent = openAddAgent => dispatch(setValues({openAddAgent}));

    const {user,} = useSelector(({pax}) => pax);
    const {aid, bid} = user || {};

    const [loader, setLoader] = useState(false);
    const [users, setUsers] = useState([]);
    const [updater, setUpdater] = useState(0);
    const [opts, setOpts] = useState({});
    const [limit, setLimit] = useState(LIMIT_LEN);
    const {locale} = useIntl();

    const setValue = (f, v) => setOpts({...opts, [f]: v});

    //


    const loadData = () => {
        const copts = JSON.parse(JSON.stringify(opts));

        setLoader(true);

        loadUsers({...copts, aid, bid, role: Roles.CUSTOMER, limit}, setLoader, setUsers, () => toast("Cannot load users", "error"));    };

    useEffect(loadData, [updater, limit]);

    return <BasePage
        loader={loader}
        // title={"Salaam: "+(openAddAgent ? "openAddAgent" : "Close")}
        dialogs={[<CreateUserDialog
            loader={loader}
            tid="pages.customer_management.addCustomer"
            open={openAddAgent}
            setOpen={setOpenAddAgent}
            onDone={user => {
                console.log(user);

                setOpenAddAgent(false);

                // delete user[UserModel.password];
                delete user[UserModel.confirm];

                saveUser({
                        ...user,
                        // uid,
                        bid,
                        aid,
                        role: Roles.CUSTOMER,
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
        tid="pages.customer_management"
        match={match}>
        <SectionHeader tid="statement.filters" right={<div>
            <HeaderButton
                tid="statement.applyFilters"
                color="green"
                icon="view-week"
                onClick={loadData}
            />
            <HeaderButton
                tid="statement.clearFilters"
                color="red"
                icon="close"
                onClick={() => {
                    setOpts({});
                    setUpdater(updater+1);
                }}
            />
        </div>}>

            <FormGen models={getForm(locale)} values={opts} setValue={setValue}/>

        </SectionHeader>
        <SectionHeader
            right={<HeaderButton tid="pages.customer_management.addCustomer" color={defColor} icon="plus" onClick={() => {
                setOpenAddAgent(true);
            }}/>}
            tid="pages.customer_management.customers_list">
            {/*<p>aid: {aid}</p>*/}
            {/*<p>bid: {bid}</p>*/}

            <FlatList
                loader={loader}
                data={users}
                noData={<NoData mid="pages.customer_management.noCustomer" loader={loader} />}
                renderItem={(user, key) => <UserItemView
                    onClick={() => {
                        history.push(`customer-management/${user.uid}`);
                        // toast(user.uid);
                        // setUserToEdit(user);
                        // setOpenEditUser(true);
                    }}
                    color={defColor}
                    key={key}
                    user={user}
                />}
            />
            {limit <= users.length && <div className="d-flex justify-content-center">
                <Button onClick={() => setLimit(limit+LIMIT_LEN)}>
                    {Tran("tran.load_more", locale)}
                </Button>
            </div>}
        </SectionHeader>
    </BasePage>;
};

