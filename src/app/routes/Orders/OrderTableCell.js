import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardMenu from "../../../components/dashboard/Common/CardMenu";
import {commafy, getCurrencyName, notImpl, toast, toUpperCase} from "../../../util";
import {formalCustomerNumber, OrderStatus, OrderTypes, stdCustomerNumber, toTwoDigit} from "jozdan-common";
import moment from "moment";
import {useIntl} from "react-intl";
import {getOrderTypeName, Tran} from "../../../lngProvider";
// import CardMenu from '../Common/CardMenu'

const OrdersTheme = {
    [OrderTypes.exchange]: {
        clr: 'blue', icn: 'swap'
    },
    [OrderTypes.withdraw]: {
        clr: 'danger', icn: 'trending-down'
    },
    [OrderTypes.topUp]: {
        clr: 'success', icn: 'trending-up'
    },
    [OrderTypes.transfer]: {
        clr: 'purple', icn: 'arrow-right'
    }

};

function getToastHeader(order, locale) {
    const {type, amount, cur, wid, branch, obranch, ocur, oAmount} = order;
    switch (type) {
        case OrderTypes.topUp:
        case OrderTypes.withdraw:
            return stdCustomerNumber(wid);

        case OrderTypes.transfer: {
            const {branch, obranch} = order;
            const {displayName: bname} = branch || {};
            const {displayName: oname} = obranch || {};
            return `From '${bname}' to '${oname}'`
        }

        case OrderTypes.exchange: {
            return "1 "+toUpperCase(ocur, locale)+" = " + toTwoDigit(amount/oAmount)+" "+toUpperCase(cur, locale);
        }

        default: return type;

    }
}

function getOrderInfo(order, locale) {
    const {type, amount, cur, ocur, oAmount} = order;
    const inc = type !== OrderTypes.withdraw;
    var tt = (inc ? toTwoDigit(amount)+" " : '('+toTwoDigit(amount)+') ')+ toUpperCase(cur, locale);
    //console.log(order);

    if(type === OrderTypes.exchange) tt += " to "+toTwoDigit(oAmount)+toUpperCase(ocur, locale);

    return {
        body: getOrderTypeName(type, locale) + " " + tt,
        header: getToastHeader(order, locale)
    }
}

const OrderTableCell = ({data, rejectOrder, acceptOrder}) => {

    const {locale} = useIntl();

    const {header, body} = getOrderInfo(data, locale);

    const {id, displayName, image, orderNo, type, status, amount, updatedAt, cur, stage} = data;
    console.log("type", type);
    const {clr, icn} = OrdersTheme[type || OrderTypes.topUp];
    const inc = type !== OrderTypes.withdraw;
    const statusStyle = status.includes(OrderStatus.issued) ? "text-white bg-success" : status.includes("Completed") ? "bg-teal" : status.includes("In progress") ? "text-white bg-danger" : "text-white bg-grey";
    return (
        <tr
            tabIndex={-1}
            key={id}
        >
            <td>{orderNo}</td>
            <td>
                <div className="user-profile d-flex flex-row align-items-center ">
                    <Avatar
                        alt={displayName}
                        src={image}
                        className="user-avatar"
                    />
                    <div className="user-detail">
                        <h5 className="user-name">{displayName} </h5>
                    </div>
                </div>
            </td>
            <td>{moment(updatedAt).format("lll")}</td>
            <td className={`text-${clr}`}>
                <i className={`mr-2 zmdi zmdi-${icn}`} />
                {inc ? commafy(amount) : '('+commafy(amount)+')'} {toUpperCase(cur, locale)}
            </td>
            <td className={`text-${clr}`}>
                {getOrderTypeName(type, locale)} {stage === 2 && <i style={{color: "green"}} className="zmdi zmdi-check-circle ml-1"/>}
            </td>
            <td className="status-cell text-right">
                <div className={` badge text-uppercase ${statusStyle}`}>{Tran(`OrderStatus.${status}`, locale)}</div>
            </td>
            <td className="text-right">
                <IconButton title={Tran("pages.orders.accept_order", locale)} onClick={acceptOrder}> <i className="zmdi zmdi-check-circle"/></IconButton>
                <IconButton title={Tran("pages.orders.reject_order", locale)} onClick={rejectOrder}> <i style={{color: "red"}} className="zmdi zmdi-close-circle-o"/></IconButton>
                <IconButton title={Tran("pages.orders.order_info", locale)} onClick={() => toast(header, "info", body, 15000)}> <i style={{color: "blue"}} className="zmdi zmdi-info"/></IconButton>
                {/*<CardMenu anchorEl={anchorE1}*/}
                {/*          handleRequestClose={handleRequestClose}/>*/}
            </td>
        </tr>
    );
};

export default OrderTableCell;
