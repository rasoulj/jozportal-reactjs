import React, {useState} from "react"
import CircularProgress from "components/CircularProgress";
import {useSelector} from "react-redux";
import IntlMessages from 'util/IntlMessages';
import ContainerHeader from "./ContainerHeader";
import {setLoader, setValues} from "../actions";
import {Link} from "react-router-dom";
import {
    ListItemSecondaryAction,
    Avatar,
    ListItem,
    TextField,
    DialogActions,
    DialogContentText,
    DialogContent,
    DialogTitle,
    Dialog,
    List,
    Button,
    Input
} from "@material-ui/core";
import {Card, CardBody, CardSubtitle, CardText} from "reactstrap";
import {delColor} from "../constants";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
// import {TimePicker} from "material-ui-pickers";
import {DatePicker, TimePicker} from '@material-ui/pickers';
import moment from "moment";
import TimePickers from "./TimePickers";
// import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import {UserStatus} from "../models/User";
import {useIntl} from "react-intl";
import {Tran} from "../lngProvider";
import {commafy} from "../util";

export const NoData = ({mid = "nodata", loader = false, icon = "alert-circle"}) => <div className="jr-card">
    <h4>
        <span className="mr-3"><i className={`zmdi zmdi-${icon}`}/></span>
        <IntlMessages id={loader ? "loading" : mid}/>
    </h4>
</div>;


export const BasePage = (
    {
        dialogs = [],
        loader = false,
        children,
        title,
        tid,
        match
    }) => {
    // const hasRight = !!right;
    // const hasTop = subTitle || hasRight;

    const {locale} = useIntl();

    return <div className="app-wrapper">
        {dialogs}
        <ContainerHeader locale={locale} match={match} title={title || <IntlMessages id={tid}/>}/>
        {children}
        <Loader2 loader={loader}/>
    </div>;
};

export const SectionHeader = ({tid, title, right, children, visible = true}) => {

    const tt = !tid && !title ? <div>&nbsp;</div> :
        <h4 className="ml-3 font-weight-bold">{(tid && <IntlMessages id={tid}/>) || title || " "}</h4>;

    return !visible ? null : <div>
        <div className="d-flex justify-content-between mb-2 mt-5 border-bottom">
            {tt}
            {right}
        </div>
        <div>
            {children}
        </div>
    </div>;
};

export const BaseStateToProps = ({pax}) => {
    const {loader, user, agency, branch, branches} = pax;
    return {loader, user, agency, branch, branches};
};


export const BaseActions = {setLoader, setValues};

export const Loader = (props) => {
    const {loader} = useSelector(({pax}) => pax);
    return <Loader2 loader={loader}/>;
};

export const Loader2 = ({loader}) => {
    return loader &&
        <div style={{position: 'absolute', margin: 'auto', top: 0, left: 0, right: 0, bottom: 0}}>
            <CircularProgress/>
        </div>;
};


export const HeaderButton = ({tid, title = "", color = "secondary", onClick, icon, className = "mr-1", disabled = false, style}) =>
    <Button
        size="small"
        style={style}
        disabled={disabled}
        variant="contained"
        className={`${className} bg-${disabled ? "grey" : color}`}
        // color={color}
        onClick={onClick}
        // style={{height: '2.5em'}}
    >
        {icon && <i className={`zmdi zmdi-${icon} zmdi-hc-fw pr-3`}/>}
        {tid && <IntlMessages id={tid}/> || title}
    </Button>;


export const HeaderLink = ({color = "secondary", to, icon, title}) => <Link className={`btn bg-${color}`} to={to}>
    <i className={`zmdi zmdi-${icon} zmdi-hc-fw`}/>
    <span className="jr-list-text font-weight-bold "><IntlMessages id={title}/></span>
</Link>;


export const FlatList = ({
                             data, renderItem, loader, noData = <NoData loader={loader}/>
                         }) => !data || data.length === 0 ? noData : <List>
    {data.map(renderItem)}
</List>;


