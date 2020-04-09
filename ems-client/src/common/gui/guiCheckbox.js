import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Checkbox, FormControlLabel }  from '@material-ui/core/';
import { green } from '@material-ui/core/colors/';

const GreenCheckbox = withStyles({
    root: {
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

function ContainedCheckbox(props){
    const { label, labelPlacement, checked, id,  onChange, ...other } = props;
    return(
        <FormControlLabel
            control={
                <GreenCheckbox
                    label={label}
                    checked={checked}
                    onChange={onChange}
                    id={id}
                    {...other}
                />
            }
            label={label}
            labelPlacement={labelPlacement}
        />
    )
}

ContainedCheckbox.propTypes = {
	label: PropTypes.string,
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func,
	labelPlacement: PropTypes.oneOf(['top', 'start', 'bottom', 'end'])
};

export default ContainedCheckbox;