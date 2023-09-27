import React from 'react';
import ReactExport from "react-export-excel";
import {HeaderButton} from "../components";
import moment from "moment";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

//    const {amount, desc, cur, wid, updatedAt} = item;
export const ExportToExcel = ({data}) => <ExcelFile filename={"Transactions Report @ "+moment(Date.now()).format("lll")} element={<HeaderButton title="Export Excel" icon="download"/>}>
    <ExcelSheet data={data} name="Transaction Report" >
        <ExcelColumn label="Order No." value="orderNo"/>
        <ExcelColumn label="Currency" value="cur"/>
        <ExcelColumn label="Amount" value="amount"/>
        <ExcelColumn label="Customer Code" value="wid"/>
        <ExcelColumn label="Updated At" value="updatedAt"/>
        <ExcelColumn label="Description" value="desc"/>
        {/*<ExcelColumn label="Marital Status"*/}
        {/*             value={(col) => col.is_married ? "Married" : "Single"}/>*/}
    </ExcelSheet>
</ExcelFile>;
