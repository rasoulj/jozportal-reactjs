import React, {Component} from 'react';
import moment from 'moment';
import {TimePicker} from '@material-ui/pickers';
import {ReadOnly} from "./TinyComponents";

export default ({value, setValue, field, title, className = "", readOnly = false}) => {
    return <div className={className}>
        <ReadOnly visible={readOnly}/>
        <div key="basic_time" className="picker">
            <p className="mb-0 pt-2">{title}</p>
            <TimePicker
                fullWidth
                value={value}
                onChange={v => setValue(field, v)}
            />
        </div>
    </div>
}
