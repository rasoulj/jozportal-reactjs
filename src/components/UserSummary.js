import React from "react"
import {UserWallet} from "./UserWallet";
import moment from "moment"
import {Roles, UserStatus} from "../models/User";
import {getCurrencyName, camelCase, toUpperCase} from "../util";
import {useIntl} from "react-intl";
import {Tran} from "../lngProvider";
import {ViewWidValueQRCode} from "./ViewWidValueQRCode";

const pp = {
    "phone":"+989353456784",
    "uid":"0c6155a1-0f69-4eba-aad7-dcbb12482ca3",
    "validTo":"2020-09-16T12:42:42.155Z",
    "role":"BRANCH",
    "bid":"0c6155a1-0f69-4eba-aad7-dcbb12482ca3",
    "displayName":"Branch #2",
    "validFrom":"2020-09-16T10:42:42.148Z",
    "address":"Dehkord, Farsan21111",
    "aid":"agency2",
    "wid":"1359509146962042",
    "defCurrency":"iqd"
};

function TermDef({term, def, status}) {
    const disabled = status === UserStatus.DISABLE;
    const st = disabled ? "col-10 text-light" : "col-10 text-amber";

    const {locale} = useIntl();

    return <div className="d-flex flex-row  mb-2">
        <div className={`col-2 font-weight-bold ${disabled ? "text-light" : ""} text-right`}>{Tran(term, locale)}:</div>
        <div className={st}>{def}</div>
    </div>
}

function formatTime(date) {
    return moment(date).format("HH:mm");
}

const TITLES = {
    [Roles.BRANCH]: "Branch",
    [Roles.BRANCH_AGENT]: "Branch Agent",
    [Roles.CUSTOMER]: "Customer",
    [Roles.AGENCY]: "Agency",
    [Roles.AGENCY_ADMIN]: "Agency Admin",
    [Roles.BRANCH_ADMIN]: "Branch Admin",
    [Roles.NONE]: "None",
};


export const UserSummary = ({user}) => {
    const {phone, validTo, displayName, validFrom, address, defCurrency, role, email, status, referPhone} = user || {};
    const isb = role === Roles.BRANCH;

    const {locale} = useIntl();

    return <div>
        {/*<UserWallet user={user} title={`${Tran(`roles.${role}`, locale)} ${Tran("wallet", locale)}`} />*/}

        <ViewWidValueQRCode user={user} title={`${Tran(`roles.${role}`, locale)} ${Tran("wallet", locale)}`} />

        <div className="mt-5">{" "}</div>
        <TermDef status={status} term="form.displayName" def={displayName} />
        <TermDef status={status} term="form.user_status" def={Tran(status, locale)} />
        <TermDef status={status} term="form.phone" def={phone} />
        <TermDef status={status} term="Refer Phone" def={referPhone} />
        <TermDef status={status} term="form.email" def={email} />
        <TermDef status={status} term="form.address" def={address} />
        {isb && [
            <TermDef status={status} key={1} term="form.defCurrency" def={`${toUpperCase(defCurrency, locale)} (${getCurrencyName(defCurrency, locale)})`} />,
            <p key={2} className="mt-5 mb-0">{Tran("branch.working_time", locale)}:</p>,
            <TermDef status={status} key={3} term="from" def={formatTime(validFrom)} />,
            <TermDef status={status} key={4} term="to" def={formatTime(validTo)} />
        ]}
      </div>
};
