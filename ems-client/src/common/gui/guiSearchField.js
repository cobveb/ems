import React from 'react';
import { withStyles, TextField, InputAdornment,  }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import PropTypes from 'prop-types';
import { Search } from '@material-ui/icons/';
import MaskedInput from 'react-text-mask';
import {numberMask, digitsAndNumberMask} from 'utils/';

const searchField = theme => ({
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

function TextMaskCustom(props){
    const { inputRef, valueType, ...other } = props;

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

function SearchField(props){

    const { classes, input, onChange, valueType, ...custom } = props;
    return(
        <TextField
            type="search"
            id={custom.name ? custom.name : "search"}
            label={constants.TEXTFIELD_SEARCH}
            placeholder={constants.TEXTFIELD_SEARCH}
            fullWidth
            variant="outlined"
            classes={{root: classes.field}}
            onChange={onChange}
            InputLabelProps={{
                classes: {outlined: classes.inputLabel}
            }}
            InputProps={{
                inputComponent: valueType !== "all" ? TextMaskCustom : undefined,
                classes: {input: classes.input},
                endAdornment: <InputAdornment position="end"><Search /></InputAdornment>
            }}
            {...custom}
        />
    )
};

SearchField.propTypes = {
	classes: PropTypes.object.isRequired,
	valueType: PropTypes.oneOf(['numbers', 'digits', 'all']),
};

export default withStyles(searchField)(SearchField)