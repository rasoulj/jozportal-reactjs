import React, {useEffect, useState} from 'react';
import IntlMessages from 'util/IntlMessages';

import {useSelector} from "react-redux"
import {
    BasePage,
    FlatList, GenDialog, HeaderButton,
    ListItemText2, NoData, SectionHeader
} from "../../../components/TinyComponents";
import {toast} from "../../../util";
import {Avatar, Button, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {delColor} from "../../../constants";
import {UserStatus} from "../../../models/User";
import {useIntl} from "react-intl";
import {Tran} from "../../../lngProvider";
import {loadBranches, saveUser} from "../../../util/db_mongo";

const defColor = "deep-orange";

const Item = ({item = {}, key, onClick, onDelete, color = "indigo"}) => {
    console.log("item", item);
    const {displayName, address, status} = item;
    const dis = status === UserStatus.DISABLE;

    const {locale} = useIntl();
    console.log("locale", Tran("pages.viewBranch.noAdmin", locale));



    return <ListItem key={key} button onClick={onClick}>
        <Avatar className={`mr-3 bg-${dis ? "grey" : color}`}>
            <i className="zmdi zmdi-file zmdi-hc-fw zmdi-hc-lg text-white "/>
        </Avatar>
        <ListItemText2 disabled={dis} primary={displayName} secondary={address} />
        <ListItemSecondaryAction button>
            <Button onClick={dis ? onDelete : onClick} color="secondary">
                <i className={`zmdi zmdi-${dis ? "delete" : "chevron-right"} zmdi-hc-fw zmdi-hc-2x text-${delColor}`}/>
            </Button>
        </ListItemSecondaryAction>
    </ListItem>
};

const BranchManagement = ({match, history: {push}}) => {
    const [branches, setBranches] = useState([]);
    const [loader, setLoader] = useState(false);
    const [updater, setUpdater] = useState(0);
    const [itemToDel, setItemToDel] = useState(null);
    const {user} = useSelector(({pax}) => pax);
    const [openConfirm, setOpenConfirm] = useState(false);

    const {aid} = user || {};

    useEffect(() => {
        if (aid) loadBranches(aid, setLoader, setBranches);
    }, [updater]);

    const {displayName: nameToDel, aid: aidToDel} = itemToDel || {displayName: "", aid: "--"};


    return <BasePage
        dialogs={[
            <GenDialog
                loader={loader}
                key={1}
                open={openConfirm}
                body={<h4>Are you sure to delete <strong style={{color: 'red'}}>{nameToDel}</strong>?</h4>}
                title="Delete Branch?"
                onClose={res => {
                    setOpenConfirm(false);
                    if (res !== "yes") return;
                    const deleted = {...itemToDel, aid: `DELETED-${aidToDel}`};
                    saveUser(deleted, setLoader,() => {
                        setUpdater(updater + 1);
                        toast(`${nameToDel} has been deleted.`, "success");
                    });
                }}
                actions={[
                    {label: <IntlMessages id="button.yes"/>, value: "yes"},
                    {label: <IntlMessages id="button.no"/>, value: "no", color: "primary"},
                ]}
            />
        ]}
        loader={loader}
        tid="pages.branchManagement"
        match={match}>

        <SectionHeader
            // right={<HeaderLink color={defColor} to="/app/branch-management/0" icon="plus" title="pages.branchManagement.rightLink"/>}
            right={<HeaderButton
                onClick={() => push("/app/branch-management/0")}
                color={defColor}
                icon="plus"
                tid="pages.branchManagement.rightLink"
            />}
            tid="pages.branchManagement.subTitle">
                <FlatList
                    noData={<NoData loader={loader} mid="pages.branchManagement.noData" />}
                    loader={loader}
                    data={branches}
                    renderItem={(item, index) => <Item
                        color={defColor}
                        onDelete={() => {
                            setItemToDel(item);
                            setOpenConfirm(true);
                        }}
                        key={index} item={item}
                        onClick={() => push(`/app/branch-management/${item.uid}`)}
                    />}
                />
        </SectionHeader>

    </BasePage>;
};

export default BranchManagement;


/*
class BranchManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            branches: []
        };

        this.readData = this.readData.bind(this);

        //this.loadData();
    }

    setLoader(loader) {
        // this.props.setLoader(loader);
    }

    async readData() {
        const {setValues, setLoader, user} = this.props;
        this.setLoader(true);
        const {aid} = user;
        try {
            const branches = await loadBranches(aid);
            console.log("branches", branches);
            this.setState({branches});
            // setValues({branches});
        } catch (e) {
            console.log(e);
        } finally {
            this.setLoader(false);
        }
    }

    async loadData() {
        const {setLoader, user} = this.props;
        const {aid} = user;
        setLoader(true);
        try {
            const branches = await loadBranches(aid);
            console.log("branches-branches", branches);
            this.setState({branches});
        } catch (e) {
            console.log(e);
        } finally {
            setLoader(true);
        }

        // setValues({loader: false});
        // setLoader(false);
    }

    render() {
        const {match} = this.props;
        const {branches} = this.state;
        console.log("branches-branches", branches);
        return <BasePage
            subTitle="pages.branchManagement.subTitle"
            right={<HeaderLink to="/app/branch-management/0" icon="plus" title="pages.branchManagement.rightLink" />}
            tid="pages.branchManagement"
            match={match}>
            {branches.map((p, i) => <p>{p.displayName}</p>)}

            <Button onClick={this.readData}>Load Data2</Button>
        </BasePage>;
    }
}

export default connect(BaseStateToProps, BaseActions)(BranchManagement);
*/
