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
import {formalCustomerNumber, notImpl, toast, validCustomerNumber} from "../util";
import {getLogo2} from "../constants";
import {setValues, userSignInSuccess, showAuthMessage} from "../actions";
import {baseApiUrl, checkPayment, loadAgencies, loadInvoice, login} from "../util/db_mongo";
import {Select} from "@material-ui/core";
import {JSelect} from "../components";
import {DEF_AGENCY} from "../util/loacalDB";
import PhoneInput from "react-phone-number-input";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import {toTwoDigit} from "jozdan-common";
import Moment from 'moment';


import InputMask from 'react-input-mask';
import MaterialInput from '@material-ui/core/Input';
import {Input} from "reactstrap";


function getParams({match}) {
    const {params: {invoiceNo}} = match;
    return {invoiceNo};
}

function zeroPad(c) {
    if(c < 10) return "0"+c;
    else return c+"";
}

function getColor(count) {
    const clr = count < 60 ? "danger" : count < 120 ? "amber" : "green";
    return `text-${clr}`;
}

function CountDown({count, expText = "Expired"}) {

    const min = Math.floor(count/60);
    const sec = count - 60*min;

    const text = count < 0 ? expText : zeroPad(min)+":"+zeroPad(sec);

    return <p style={{fontFamily: "courier", fontSize: 28, fontWeight: 'bold'}} className={getColor(count)}>{text}</p>
}


const EMPTY_RESULT = {
    "invoiceStatus": "CHECKED",
    "merchant": {
        "verified": true,
        "referred": true,
        "displayName": "Mohammad Behbahani",
        "address": "Tehran",
        "phone": "+989128363705",
        "password": "$2b$10$TqQrUGAoekbZDrP4Z6ZI5.Lc0bfe1Cc8FkyGcXdb306E1Q6LI9LeO",
        "bid": "61e7f228e0b79e0d8c220d1c",
        "aid": "bahbahan",
        "role": "2-branchAdmin",
        "status": "active",
        "logged_uid": "614596c0dd986f1be0bd0321",
        "wid": "0002537753116088",
        "uid": "61e7f277e0b79e0d8c220d1f",
        "createdAt": "2022-01-19T11:13:59.271Z",
        "updatedAt": "2022-05-18T12:46:59.797Z",
        "__v": 0,
        "otp": 46275,
        "token": "e5bcd596110d03fd364862c815c35653de4ef5493a128a94752482278d185a1b"
    },
    "user": {
        "verified": true,
        "referred": false,
        "role": "1-agencyAdmin",
        "displayName": "BAHBAHAN Admin",
        "phone": "+989133834091",
        "password": "$2b$10$6eno80pE7Yo1mNxFXJN4D.uNCnm54gQ2kkWokFgWehR7hZcKPkVjC",
        "address": "IRAN",
        "aid": "bahbahan",
        "wid": "0002537753116001",
        "uid": "61e5cbf132d1ab1d6c0ff2bb",
        "createdAt": "2022-01-17T20:05:05.355Z",
        "updatedAt": "2022-05-23T11:17:06.628Z",
        "__v": 0,
        "otp": 42413
    }
};


