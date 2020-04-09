import React from 'react';
import { withStyles, TextField  }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import {digitsAndNumberMask} from 'utils/';

const inputField = theme => ({
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

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={digitsAndNumberMask}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

function InputField(props){

    const { classes, onChange, ...custom } = props;
    return(
        <TextField
            id="textField"
            fullWidth
            variant="outlined"
            classes={{root: classes.field}}
            onChange={onChange}
            InputLabelProps={{
                classes: {outlined: classes.inputLabel}
            }}
            InputProps={{
                inputComponent: TextMaskCustom,
                classes: {input: classes.input},
            }}
            {...custom}
        />
    )
};

InputField.propTypes = {
	classes: PropTypes.object.isRequired,
	mask: PropTypes.array,
};

export default withStyles(inputField)(InputField)