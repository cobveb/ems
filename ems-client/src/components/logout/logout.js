import React, { Component } from "react";
import { Redirect, Switch } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { logout } from 'actions/authAction';
import { connect } from "react-redux";

/**
 * Component responsible for logging out the user,
 * changing the state of the authorization applications,
 * and redirecting the user to the login page
 *
 * @version 1.0.2
 * @author [Grzegorz Viola]
*/

export class Logout extends Component{

    componentDidMount(){
        this.props.logout();
    }

    render(){
        return ( <Switch><Redirect to="/" /></Switch> )
    }
}

function mapDispatchToProps (dispatch) {
    return {
        logout: bindActionCreators(logout, dispatch),
    }
};

export default connect(null, mapDispatchToProps)(Logout);