const ErrorView = props => {
    const {logo3: logo2} = DEF_AGENCY;

    return <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
            <div className="app-login-content w-100">
                <div className="d-flex">
                    <div className="w-25 text-center">
                        <img className="w-100" src={`${baseApiUrl}/${logo2}`} alt="No Name Wallet" title="No Name Wallet"/>
                    </div>
                    <div className="w-75 ml-5">
                        <h1>Error</h1>
                        <h2 className="text-danger">An error occurred during your payment.</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

let formRef;
const ResultView = ({result, invoice}) => {

    const submit = () => {
        if(!!formRef) {
            console.log("SSSS", Object.keys(formRef));
            formRef.submit();
            // formRef.dispatchEvent(
            //     new Event("submit", {cancelable: true, bubbles: true})
            // );
        }
    }

    const [count, setCount] = useState(10);
    const {
        _id: invoiceNo,
        cur,
        orderNumber,
        amount,
        verifyUrl,
        owner: {displayName},
    } = invoice;

    console.log(invoice);

    const {logo2: logo2} = DEF_AGENCY;

    const {
        invoiceStatus,
        merchant,
        user,
    } = result || {};


    useEffect(() => {
        setTimeout(() => setCount(count-1), 1000);
        if(count <= 0) submit();
    }, [count]);

    if(invoiceStatus !== "CHECKED") return <ErrorView />


    // console.log(!formRef ? "NULL" : "NOT-NULL");

    return <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
            <div className="app-login-content w-100">
                <div className="d-flex">
                    <div className="w-25 text-center">
                        <img className="w-100" src={`${baseApiUrl}/${logo2}`} alt="No Name Wallet" title="No Name Wallet"/>
                        <CountDown expText="--:--" count={count} />

                    </div>
                    <div className="w-75 ml-5">
                        <h1>Your payment was successful</h1>
                        <TermDef color="green" t="Amount" d={`${toTwoDigit(amount)} ${cur.toUpperCase()}`} />
                        <TermDef color="green" t="Merchant" d={displayName} />
                        <TermDef color="green" t="Order Number" d={orderNumber} />
                        <TermDef color="green" t="InvoiceNo" d={invoiceNo} />

                        <hr />
                        <form ref={ref => formRef = ref} method="POST" action={verifyUrl}>
                            <input type="hidden" name="invoiceNo" value={invoiceNo}/>
                            <input type="hidden" name="orderNumber" value={orderNumber}/>
                            <Input className="btn-outline-success" type="submit" value="DONE"/>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </div>
}

const EMPTY_INVOICE = {
    "invoiceStatus": "ISSUED",
    "cur": "irr",
    "orderNumber": "NA",
    "_id": "",
    "amount": 0,
    "verifyUrl": "/",
    "cancelUrl": "/",
    "logged_uid": "NA",
    "createdAt": "2021-12-20T14:38:05.753Z",
    "updatedAt": "2021-12-20T14:38:05.753Z",
    "owner": {
        "displayName": "NA",
        "role": "4-branchCustomer",
        "phone": "NA",
        "wid": "NA",
        "uid": "NA"
    },
    "id": "",
    "count": 15*60
};

function TermDef({t, d, color = "red"}) {
    return <p className="m-0">{t}: <span className={`text-${color}`}>{d}</span></p>
}

const GateWay = (props) => {
    const dispatch = useDispatch();
    const {loader, alertMessage, showMessage} = useSelector(({auth}) => auth);

    const [invoice, setInvoice] = useState(EMPTY_INVOICE);
    const [count, setCount] = useState(15*60);

    const [wid, setWid] = useState(""); //"0002-5377-5311-5386");
    const [widError, setWidError] = useState("");
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [result, setResult] = useState();




    const clearErrors = () => {
        setWidError("");
        setOtpError("");
    };

    const onChange = ({target: {value}}) => {
        setWid(value);
        clearErrors();
    };
    const onChangeOtp = ({target: {value}}) => {
        setOtp(value);
        clearErrors();
    };

    const doVerify = (verify = true) => {
        if(!invoice) {
            toast("Invalid Invoice");
            return;
        }
        const {verifyUrl, cancelUrl} = invoice;
        if(verify && !verifyUrl || !verify && !cancelUrl) {
            toast(`${verify ? "verifyUrl" : "cancelUrl"} not found`);
            return;
        }
        window.location.replace(verify ? verifyUrl : cancelUrl);
    };

    const doCheckPayment = () => {
        if(wid === "" || wid.indexOf("*") >= 0) setWidError("Incomplete Wallet number entered");
        else if(!validCustomerNumber(wid)) setWidError("Invalid Wallet number entered");

        if(otp === "" || otp.indexOf("*") >= 0) setOtpError("Please fill OTP");

        if(otpError || widError) return;

        checkPayment({wid: formalCustomerNumber(wid), otp: 1*otp, invoiceNo}, setLoader, setResult, err => {
            if(err.message) toast(err.message);
            else toast(err+"");
        });

    };

    if(!!result) {
        console.log("result", result);
    }



    //onChangeOtp

    const {invoiceNo} = getParams(props);

    const {
        invoiceStatus,
        cur,
        orderNumber,
        _id,
        amount,
        verifyUrl,
        cancelUrl,
        logged_uid,
        createdAt,
        updatedAt,
        owner: {displayName},
        id,
        count: initCount,
    } = invoice;


    useEffect(() => {
        if(count >= initCount) setTimeout(() => setCount(count-1), 1000);
    }, [count]);

    useEffect(() => {
        if (showMessage) {
            setTimeout(() => {
                dispatch(hideMessage());
            }, 100);
        }
    }, [showMessage, dispatch]); //showMessage, authUser, props.history, dispatch

    const setLoader = loader => {
        if(loader) dispatch(showAuthLoader());
        else dispatch(hideAuthLoader());
    };

    useEffect(() => {
        if(!invoiceNo) return;
        loadInvoice(invoiceNo, setLoader, setInvoice, err => {
            setInvoice(EMPTY_INVOICE);
            console.log(invoiceNo, err);
            if(!showMessage) dispatch(showAuthMessage("Error loading this invoice"));
        });
    }, [invoiceNo]);

    const {logo2: logo2} = DEF_AGENCY;


    useEffect(() => setLoader(false), []);


    return !!result ? <ResultView
        invoice={invoice}
        result={result}
    /> : (
        <div
            className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
            <div className="app-login-main-content">
                <div className="app-login-content w-100">
                    <div className="d-flex">
                        <div className="w-25 text-center">
                            <img className="w-100" src={`${baseApiUrl}/${logo2}`} alt="No Name Wallet" title="No Name Wallet"/>
                            <CountDown count={count - initCount} />
                        </div>
                        <div className="w-75 ml-5">
                            <h1>BahBahan Payment Gateway </h1>
                            {/*<TermDef t="Invoice Status" d={invoiceStatus} />*/}
                            {/*<TermDef t="Created At" d={Moment(createdAt).format("LLLL")} />*/}
                            <TermDef t="Amount" d={`${toTwoDigit(amount)} ${cur.toUpperCase()}`} />
                            <TermDef t="Merchant" d={displayName} />
                            <TermDef t="Order Number" d={orderNumber} />
                            {/*<TermDef t="Count" d={`${count} - ${initCount}`} />*/}

                            <InputMask
                                value={wid}
                                onChange={onChange}
                                maskChar="*"
                                alwaysShowMask={true}
                                style={{fontSize: 28, fontFamily: "courier"}} mask="9999-9999-9999-9999" >
                                {(inputProps) => <div className="mt-4 mb-4">
                                    <InputLabel htmlFor={"wid"}>Wallet Number</InputLabel>
                                    <MaterialInput
                                        helperText={"Error"}
                                    error={!!widError}
                                    type="text" {...inputProps} />
                                    {!!widError && <p className="text-danger">{widError}</p>}
                                </div>}
                            </InputMask>

                            <InputMask
                                value={otp}
                                onChange={onChangeOtp}
                                maskChar="*"
                                alwaysShowMask={true}
                                style={{fontSize: 28, fontFamily: "courier"}} mask="99999" >
                                {(inputProps) => <div className="mt-4 mb-4">
                                    <InputLabel htmlFor={"otp"}>One Time Password (OTP)</InputLabel>
                                    <MaterialInput
                                        error={!!otpError}
                                        type="text" {...inputProps} />
                                    {!!otpError && <p className="text-danger">{otpError}</p>}
                                </div>}
                            </InputMask>
                        </div>
                    </div>

                    <div className="w-100">

                                <div className="d-flex  mb-3 align-items-center justify-content-between">
                                    <Button onClick={doCheckPayment} className="m-1 w-50" variant="contained" color="primary">
                                        Pay
                                    </Button>

                                    <Button onClick={() => doVerify(false)} className="m-1 w-50" variant="outlined" color="secondary">
                                        Cancel
                                    </Button>
                                </div>
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
            {/*<NotificationContainer/>*/}
        </div>
    );
};


export default GateWay;
