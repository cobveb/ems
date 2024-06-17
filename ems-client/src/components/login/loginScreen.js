import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {AppBar, Toolbar, Typography, Avatar, Paper, Grid, withStyles } from '@material-ui/core/';
import LockIcon from '@material-ui/icons/Lock';
import LoginFormContainer from 'containers/login/loginFormContainer';
import * as constants from 'constants/uiNames';

const styles = theme => ({
	root: {
	    flexGrow : 1,
	    height : "100vh",

	},
	paper: {
		padding: 0,
	    height: '100%',
	    maxWidth: 500,
	},
	avatar: {
	    margin: 10,
	    color: '#2196f3',
	    backgroundColor: '#fff',
	},
});

class LoginScreen extends Component {
    state = {
        title: constants.LOGIN_SCREEN_TITLE,
    }

    handleChangeTitle = (newTitle) =>{
        this.setState({
            title: newTitle,
        })
    }
		
	render(){
		const { classes } = this.props;
		return(
		    <>
                <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.root}>
                    <Grid item xs={12} sm={4}>
                        <Paper className={classes.paper}>
                            <AppBar position="static">
                                <Toolbar>
                                    <Avatar className={classes.avatar}>
                                        <LockIcon />
                                    </Avatar>
                                    <Typography variant="h6" color="inherit">
                                        { this.state.title }
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                            <LoginFormContainer
                                changeTitle = {this.handleChangeTitle}
                            />
                        </Paper>
                    </Grid>
                </Grid>
		    </>
		)
	}
}

LoginScreen.propTypes = {
		classes: PropTypes.object.isRequired,
};

LoginScreen.defaultProps = {
	header : constants.LOGIN_SCREEN_TITLE
}
export default withStyles(styles)(LoginScreen);