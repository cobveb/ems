import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@material-ui/core/';
import {Error, Info, Warning, Help } from '@material-ui/icons/';
import { amber, grey } from '@material-ui/core/colors/';
import * as constants from 'constants/uiNames';
import { InfoAction, DialogAction } from 'common/modalDialogAction';

const variantTitle = {
	confirm: constants.MODAL_DIALOG_CONFIRM,
	warning: constants.MODAL_DIALOG_WARNING,
	error: constants.MODAL_DIALOG_ERROR,
	info: constants.MODAL_DIALOG_INFORMATION,
};

const variantIcon = {
	confirm: Help,
	warning: Warning,
	error: Error,
	info: Info,
};

const styles = theme => ({
	confirm: {
		backgroundColor: grey[500],
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
	iconVariant: {
	    marginRight: theme.spacing(1),
	    fontSize: theme.spacing(4.5),
	    color: '#fff',
	},
	message: {
		display: 'flex',
	    alignItems: 'center',
	},
    label: {
        textTransform: 'capitalize',
        color: '#fff',
    },
    title: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(1),
        '& h6': {
            color: '#fff',
            margin: 0,
            padding: 0,
        }
    },
    action: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(1),
    },
    content: {
        margin: `${theme.spacing(0.5)}px ${theme.spacing(0)}px`,
        padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
        height: theme.spacing(20),
        overflow: 'auto',
    },
    newLine: {
        whiteSpace: 'pre-line',
    }
});



class modalDialog extends Component {
    state = {
        open: true,
    };

    handleClose = () => {
        if(this.props.onClose){
            this.props.onClose();
        };
        this.setState({ open: false });
    };

    handleConfirm = () => {
        if(this.props.onConfirm){
            this.props.onConfirm();
        }
        this.setState({ open: false });
    };
    render() {
        const { classes, message, variant } = this.props;
        const Icon = variantIcon[variant];
        const title = variantTitle[variant];
        return (
            <>
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby={"dialog-" + variant}
                    open={this.state.open}
                    fullWidth={true}
                    maxWidth={'sm'}
                    disableBackdropClick={true}
                >
                    <DialogTitle
                        id={"dialog-" + variant}
                        onClose={this.handleClose}
                        className={classNames(classes[variant])}
                        classes={{root: classes.title}}
                    >
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          alignItems="center"
                        >
                            <Icon className={classes.iconVariant}/>
                            <Typography variant="h6">
                                {title}
                            </Typography>
                        </Grid>
                    </DialogTitle>
                    <DialogContent classes={{root: classes.content}}>
                        <Typography align="justify" variant="body1" color="inherit" className={classes.newLine}>
                            {message}
                        </Typography>
                    </DialogContent>
                    <DialogActions classes={{root: classes.action}}>
                        {{
                            error: <InfoAction type={variant} onClose={this.handleClose} />,
                            info: <InfoAction type={variant} onClose={this.handleClose} />,
                            warning: <DialogAction type={variant} onConfirm={this.handleConfirm} onCancel={this.handleClose}/>,
                            confirm: <DialogAction type={variant} onConfirm={this.handleConfirm} onCancel={this.handleClose}/>,
                        }[variant]}
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

modalDialog.propTypes = {
	message: PropTypes.string.isRequired,
	variant: PropTypes.oneOf(['confirm', 'warning', 'error', 'info']).isRequired,
	onConfirm: PropTypes.func,
	onClose: PropTypes.func,
};

export default withStyles(styles)(modalDialog);