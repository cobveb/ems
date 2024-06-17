import React from 'react';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import format from "date-fns/format";
import { pl } from 'date-fns/locale';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { withStyles } from '@material-ui/core/';
import {blue} from "@material-ui/core/colors/";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";
import * as constants from 'constants/uiNames';


const datePicker = theme => ({
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

const customDialogTheme = createTheme({
    palette: {
        primary: {
            main: blue[700],
        },
    },
    overrides: {
        MuiButton: {
            label: {textTransform: 'capitalize',},
        },
    },
});

function DatePicker(props) {
    const [selectedDate, setSelectedDate] = React.useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    class LocalizedUtils extends DateFnsUtils {
        getCalendarHeaderText(date) {
            return  format(date, "LLLL yyyy", { locale: this.locale });
        }
    }

    const { classes, label, onChange, ...custom } = props;

    return (
        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={pl}>
            <ThemeProvider theme={customDialogTheme}>
                <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    disableToolbar
                    fullWidth
                    inputVariant="outlined"
                    format="dd-MM-yyyy"
                    classes={{root: classes.field}}
                    id={custom.id ? custom.id : "date-picker-inline"}
                    label={label}
                    InputLabelProps={{
                        classes: {outlined: classes.inputLabel}
                    }}
                    value={selectedDate}
                    onChange={value => {
                        handleDateChange(value);
                        onChange(value);
                    }}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    InputProps={{
                        classes: {input: classes.input},
                    }}
                    mask = "__-__-____"
                    invalidDateMessage = {constants.DATE_PICKER_INVALID_DATE_MESSAGE}
                    maxDateMessage = {constants.DATE_PICKER_MAX_DATE_MESSAGE}
                    minDateMessage = {constants.DATE_PICKER_MIN_DATE_MESSAGE}
                    {...custom}
                />
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    );
}

DatePicker.propTypes = {
	classes: PropTypes.object.isRequired,
	label: PropTypes.string,
	onChange: PropTypes.func,
};

export default withStyles(datePicker)(DatePicker)