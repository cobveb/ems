import React, { Component } from 'react';
import { withStyles, Grid, TextField, FormControl, IconButton, Input, InputLabel, InputAdornment, } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { Button } from 'common/gui';
import { Visibility, LockOpenOutlined, VisibilityOff }from '@material-ui/icons/';
import { withRouter } from 'react-router-dom';
import Notification from 'common/notification';
import ChangePasswordFormContainer from 'containers/login/changePasswordFormContainer';
import * as constants from 'constants/uiNames';
import AuthApi from 'api/authApi';

const styles = theme => ({
	root: {
		padding: theme.spacing(3),
	},
	formControl: {
		marginBottom: theme.spacing(3),
	},
});

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			showPassword: false,
			msgError:"",
			resetPassword: {
			    username: "",
			}
		};
	}
	
	handleChange = prop => event => {
	    this.setState({ [prop]: event.target.value });
	};
	
	handleClickShowPassword = () => {
		this.setState(state => ({ showPassword: !state.showPassword }));
	};
	
	handleSubmit = (event) => {
		this.setState({
            msgError: "",
        })
        event.preventDefault()
		this.props.onToggleLoading(true);
		const { username, password } = this.state;
		const params = {
			username: username,
            password: password
		};
		this.props.onAuth(params)
        .then(() =>{
            this.props.loadUserDetail();
            this.props.loadModules()
            .then(() =>{
                this.props.history.push("/modules");
                this.props.onToggleLoading(false);
            })
        })
        .catch(error =>{
            this.props.onToggleLoading(false);
            this.setState({
                msgError: error === "errorResponse is undefined" ? constants.WRONG_CREDENTIALS : error,
                resetPassword: {...this.state.resetPassword, username: username},
            })
        })
	};

	handleCloseNotification = () =>{
	    this.props.clearError(null)
	}

	handleCancelResetPassword = () => {
	    this.props.clearError(null)
	    this.setState({
            msgError: "",
        })
	}

	handleResetPassword = (data) => {

	    return AuthApi.changePassword(data)
	    .then(response => {
	        this.setState({
                 resetPassword: data,
            })
            this.props.resetPassword();
	    })
	    .catch(error => {
            this.setState({
                 resetPassword: data,
            })
	    })
	}
	
	render(){
		const { classes, isLoading, error} = this.props;
		const { username, password, showPassword, msgError, resetPassword } = this.state;
		const isEnabled = username.length > 0 && password.length > 0;

		if(msgError === constants.CREDENTIALS_EXPIRED){
		    return(
                <ChangePasswordFormContainer
                    changeTitle={this.props.changeTitle}
                    onCancel={this.handleCancelResetPassword}
                    initialValues={resetPassword}
                    onSubmit={this.handleResetPassword}
                    msgError={error}
                    clearError={this.handleCloseNotification}
                />
		    )
		}
		return(
			<>
				{ msgError && <Notification message={msgError} onClose={this.handleCloseNotification} variant="error"/> }
				<form onSubmit={this.handleSubmit} >
					<Grid container direction="column" className={classes.root} justify="space-around" alignItems="center" >
						<FormControl fullWidth className={classes.formControl}>
							<TextField
								id="user"
								label={constants.USERNAME}
								placeholder={constants.USERNAME}
								readOnly={isLoading}
								value={username}
								onChange={this.handleChange('username')}
							/>
						</FormControl>
						<FormControl fullWidth className={classes.formControl}>
							<InputLabel htmlFor="password">{constants.PASSWORD}</InputLabel>
						  	<Input
						  		id="password"
						  		type={showPassword ? 'text' : 'password'}
						  		value={password}
						  		readOnly={isLoading}
						  		onChange={this.handleChange('password')}
						  	  	endAdornment={
						  		    <InputAdornment position="end">
						  			    <IconButton
						  			        aria-label={constants.TOGGLE_PASSWORD_VISIBILITY}
						  			        color="primary"
						  			        onClick={this.handleClickShowPassword}
						  			    >
						  			    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
						  			    </IconButton>
						  		    </InputAdornment>
						  	  	}
						  	/>
						</FormControl>
                        <Button
                            label={constants.BUTTON_LOGIN}
                            icon=<LockOpenOutlined/>
                            iconAlign="right"
                            type='submit'
                            variant="submit"
                            disabled={!isEnabled || isLoading }
                            isLoading={isLoading}
                        />
					</Grid>
				</form>
			</>
		);
	}
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
	isLoading: PropTypes.bool.isRequired,
	onAuth: PropTypes.func.isRequired,
	onToggleLoading : PropTypes.func.isRequired,
	loadUserDetail : PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(LoginForm));
