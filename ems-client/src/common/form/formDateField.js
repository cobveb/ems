import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles }  from '@material-ui/core/';
import {renderDateField} from 'common/form';
import * as constants from 'constants/uiNames';

const styles = theme => ({
    field: {
        marginTop: theme.spacing(0.8),
    },
    inputLabel: {
        transform: `translate(14px, 14px) scale(1)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
});



function FormDateField(props){
    const { classes, name, label, inputProps, ...others } = props;

    return(
        <Field
            name={name}
            component={renderDateField}
            label={label}
            placeholder={label}
            invalidDateMessage = {constants.DATE_PICKER_INVALID_DATE_MESSAGE}
            maxDateMessage = {constants.DATE_PICKER_MAX_DATE_MESSAGE}
            minDateMessage = {constants.DATE_PICKER_MIN_DATE_MESSAGE}
            InputProps={{
                classes: {input: classes.input},
            }}
            InputLabelProps={{
                classes: {outlined: classes.inputLabel}
            }}
            {...others}
        />
    );
}
FormDateField.propTypes = {
	classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(FormDateField)