import React from 'react';
import PropTypes from 'prop-types';
import {RenderAmountField} from 'common/form';
import { Field } from 'redux-form';
import NumberFormat from 'react-number-format';
import {withStyles, InputAdornment } from '@material-ui/core/';
import { numberWithSpaces } from 'utils/';
import * as constants from 'constants/uiNames';

const styles = theme => ({
    inputLabel: {
        transform: `translate(14px, 14px) scale(1)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
    inputRequired:{
        backgroundColor: '#faffbd',
    },
    disabled: {
        color: '#757575',
    }
});

const amount = value => value && parseFloat(value.replace(/,/g, '.').replace(/\s+/g, ''));

function NumberFormatCustom(props){
    const { inputRef, value,  ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            decimalScale={2}
            allowedDecimalSeparators={[".",","]}
            thousandSeparator=' '
            value={numberWithSpaces(value)}
        />
    );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function FormAmountField(props){
    const { classes, name, label, suffix, isRequired, inputProps, ...other } = props;
    return(
        <Field
            name={name}
            component={RenderAmountField}
            label={label}
            placeholder={label}

            InputLabelProps={{
                classes: {outlined: classes.inputLabel}
            }}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: inputProps,
                endAdornment: props.value !== ''  ? <InputAdornment position="end">{suffix !== undefined ? suffix : constants.FORM_AMOUNT_FIELD_DEFAULT_SUFFIX}</InputAdornment> : null,
                classes: {
                    root: isRequired && classes.inputRequired,
                    input: classes.input,
                    disabled: classes.disabled,
                },
                readOnly: other.readOnly && true,
            }}
            normalize={amount}
            {...other}
        />
    );
};

FormAmountField.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
    inputProps: PropTypes.object,
};

export default withStyles(styles)(FormAmountField)
