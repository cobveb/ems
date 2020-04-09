import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, SnackbarContent, IconButton, Typography  } from '@material-ui/core/';
import { amber, green } from '@material-ui/core/colors/';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const styles = theme => ({
	success: {
		backgroundColor: green[600],
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
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
	    marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
	    alignItems: 'center',
	},
});

function NotificationContent(props) {
	const { classes, className, message, onClose, variant, ...other } = props;
	const Icon = variantIcon[variant];
	
	return (
	    <>
		<SnackbarContent
			className={classNames(classes[variant], className)}
			aria-describedby={"notification-" + variant}
			message={
				<span id={"notification-" + variant} className={classes.message}>
		    		<Icon className={classNames(classes.icon, classes.iconVariant)} />
		    		<Typography align="center" variant="body2" color="inherit">
                        {message}
                    </Typography>
		    	</span>
			}
			action={[
				<IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
	        		<CloseIcon className={classes.icon} />
	        	</IconButton>,
	        ]}
			{...other}
		/>
		</>
	)
}


NotificationContent.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

export default withStyles(styles)(NotificationContent);