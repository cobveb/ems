import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles, InputAdornment }  from '@material-ui/core/';
import {renderTextField} from 'common/form';
import {TextMask, TextMaskCustom} from 'utils/';


const stylesFormTextField = theme => ({
    inputLabel: {
        transform: `translate(14px, 14px) scale(1)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
    inputMultiline:{
        padding: theme.spacing(0),
    },
    inputMultilineRequired:{
        padding: theme.spacing(0),
        backgroundColor: '#faffbd',
    },
    inputRequired: {
        padding: theme.spacing(1.5),
        backgroundColor: '#faffbd',
    },
    inputRequiredSuffix: {
        backgroundColor: '#faffbd',
    },
    disabled: {
        color: '#757575',
    }
});

function FormTextField(props) {
    const { classes, name, label, isRequired, mask, valueType, suffix, inputProps, ...other } = props;
    return(
        <Field
            name={name}
            component={renderTextField}
            label={label}
            placeholder={label}
            InputLabelProps={{
                classes: {outlined: classes.inputLabel}
            }}
            InputProps={{
                inputComponent: mask ? TextMask(mask) : valueType === "numbers" ? TextMaskCustom(valueType) : valueType === "digits" ? TextMaskCustom(valueType) : undefined,
                inputProps: inputProps,
                classes: {
                    root: (isRequired && suffix !== undefined) &&  classes.inputRequiredSuffix,
                    input: isRequired && other.multiline !== true ? classes.inputRequired : classes.input,
                    multiline: isRequired ? classes.inputMultilineRequired : classes.inputMultiline,
                    disabled: classes.disabled,
                },
                readOnly: other.readOnly && true,
                endAdornment: suffix !== undefined  ? <InputAdornment position="end">{suffix}</InputAdornment> : null,
            }}
            rows={other.multiline && other.rows}
            rowsMax={other.multiline && other.rowsMax}
            {...other}
        />
    )
}

FormTextField.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
	mask: PropTypes.array,
    inputProps: PropTypes.object,
    valueType: PropTypes.oneOf(['numbers', 'digits']),
};

export default withStyles(stylesFormTextField)(FormTextField)