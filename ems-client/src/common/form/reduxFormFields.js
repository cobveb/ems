import React from 'react';
import { withStyles, TextField, Checkbox, InputAdornment, IconButton, Select, OutlinedInput, InputLabel, FormControl, FormHelperText }  from '@material-ui/core/';
import { Visibility, VisibilityOff }from '@material-ui/icons/';
import { green } from '@material-ui/core/colors/';
import TableTransferList from 'common/form/tableTransferList';
import TableForm from 'common/form/tableForm';
import DictionaryField from 'common/form/dictionaryField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import format from "date-fns/format";
import { pl } from 'date-fns/locale';


const GreenCheckbox = withStyles({
    root: {
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

export const renderTextField = ({ label, input, meta: { touched, invalid, error }, ...custom }) => (
    <TextField
        label={label}
        placeholder={label}
        fullWidth
        variant="outlined"
        error={touched && invalid}
        helperText={touched && error}
        {...input}
        {...custom}
    />
);


export function RenderDigitsField({ label, input, meta: { touched, invalid, error }, ...custom }){
    const [value, setValue] = React.useState(input.value);

    React.useEffect(() => {
        if(input.value !== value){
            setValue(input.value)
        }
    },  [value, input])

    return(
        <>
            <TextField
                label={label}
                placeholder={label}
                fullWidth
                value={value}
                variant="outlined"
                error={touched && invalid}
                helperText={touched && error}
                InputLabelProps={{
                    classes: {outlined: custom.InputLabelProps.classes.outlined}
                }}
                className={custom.classes}
                InputProps={{
                    classes: {input: custom.InputProps.classes.input},
                }}
                onChange={(event) => input.onChange(event.target.value === '' ? '' : parseInt(event.target.value, 10))}
                onBlur={(event) => input.onBlur(value)}
            />
        </>
    );
};

export const renderPasswordField = ({label, input, meta: { touched, invalid, error }, showPassword, onClick,  ...custom }) => (
    <TextField
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        label={label}
        disabled={custom.disabled}
        error={touched && invalid}
        helperText={touched && error}
        placeholder={label}
        InputLabelProps={{
            classes: {outlined: custom.InputLabelProps.classes.outlined}
        }}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end" >
                    <IconButton
                        size="small"
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={onClick}
                        disabled={custom.disabled}
                    >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            ),
            classes: {input: custom.InputProps.classes.input},
        }}
        {...input}
    />
);
export function RenderSelectField({label, input, value, meta: { touched, error }, children, ...custom}) {

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    return (
        <FormControl variant="outlined" fullWidth={true} error={touched && error ? true : false} disabled={custom.disabled}>
            <InputLabel ref={inputLabel} htmlFor={custom.name} className={custom.classes.label}>
                {label}
            </InputLabel>
            <Select
                onChange={custom.onChange}
                input={<OutlinedInput labelWidth={labelWidth} name={custom.name} id={custom.name} classes={custom.inputProps.classes}/>}
                className={custom.classes.isRequired}
                {...input}
            >
                {children}
            </Select>
            <FormHelperText>{touched && error}</FormHelperText>
        </FormControl>

    );
};


export const renderCheckbox = ({ input, label }) => (
    <GreenCheckbox
        label={label}
        checked={input.value ? true : false}
        onChange={input.onChange}
    />
);

export function RenderTableTransferList({fields, head, leftSide, rightSide, leftSideLabel, rightSideLabel, ...custom}) {
    return(
        <TableTransferList
            fields={fields}
            leftSideLabel={leftSideLabel}
            leftSide={leftSide}
            rightSideLabel={rightSideLabel}
            rightSide={rightSide}
            head={head}
            {...custom}
        />
    )
}

export function RenderFormTable({fields, head, allRows, checkedRows, ...custom}) {
    return(
        <TableForm
            head={head}
            allRows={allRows}
            checkedRows={checkedRows}
            fields={fields}
            {...custom}
        />
    )
}

export function renderDateField({meta: { submitting, error, invalid }, input: { value, ...inputProps }, name, label, ...others}){

    class LocalizedUtils extends DateFnsUtils {
        getCalendarHeaderText(date) {
            return  format(date, "LLLL yyyy", { locale: this.locale });
        }
    }

    const onChange = date => {
        Date.parse(date) ? inputProps.onChange(date.toISOString()) : inputProps.onChange(date);
    };

    return(
        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={pl}>
            <KeyboardDatePicker
                id={name}
                autoOk
                variant="inline"
                disableToolbar
                fullWidth
                inputVariant="outlined"
                format="dd-MM-yyyy"
                mask = "__-__-____"
                label={label}
                value={value ? new Date(value) : null}
                keyboardIcon = {others.disabled && null}
                disabled={submitting}
                onChange={onChange}
                error={error && invalid}
                {...others}
            />
        </MuiPickersUtilsProvider>
    );
}


export function RenderDictionaryField({ label, input, value, meta, meta: { touched, invalid, error }, onClick, validate, ...custom} ){
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    return(
        <FormControl variant="outlined" fullWidth={true} error={touched && error ? true : false} disabled={custom.disabled}>
            <InputLabel ref={inputLabel} htmlFor={input.name} className={custom.classes.label}>
                {label}
            </InputLabel>

            <DictionaryField
                labelWidth={labelWidth}
                name={input.name}
                dictionaryName={custom.dictionaryName}
                classes={custom.classes.isRequired}
                inputProps={custom.inputProps.classes}
                disabled={custom.disabled}
                items={custom.items}
                error={error}
                {...input}
            />

            <FormHelperText>{touched && error}</FormHelperText>
        </FormControl>
    );
};