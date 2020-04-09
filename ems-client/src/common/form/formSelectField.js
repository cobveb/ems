import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles, MenuItem }  from '@material-ui/core/';
import {RenderSelectField} from 'common/form';

const stylesFormSelectField = theme => ({
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

class FormSelectField extends Component {
    state = {
        value: "",
        labelWidth: '',
    }

    renderOptions = () => {
        return(

            this.props.options.map((item, i) => {
                return (
                    <MenuItem
                        value={item.code}
                        key={i}
                        name={item.code}
                    >
                        {item.code === "" ? <em>{item.name}</em>  :  item.name}
                    </MenuItem>
                );
            })
        )
    };

    handleChange = (event) => {
        this.setState(state => ({ value: event.target.value }));
    };

    render(){
        const {classes, name, label, isRequired, inputProps, ...other} = this.props;
        const {value, labelWidth} = this.state;
        return(
            <Field
                name={name}
                label={label}
                value={value}
                inputLabel={label}
                labelWidth={labelWidth}
                component={RenderSelectField}
                onChange={this.handleChange}
                classes={{isRequired: isRequired && classes.inputRequired, label:classes.inputLabel }}
                inputProps={{
                    classes: {
                        input: classes.input,
                    }
                }}
                {...other}
            >
                {this.renderOptions()}
            </Field>
        )
    }
}

FormSelectField.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
    inputProps: PropTypes.object,
};
export default withStyles(stylesFormSelectField)(FormSelectField)