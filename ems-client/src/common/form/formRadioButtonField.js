import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles, Radio, FormControlLabel }  from '@material-ui/core/';
import {RenderRadioButtonField} from 'common/form';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
    root: {
        marginLeft: theme.spacing(1),
        label: {
                fontWeight: "bold",
            },
    },
});

const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

class FormRadioButtonField extends Component{

    renderOptions = () => {
        return(

            this.props.options.map((item, i) => {
                return (
                    <FormControlLabel  value={item.code} control={<GreenRadio />} key={i} name={item.code} label={item.name} />
                );
            })
        )
    };

    render(){
        const {classes, name, label, isRequired, ...other} = this.props;
        return(
            <Field
                name={name}
                label={label}
                component={RenderRadioButtonField}
                classes={classes}
                {...other}
            >
                {this.renderOptions()}
            </Field>
        )
    }

}

FormRadioButtonField.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
    options: PropTypes.array.isRequired,
};

export default withStyles(styles)(FormRadioButtonField)
