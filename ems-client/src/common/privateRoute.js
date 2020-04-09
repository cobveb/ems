import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";


/**
 * Component responsible for checking if the user is logged in,
 * if yes, displaying information, if not redirecting to the login page.
 *
 * @version 1.0.1
 * @author [Grzegorz Viola]
*/

const PrivateRoute = ({ component: Component,  ...rest }) => (
    <Route {...rest} render={(props) => (
            rest.auth===true ? (<Component {...rest} {...props} />) : ( <Redirect to={'/'} />)
        )}
    />
);

const mapStateToProps = (state) => {
	return {
		auth: state.auth.authenticated,
	}
};

export default connect(mapStateToProps)(PrivateRoute)