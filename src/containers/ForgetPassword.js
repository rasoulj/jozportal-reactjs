import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import IntlMessages from 'util/IntlMessages';
import CircularProgress from '@material-ui/core/CircularProgress';


// import {
//     hideMessage,
//     //showAuthLoader,
//     userSignIn
// } from 'actions/Auth';
// import {auth} from "../firebase/firebase";
import {toast, validPassword} from "../util";
import {getErrorMessage} from "jozdan-common";
import {getLogo2} from "../constants";

const auth = () => {};


const ERROR = {
    PASS: "Password is not valid, password length is at least 6 characters",
    CONFIRM: "Passwords do not match",
    CODE: "Invalid code entered",
};

function getParams({match}) {
    const {params: {email}} = match;
    return {email};
}


const ForgetPassword = props => {
    const [email, setEmail] = useState('');
    const [stage, setStage] = useState(0);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const dispatch = useDispatch();
    const {alertMessage, showMessage, authUser} = useSelector(({auth}) => auth);

    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const {email: em} = getParams(props);
        setEmail(em);
    }, []);

    const stages = [
        //Stage #0
        <form>
            <p><IntlMessages id="appModule.forget-password.msg" /></p>
            <fieldset>
                <TextField
                    label={<IntlMessages id="appModule.email"/>}
                    fullWidth
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    margin="normal"
                    className="mt-1 my-sm-3"
                />

                <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button onClick={() => {
                        setLoader(true);

                        auth.sendPasswordResetEmail(email)
                            .then(() => setStage(1))
                            .catch(err => toast(getErrorMessage(err)))
                            .finally(() => setLoader(false));
                    }} variant="contained" color="secondary">
                        <IntlMessages id="appModule.send_email"/>
                    </Button>

                    {/*<Button onClick={notImpl}>Forget Password</Button>*/}
                    <Link to="/signin">
                        {/*Cancel*/}
                        <IntlMessages id="cancel"/>
                    </Link>
                </div>

            </fieldset>
        </form>,

        <form>
            <p><IntlMessages id="appModule.send_email.msg" /></p>

            <Button onClick={() => props.history.push("/")} variant="contained" color="secondary">
                {/*Done*/}
                <IntlMessages id="done"/>
            </Button>
        </form>,

        //Stage #1
        <form>
            <p>A 6-digit code has been sent to youe e-mail, please enter to reset your password.</p>

            <fieldset>
                <TextField
                    label={"Reset Code"}
                    fullWidth
                    onChange={(event) => setCode(event.target.value)}
                    value={code}
                    margin="normal"
                    className="mt-1 my-sm-3"
                />

                <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button onClick={() => {
                        if (!code || code.length !== 6) {
                            toast(ERROR.CODE);
                            return;
                        }

                        setLoader(true);
                        auth.verifyPasswordResetCode(code)
                            .then(() => setStage(2))
                            .catch(e => toast(getErrorMessage(e)))
                            .finally(() => setLoader(false));
                    }} variant="contained" color="secondary">
                        Reset Password
                    </Button>

                    <Link to="/signin">
                        Cancel
                        {/*<IntlMessages id="signIn.signUp"/>*/}
                    </Link>
                </div>

            </fieldset>
        </form>,

        //Stage #2
        <form>
            <p>Enter your new password.</p>

            <fieldset>
                <TextField
                    type="password"
                    label={"New Password"}
                    fullWidth
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    margin="normal"
                    className="mt-1 my-sm-3"
                />
                <TextField
                    type="password"
                    label={"Confirm Password"}
                    fullWidth
                    onChange={(event) => setConfirm(event.target.value)}
                    value={confirm}
                    margin="normal"
                    className="mt-1 my-sm-3"
                />

                <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button onClick={() => {
                        console.log("pass:", password);
                        let errors = [];
                        if (!validPassword(password)) errors.push(ERROR.PASS);
                        if (password !== confirm) errors.push(ERROR.CONFIRM);
                        if (errors.length > 0) {
                            errors.forEach(e => toast(e, "error"));
                            return;
                        }

                        setLoader(true);
                        auth.confirmPasswordReset(code, password)
                            .then(() => {
                                toast("Password has been changed successfully", "success");
                                setTimeout(() => props.history.push('/'), 3000);
                            })
                            .catch(e => toast(getErrorMessage(e)))
                            .finally(() => setLoader(false));

                    }} variant="contained" color="secondary">
                        Set New Password
                    </Button>

                    {/*<Button onClick={notImpl}>Forget Password</Button>*/}
                    <Link to="/signin">
                        Cancel
                        {/*<IntlMessages id="signIn.signUp"/>*/}
                    </Link>
                </div>

            </fieldset>
        </form>


    ];

    // useEffect(() => {
    //     if (showMessage) {
    //         setTimeout(() => {
    //             dispatch(hideMessage());
    //         }, 100);
    //     }
    //     if (authUser !== null) {
    //         props.history.push('/');
    //     }
    // }, [showMessage, authUser, dispatch]); //showMessage, authUser, props.history, dispatch


    return (
        <div
            className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
            <div className="app-login-main-content">

                <div className="cyan app-logo-content  d-flex align-items-center justify-content-center"
                     style={{backgroundColor: '#fff'}}>
                    <Link className="logo-lg" to="/" title="Jozdan">
                        <img src={getLogo2()} alt="jozdan" title="jozdan"/>
                    </Link>
                </div>

                <div className="app-login-content">
                    <div className="app-login-header mb-4">
                        <h1><IntlMessages id="appModule.forget-password.label"/></h1>
                    </div>

                    <div className="app-login-form">
                        {stages[stage]}
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


export default ForgetPassword;
