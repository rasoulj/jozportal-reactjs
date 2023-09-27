import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import IntlMessages from 'util/IntlMessages';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    hideMessage,
    showAuthLoader,
    hideAuthLoader,
    userFacebookSignIn,
    userGithubSignIn,
    userGoogleSignIn,
    userSignIn,
    userTwitterSignIn
} from 'actions/Auth';
import {notImpl, toast} from "../util";
import {getLogo2} from "../constants";
import {setValues, userSignInSuccess} from "../actions";
import {baseApiUrl, loadAgencies, login} from "../util/db_mongo";
import {Select} from "@material-ui/core";
import {BasePage, JSelect} from "../components";
import {DEF_AGENCY} from "../util/loacalDB";
import PhoneInput from "react-phone-number-input";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import {CustomerMainMenu} from "../app/routes/Home";


const SignIn = ({history, match}) => {

    // const [email, setEmail] = useState(''); //demo@example.com | admin@agency2.com
    const [password, setPassword] = useState(''); //demo#123
    const dispatch = useDispatch();
    const {loader, alertMessage, showMessage, authUser} = useSelector(({auth}) => auth);
    const [agencies, setAgencies] = useState([DEF_AGENCY]);
    const [phone, setPhone] = useState("");

    const {aid, agency} = useSelector(({pax}) => pax);

    useEffect(() => {
       setPassword("123456");
       setPhone("+989133834094");
    }, []);


    useEffect(() => {
        if (showMessage) {
            setTimeout(() => {
                dispatch(hideMessage());
            }, 100);
        }
        if (authUser !== null) {
            history.push('/');
        }
    }, [showMessage, authUser, dispatch]); //showMessage, authUser, props.history, dispatch

    const setLoader = loader => {
        if(loader) dispatch(showAuthLoader());
        else dispatch(hideAuthLoader());
    };

    const handleSignIn = () => {
        login({phone, aid, password}, setLoader, data => {
            dispatch(setValues(data));
            const {authToken: token} = data;
            dispatch(userSignInSuccess(token));
            console.log(data);
        }, d => {
            const {message} = d || {message: "Unknown error"};
            toast(message);
        });
        // loadAgencies(setLoader, docs => console.log(docs));
        // setLoader(true);
        // setTimeout(() => setLoader(false), 2000);
        return;
        dispatch(showAuthLoader());
        // dispatch(userSignIn({email, password}));
    };

    // const getAgency = () => {
    //   return agencies.find(p => p.uid === aid);
    // };

    useEffect(() => {
        loadAgencies(setLoader, agencies => {
            console.log(agencies);
            setAgencies((agencies || []).map(agency => {
                return {
                    l: agency.displayName,
                    v: agency.uid,
                    ...agency
                }
            }));
        }, err => {
            console.log("eeeeee: "+err);
        });
    }, []);

    // useEffect(() => {
    //     const listener = event => {
    //         if (event.code === "Enter") {//} || event.code === "NumpadEnter") {
    //             console.log("Enter key was pressed. Run your function.");
    //             console.log("email, password", email, password);
    //             handleSignIn();
    //             // callMyFunction();
    //         }
    //     };
    //     document.addEventListener("keydown", listener);
    //     return () => {
    //         document.removeEventListener("keydown", listener);
    //     };
    // }, []);

    // const agency = getAgency();
    const {logo2, logo3} = agency || DEF_AGENCY;

    // console.log("logo2", logo2);

    useEffect(() => setLoader(false), []);
    // setLoader(false);


    return (
        <div
            className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">


            <div className="app-login-main-content">
                <div className="cyan app-logo-content  d-flex align-items-center justify-content-center" style={{backgroundColor: '#fff'}}>
                    <Link className="logo-lg" to="/" title="No Name Wallet">
                        <img src={`${baseApiUrl}/${logo2}`} alt="No Name Wallet" title="No Name Wallet"/>
                    </Link>
                </div>

                <div className="app-login-content">
                    <div className="app-login-header mb-4">
                        <h1><IntlMessages id="appModule.login.label"/></h1>
                    </div>

                    <div className="app-login-form">

                        <form type="submit" onSubmit={e => {
                            e.preventDefault();
                            handleSignIn();
                        }}>
                            <fieldset>
                                <JSelect
                                    visible={false}
                                    value={aid}
                                    options={agencies}
                                    onChange={aid => {
                                        const agency = agencies.find(p => p.uid === aid);
                                        dispatch(setValues({aid, agency}, true));
                                        // setAid(aid);
                                        // console.log(agency);
                                    }}
                                />
                                <div className="mt-4 mb-1 d-flex align-items-center justify-content-start" style={{direction: 'ltr'}}>
                                    <InputLabel htmlFor={"phone"}>{"Phone"}</InputLabel>
                                    <PhoneInput
                                        className="w-100 ml-2"
                                        style={{textAlign: 'left'}}
                                        inputClass="w-100"
                                        defaultCountry ={"IR"}
                                        value={phone}
                                        onChange={value => {
                                            console.log(value);
                                            setPhone(value)
                                            // if (!readOnly) setValue(field, value);
                                        }}
                                    />
                                </div>

                                {/*<TextField*/}
                                {/*    label={<IntlMessages id="appModule.email"/>}*/}
                                {/*    fullWidth*/}
                                {/*    onChange={(event) => setEmail(event.target.value)}*/}
                                {/*    defaultValue={email}*/}
                                {/*    margin="normal"*/}
                                {/*    className="mt-1 my-sm-3"*/}
                                {/*/>*/}
                                <TextField
                                    type="password"
                                    label={<IntlMessages id="appModule.password"/>}
                                    fullWidth
                                    onChange={(event) => setPassword(event.target.value)}
                                    defaultValue={password}
                                    margin="normal"
                                    className="mt-1 my-sm-3"
                                />

                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <Button type="submit" variant="contained" color="primary">
                                        <IntlMessages id="appModule.signIn"/>
                                    </Button>

                                    {/*<Button onClick={notImpl}>Forget Password</Button>*/}
                                    <Link to={`/forget-pass/${phone}`}>
                                        {/*Forget Password*/}
                                        <IntlMessages id="appModule.forget-password.label"/>
                                    </Link>
                                </div>

                            </fieldset>
                        </form>
                    </div>
                </div>

            </div>
            {
                loader &&
                <div className="loader-view">
                    <CircularProgress/>
                </div>
            }
            {showMessage && NotificationManager.error(alertMessage)}
            <NotificationContainer/>
        </div>
    );
};


export default SignIn;
