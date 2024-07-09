import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Select, OutlinedInput, InputLabel, FormControl, MenuItem }  from '@material-ui/core/';

const selectField = theme => ({
    field: {
        marginTop: theme.spacing(0.8),
    },
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

function SelectField(props){
    const { classes, value, label, onChange, children, ...custom } = props;
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    function renderOptions(options) {
        return(
            options.map((item, i) => {
                return (
                    <MenuItem
                        value={item.code}
                        key={i}
                        name={item.code}
                    >
                        {item.code === "" ? <em>{item.name}</em> : item.name}
                    </MenuItem>
                );
            })
        )
    }

    return(
        <FormControl variant="outlined" className={classes.field} fullWidth={true} disabled={custom.disabled}>
            <InputLabel ref={inputLabel} htmlFor="selectField"  className={classes.inputLabel}>
                {label}
            </InputLabel>
            <Select
                value={value}
                onChange={onChange}
                labelWidth={labelWidth}
                input={<OutlinedInput labelWidth={labelWidth} name={custom.name} id={custom.name} classes={{ input: classes.input}}/>}
                inputProps={{
                    id: 'selectField',
                    classes: {outlined: classes.input}
                }}
                >
                    {renderOptions(custom.options)}
            </Select>
        </FormControl>
    )
}

SelectField.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(selectField)(SelectField)