export const GenDialog = (
    {
        loader = false,
        body = "",
        open,
        onClose = () => {
        },
        title,
        actions = []
    }) => <Dialog open={open} onClose={() => onClose(null)}>
    <DialogTitle>
        {title}
    </DialogTitle>
    <DialogContent className="w-100">
        <DialogContentText>
            {body}
            <Loader2 loader={loader}/>
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        {actions.map(({label, value, color = "secondary"}, key) => <Button key={key} onClick={() => onClose(value)}
                                                                           color={color}>
            {label}
        </Button>)}
    </DialogActions>
</Dialog>;


export const FormGenTypes = {
    text: "text",
    email: "email",
    number: "number",
    number2: "number2",
    password: "password",
    select: "select",
    time: "time",
    date: "date",
    phone: "phone"
};

function isSelect(model) {
    if (!model) return false;
    const {options, type} = model;
    return options && options.length > 0 && type === FormGenTypes.select;
}

function isNumber(model) {
    if (!model) return false;
    const {type} = model;
    return type === FormGenTypes.number;
}

function isNumber2(model) {
    if (!model) return false;
    const {type} = model;
    return type === FormGenTypes.number2;
}

function isDate(model) {
    if (!model) return false;
    const {type} = model;
    return type === FormGenTypes.date;
}


export const ReadOnly = ({visible = false}) => visible && <div style={{
    position: 'absolute',
    backgroundColor: 'rgb(255,255,255,0.02)',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    zIndex: 1000
}}/>;

function isAllZero(frac) {
    for(const f of frac) {
        if(f !== "0") return false;
    }
    return true;
}

export function parseInt2(num) {
    // return num;
    // if(!num || num === "") return 0;
    const str = num.toString().split(".");
    // console.log("parseInt2", str);
    const first = str[0];
    const last = str.length >= 2 ? str[1] : "0";

    const frac = str.length >= 2 && isAllZero(last) ? `.${last}` : (1*last) / (Math.pow(10, last.length));

    return first.split(",").join("") * 1 + frac;
}

export const FormGen = (
    {
        className = "",
        models = {},
        values = {},
        setValue,
        getError = (field, value) => false,
        getErrorMessage = (field, value) => "",
        getDisabled = (field, value) => false
    }) => {

    const {locale} = useIntl();

    // console.log("values", values);

    return <div className={className}>

        <form className={`row ${className}`} noValidate autoComplete="off">
            {Object.keys(models).map(field => {
                const value = values[field];
                const {className, required = false, title, label: id, type, options, readonly} = models[field];
                const label = title || Tran(id, locale);
                const readOnly = readonly || getDisabled(field, value);
                const time = models[field].time === "time";
                // console.log("models[field]", models[field]);
                const phone = models[field].type === FormGenTypes.phone;
                const select = isSelect(models[field]);
                const number = isNumber(models[field]);
                const number2 = isNumber2(models[field]);
                const date = isDate(models[field]);
                const error = getErrorMessage(field, value);
                return <div key={field} className={className} style={{position: 'relative'}}>
                    <ReadOnly visible={readOnly}/>
                    {phone ? <div className="mt-2" style={{direction: 'ltr'}}>
                            {label && <InputLabel htmlFor={label}>{label} {required ? "*" : ""}</InputLabel>}
                            <PhoneInput
                                style={{textAlign: 'left'}}
                                inputClass="w-100"
                                defaultCountry ={"IR"}
                                value={value}
                                onChange={value => {
                                    if (!readOnly) setValue(field, value);
                                }}
                            />
                        </div> :
                        time ? <TimePickers
                            value={value}
                            setValue={setValue}
                            field={field}
                        /> : select ? <JSelect
                            error={error}
                            readOnly={readOnly}
                            label={label}
                            onChange={value => {
                                if (!readOnly) setValue(field, value);
                            }}
                            value={value || options[0].v}
                            options={options}
                        /> : date ? <DatePicker
                            className={className}
                            value={value}
                            onChange={value => setValue(field, value)}
                        /> : <TextField
                            autoComplete="new-password"
                            type={number2 ? "text" : type}
                            color="secondary"
                            required={required}
                            // autoComplete="false"
                            // disabled={getDisabled(field, value)}
                            id={field}
                            label={label}
                            error={getError(field, value)}
                            helperText={getErrorMessage(field, value)}
                            value={number2 ? commafy(value) : value || ""}
                            onChange={({target: {value}}) => {
                                if (!readOnly) setValue(field, number ? 1*value : number2 ? parseInt2(value) : value);
                            }}
                            margin="normal"
                            fullWidth
                        />}
                </div>
            })}
        </form>
    </div>;
};

