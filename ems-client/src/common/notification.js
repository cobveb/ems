import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core/';
import NotificationContent from 'common/notificationContent';

class Notification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
		};
	}
	
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
	    }
		this.setState({ open: false });

		if(this.props.onClose){
            this.props.onClose();
        };
	};
	
	render() {
		const { message, variant } = this.props;
		return (
			<>
				<Snackbar
				    anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={this.state.open}
					autoHideDuration={4000}
					onClose={this.handleClose}
				>
					<NotificationContent
						onClose={this.handleClose}
						variant={variant}
						message={message}
					/>
				</Snackbar>
			</>
		)
	}
}

Notification.propTypes = {
	message: PropTypes.string.isRequired,
	variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    onClose: PropTypes.func
};

export default Notification;