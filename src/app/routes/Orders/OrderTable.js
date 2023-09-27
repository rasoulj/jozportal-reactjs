import React from 'react'
import OrderTableCell from './OrderTableCell';
import {useIntl} from "react-intl";
import {Tran} from "../../../lngProvider";

let counter = 0;

function createData(orderId, name, image, orderDate, deliveryDate, status, amount) {
    counter += 1;
    return {id: counter, orderId, name, image, orderDate, deliveryDate, status, amount};
}
//
// const data = [
//     createData('121-235-145', 'Alex Dolgove', "https://via.placeholder.com/150x150", '25 Oct', '25 Oct', 'Completed', 2537),
//     createData('298-236-153', 'Domnic Brown', "https://via.placeholder.com/150x150", '28 Oct', '1 Nov', 'Active', -1453),
//     createData('354-241-567', 'Garry Sobars', "https://via.placeholder.com/150x150", '5 Nov', '10 Nov', 'In progress', 734),
//     createData('231-211-745', 'Stella Johnson', "https://via.placeholder.com/150x150", '23 Nov', '26 Nov', 'Cancelled', 2100),
//     createData('782-574-125', 'Stella Johnson', "https://via.placeholder.com/150x150", '23 Nov', '26 Nov', 'Completed', -1022),
// ];

const OrderTable = ({data = [], acceptOrder, rejectOrder}) => {
    const {locale} = useIntl();
    return (
        <div className="table-responsive-material">
            <table className="default-table table-unbordered table table-sm table-hover">
                <thead className="th-border-b">
                <tr>
                    <th>{Tran("orders.no", locale)}</th>
                    <th>{Tran("orders.customer", locale)}</th>
                    <th>{Tran("orders.date", locale)}</th>
                    <th>{Tran("orders.amount", locale)}</th>
                    <th>{Tran("orders.type", locale)}</th>
                    <th className="status-cell text-right">{Tran("orders.status", locale)}</th>
                    <th className="status-cell text-right">{Tran("orders.actions", locale)}</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {data.map(d => {
                    // console.log(d);
                    return (
                        <OrderTableCell
                            acceptOrder={() => acceptOrder(d)}
                            rejectOrder={() => rejectOrder(d)}
                            key={d.id} data={d}
                        />
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
