import React from 'react';
import { withStyles, TextField, InputAdornment }  from '@material-ui/core/';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import {TextMask, digitsAndNumberMask} from 'utils/';

const inputField = theme => ({
    inputLabel: {
        transform: `translate(14px, 14px) scale(1)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
    inputRequired: {
        padding: theme.spacing(1.5),
        backgroundColor: '#faffbd',
    },
    inputError:{
        color: '#8B0000',
    },
    inputSuccess:{
        color: '#009900',
    },
    disabled: {
        color: '#757575',
    }
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

    const { classes, label, mask, valueType, onChange, isRequired, isError, isSuccess, postfix, ...custom } = props;
    return(
        <TextField
            id="textField"
            fullWidth
            variant="outlined"
            classes={{root: classes.field}}
            label={label}
            placeholder={label}
            onChange={onChange}
            InputLabelProps={{
                classes: {outlined: classes.inputLabel}
            }}
            InputProps={{
                inputComponent: mask ? TextMask(mask) : valueType === "numbers" ? TextMaskCustom(valueType) : valueType === "digits" ? TextMaskCustom(valueType) : undefined,
                classes: {
                    input: isRequired ? classes.inputRequired : classes.input,
                    disabled: isError ? classes.inputError :  isSuccess ? classes.inputSuccess : classes.disabled,
                },
                endAdornment: postfix && <InputAdornment position="end">{postfix}</InputAdornment>,
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