export const ListItemText2 = ({primary, secondary, disabled, third}) => <div className="align-items-center">
    <h4 className={`mb-0 font-weight-bold text-${disabled ? "grey" : "white"}`}>{primary}</h4>
    <p className="mb-0 text-grey">{secondary}</p>
    {!!third && <p className="mb-0 text-grey">{third}</p>}
</div>;


export const UserItemView = ({user = {}, key, onClick, onDelete, color = "grey"}) => {
    const {displayName, address, email, status, referred} = user;
    // const dis = status === UserStatus.DISABLE;
    const dis = !referred;
    return <ListItem key={key} button onClick={onClick}>
        <Avatar className={`mr-3 bg-${dis ? "grey" : color}`}>
            <i className="zmdi zmdi-account zmdi-hc-fw zmdi-hc-lg "/>
        </Avatar>
        <ListItemText2 disabled={dis} primary={displayName} secondary={email}/>
        <ListItemSecondaryAction button>
            <Button color="secondary" onClick={onClick}>
                <i className={`zmdi zmdi-chevron-right zmdi-hc-fw zmdi-hc-2x text-${delColor}`}/>
            </Button>
        </ListItemSecondaryAction>
    </ListItem>
};


export const SolidCards = ({header, title, subTitle, className, children}) => {
    return (

        <Card className={`shadow border-1 ${className}`}>
            <CardBody>
                {header && <h4 className="mb-md-4 text-center">{header}</h4>}
                {title && <h3 className="card-title text-center">{title}</h3>}
                {subTitle && <CardSubtitle className="text-white text-center">{subTitle}</CardSubtitle>}
                <hr style={{borderColor: '#fff', borderWidth: 0.5}}/>
                {children}
                {/*<CardText>Last modified 2 days ago</CardText>*/}
            </CardBody>
        </Card>

    );
};


export const JSelect = ({

                            options = [],
                            label,
                            onChange,
                            value,
                            readOnly = false,
                            visible = true,
    error = undefined,
                        }) => {
    // console.log("JSelect-value", value);
    const {locale} = useIntl();

    return visible && <FormControl className="w-100 mb-2">
        {label && <InputLabel htmlFor={label}>{label}</InputLabel>}
        <Select
            fullWidth
            variant="filled"
            // open={!readOnly}
            defaultValue={options[0].v}
            value={value}
            onChange={event => onChange(event.target.value)}
            input={<Input id={label}/>}
        >
            {options.map(({v, l}, key) => <MenuItem key={key}
                                                    value={v}>{Tran(l, locale)}</MenuItem>
            )}
        </Select>
        <ErrorHelper error={error} />
    </FormControl>;
};

export const ErrorHelper = ({error}) => ((error) || "" !== "") && <p className="text-danger">{error}</p>;

export const SimpleLineChart = ({data, yKey, color = "#3367d6", title, className = "col-12 col-md-12"}) => {
    // console.log("data2", data);
    return (<div className={className}>
        {title && <p className="text-center">{title}</p>}
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}
                       margin={{top: 10, right: 0, left: -25, bottom: 0}}>
                <XAxis dataKey="updatedAt"/>
                <YAxis/>
                {/*<CartesianGrid strokeDasharray="3 3"/>*/}
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey={yKey} stroke={color} activeDot={{r: 8}}/>
                {/*<Line type="monotone" dataKey="uv" stroke="#ffc658"/>*/}
            </LineChart>
        </ResponsiveContainer>
    </div>);
};
