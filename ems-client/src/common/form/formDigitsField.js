import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles }  from '@material-ui/core/';
import {RenderDigitsField} from 'common/form';
import {TextMaskCustom} from 'utils/';

const stylesFormDigitsField = theme => ({
    inputLabel: {
        transform: `translate(14px, 14px) scale(1)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
    inputMultiline:{
        padding: theme.spacing(0),
    },
    inputRequired: {
        padding: theme.spacing(1.5),
        backgroundColor: '#faffbd',
    },
    disabled: {
        color: '#757575',
    }
});

function FormDigitsField(props) {
    const { classes, name, label, isRequired, inputProps, ...other } = props;
    return(
        <Field
            name={name}
            component={RenderDigitsField}
            label={label}
            InputLabelProps={{
                classes: {outlined: classes.inputLabel}
            }}
            InputProps={{
                inputProps: inputProps,
                classes: {
                    inputComponent: TextMaskCustom("numbers"),
                    input: isRequired ? classes.inputRequired : classes.input,
                    classes: {input: classes.input},
                    disabled: classes.disabled,
                },
                readOnly: other.readOnly && true,
            }}
            {...other}
        />
    )
}

FormDigitsField.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
	inputProps: PropTypes.object,
};

export default withStyles(stylesFormDigitsField)(FormDigitsField)
