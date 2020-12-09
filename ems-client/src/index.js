import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import configureStore from "store/configureStore";
import './index.css';
import Ems from 'app/ems';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { BrowserRouter as Router } from 'react-router-dom';
import {setStore} from 'utils/apiUtils';
import 'fontsource-roboto';

const theme = createMuiTheme({
	palette: {
		primary: blue,
	},
	typography: {
		useNextVariants: true,
	},
	overrides: {
		MuiButton: { // Name of the component ⚛️ / style sheet
			root: { // Name of the rule
				color: 'white', // Some CSS
				background: '#2196F3',
			}
		},
	},
	
});

const store = configureStore();

// Set reference to application store to apiUtils interceptor JWT Tokens
setStore(store);

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<Provider store={store}>
				<Router>
					<Ems />
				</Router>
			</Provider>
		</MuiThemeProvider>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
