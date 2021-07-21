import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormControlLabel  }  from '@material-ui/core/';
import {renderCheckbox} from 'common/form';


function FormCheckbox(props) {
    const { name, disabled, label, labelPlacement, ...other } = props;
    return(
        <FormControlLabel
            control={
                <Field
                    name={name}
                    component={renderCheckbox}
                    label={label}
                    disabled={disabled}
                    {...other}
                />
            }
            label={label}
            labelPlacement={labelPlacement}
        />
    )
}

FormCheckbox.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	labelPlacement: PropTypes.oneOf(['top', 'start', 'bottom', 'end'])
};

FormCheckbox.defaultProps = {
  labelPlacement: 'start'
};

export default (FormCheckbox)