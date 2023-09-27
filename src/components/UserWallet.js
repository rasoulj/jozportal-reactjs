import React from "react"
import {encodeWID} from "jozdan-common";
import {stdCustomerNumber} from "../util";
import QRCode from "react-qr-code";

export const UserWallet  = ({user, title = "Customer Code"}) => {
    const {wid} = user || {wid: "NA"};
    return <div className="d-flex flex-row">
        <div className=" p-2 bg-white">
            <QRCode value={encodeWID(wid)} size={100}/>
        </div>
        <div className="p-3 align-self-center">
            <h1>{stdCustomerNumber(wid)}</h1>
            <span className="text-grey">{title}</span>
        </div>
    </div>;
};
