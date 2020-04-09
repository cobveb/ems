import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, loadAccessTokens as auth, loadUserDetails, loadModules, setError } from 'actions/';
import LoginForm from 'components/login/form/loginForm';
import { Redirect } from 'react-router';

class LoginFormContainer extends Component {
    state = {
        redirect: false,
    }

    handleResetPassword = () => {
        this.setState({
            redirect: true,
        })
	}

    render(){
        const {redirect} = this.state;

        if(redirect === true){
            return <Redirect to="/modules/administrator" />
        } else {
            return(
                <LoginForm
                    isLoading={this.props.isLoading}
                    onToggleLoading={this.props.loading}
                    onAuth={this.props.actions}
                    loadUserDetail={this.props.loadUser}
                    loadModules={this.props.loadModules}
                    clearError={this.props.clearError}
                    changeTitle={this.props.changeTitle}
                    error={this.props.error}
                    resetPassword={this.handleResetPassword}
                />
            )
        }
    }
}

LoginFormContainer.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	loading: PropTypes.func.isRequired,
	actions: PropTypes.func.isRequired,
	loadUser: PropTypes.func.isRequired,
    loadModules: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        actions: bindActionCreators(auth, dispatch),
        loadUser: bindActionCreators(loadUserDetails, dispatch),
        loadModules: bindActionCreators(loadModules, dispatch),
        clearError: bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormContainer);