import React, {Component} from 'react';
import IntlMessages from 'util/IntlMessages';

import {connect} from "react-redux"
import {BasePage, BaseActions, BaseStateToProps} from "../../../components/TinyComponents";

class SamplePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFollow: false
        };


    }

    componentDidMount() {
        //const {user} = this.props;
        // const user = loadUser();
    }

    handleToggle() {
        const {isFollow} = this.state;
        this.setState({isFollow: !isFollow});
    }
    //
    // async readData() {
    //     const {setValues, setLoader} = this.props;
    //     setLoader(true);
    //
    //     try {
    //         const user = await loadUser();
    //         setValues({user}, true);
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setLoader(false);
    //     }
    // }
    //
    // async saveData() {
    //     const {setValues, setLoader, user = {}} = this.props;
    //     setLoader(true);
    //     try {
    //         const u = {...user, displayName: "Alireza2"};
    //         await saveUser(u);
    //         setValues({user: u});
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setLoader(false);
    //     }
    // }
    //
    // async readData2() {
    //     //const p = await firestore.collection("agencies").add({value1: "Salaam"});
    //     //console.log(p);
    //
    //     const pp = await firestore.collection("agencies/test_agancy/branchs").get();
    //
    //     pp.docs.forEach(p => console.log(p.data()))
    //
    //     // const value = database.ref("agencies").set({key1: "value1"}, e => console.log("Salaam", e));
    //     // console.log(value);
    // }

    render() {
        const {isFollow} = this.state;
        const {user, match, loader} = this.props;
        const {displayName} = user || {};
        return <BasePage tid="pages.samplePage" match={match}>
            <div className="d-flex justify-content-center">
                <h1><IntlMessages id="pages.samplePage.description"/></h1>
            </div>

            <h2>{displayName ? displayName : "N/A"}</h2>
            <h2>{loader ? "Loading ..." : "Loaded"}</h2>


            {/*<Button size="small" variant="contained" className="mb-0" color="primary"*/}
            {/*        onClick={this.saveData.bind(this)}>{isFollow === true ? 'Follow2' : 'Unfollow2'}</Button>*/}

            {/*<Button size="small" variant="contained" className="mb-0" color="primary"*/}
            {/*        onClick={this.readData.bind(this)}>Read Data2</Button>*/}

            {/*<Button size="small" variant="contained" className="mb-0" color="secondary"*/}
            {/*        onClick={() => toast(displayName, "error")}>toast</Button>*/}

        </BasePage>;
    }
}

export default connect(BaseStateToProps, BaseActions)(SamplePage);
