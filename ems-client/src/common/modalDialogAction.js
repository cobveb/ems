import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button } from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { amber, grey } from '@material-ui/core/colors/';

const styles = theme => ({
    label: {
        textTransform: 'capitalize',
        color: '#fff',
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
		backgroundColor: theme.palette.primary.dark,
	},
	warning: {
		backgroundColor: amber[700],
	},
    confirm: {
		backgroundColor: grey[500],
	},
	button: {
	    marginLeft: theme.spacing(0.8),
	}
});
function ModalDialogActionInfo(props) {
    const { classes, onClose, type } = props;

    return(
        <>
            <Button
                variant="contained"
                onClick={onClose}
                className={classNames(classes[type])}
                classes={{label: classes.label}}
                size="small"
            >
                {type === "error" ? constants.BUTTON_CLOSE : constants.BUTTON_OK}
            </Button>
        </>
    )
}

ModalDialogActionInfo.propTypes = {
	type: PropTypes.oneOf(['confirm', 'warning', 'error', 'info']).isRequired,
	onClose: PropTypes.func.isRequired,
};

const InfoAction = withStyles(styles)(ModalDialogActionInfo);

function ModalDialogActionDialog(props) {
    const { classes, onConfirm, onCancel, type} = props;

    return(
        <>
            <Button
                variant="contained"
                onClick={onConfirm}
                className={classNames(classes[type])}
                classes={{root: classes.button, label: classes.label}}
                size="small"
            >
                {constants.BUTTON_YES}
            </Button>
            <Button
                variant="contained"
                onClick={onCancel}
                className={classes.error}
                classes={{root: classes.button, label: classes.label}}
                size="small"
            >
                {constants.BUTTON_NO}
            </Button>
        </>
    )
}

ModalDialogActionDialog.propTypes = {
	type: PropTypes.oneOf(['confirm', 'warning', 'error', 'info']).isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};
const DialogAction = withStyles(styles)(ModalDialogActionDialog);


export {InfoAction, DialogAction }