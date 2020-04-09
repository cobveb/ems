import React  from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles}  from '@material-ui/core/';
import {renderPasswordField} from 'common/form';

const stylesFormPasswordField = theme => ({
    inputLabel:{
        transform: `translate(14px, 14px) scale(1)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
});

class FormPasswordField extends React.Component {
    state = {
        showPassword: false,
    }

    handleClickShowPassword = () => {
		this.setState(state => ({ showPassword: !state.showPassword }));
	};

    render(){
        const { classes, name, label, isRequired, inputProps, ...other } = this.props;
        const {showPassword} = this.state;
        return(
            <Field
                name={name}
                component={renderPasswordField}
                showPassword={showPassword}
                label={label}
                InputLabelProps={{
                    classes: {outlined: classes.inputLabel}
                }}
                InputProps={{
                    inputProps: inputProps,
                    classes: {input: classes.input}
                }}
                onClick={this.handleClickShowPassword}
                {...other}
            />
        )
    }
}

FormPasswordField.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
	showPassword: PropTypes.bool,
    inputProps: PropTypes.object,
};

export default withStyles(stylesFormPasswordField)(FormPasswordField)