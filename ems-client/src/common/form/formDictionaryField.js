import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles }  from '@material-ui/core/';
import {RenderDictionaryField} from 'common/form';
import * as constants from 'constants/uiNames';


const stylesFormDictionaryField = theme => ({
    inputLabel:{
        transform: `translate(14px, 14px) scale(1)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
    inputRequired: {
        backgroundColor: '#faffbd',
    },
});

const isValid = (value) => value && value.code === 'err' ? constants.FORM_ERROR_MSG_INVALID_VALUE : undefined;
const required = (value) => value && value.code === '' ? constants.FORM_ERROR_MSG_REQUIRED_FIELD : undefined;

class FormDictionaryField extends Component{

    render(){
    const { classes, name, label, isRequired, dictionaryName, inputProps, ...other } = this.props;
    return(
        <Field
            name={name}
            dictionaryName={dictionaryName}
            component={RenderDictionaryField}
            label={label}
            placeholder={label}
            classes={{isRequired: isRequired && classes.inputRequired, label:classes.inputLabel }}
            inputProps={{
                classes: {
                    input: classes.input,
                }
            }}
            validate={isRequired ? [isValid, required] : isValid}
            isRequired={isRequired}
            {...other}
        />
    );
    };
}

FormDictionaryField.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	dictionaryName: PropTypes.string,
	isRequired: PropTypes.bool,
    inputProps: PropTypes.object,
};

export default withStyles(stylesFormDictionaryField)(FormDictionaryField)