import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import LoginScreen from 'components/login/loginScreen';
import Modules from 'components/modules/modules/modules';
import Logout from 'components/logout/logout';
import PrivateRoute from 'common/privateRoute';

/**
 * The main application component containing the main routing definition
 *
 * @version 1.0.1
 * @author [Grzegorz Viola]
*/

class Ems extends Component {
		
	render(){
		return(
			<>
				<Switch>
					<Route exact path='/' component={LoginScreen}/>
					<PrivateRoute path='/modules' component={Modules}/>
					<PrivateRoute path='/logout' component={Logout}/>
				</Switch>
			</>
		)
	}
}

export default Ems;
