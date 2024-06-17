import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withStyles, AppBar, Typography, Grid } from '@material-ui/core/';
import AppHeaderMenu from 'common/menu/appHeaderMenu';
import AppHeaderNavPanel from 'common/appHeaderNavPanel';


const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	appBar:{
	    height: theme.spacing(6),
	},
	grid:{
	    height: '100%',
	},
	button: {
        marginRight: theme.spacing(2),
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    toolbar:{
        minHeight: theme.spacing(6),
    }
});

class AppHeader extends Component {

	render(){
		const { classes, title} = this.props;
		 
		return (
			<>
				<div className={classes.root}>
					<AppBar position="static" className={classes.appBar}>
						<Grid className={classes.grid} container spacing={0} direction="row" justifyContent="flex-start" alignItems="center">
							<Grid item xs={3}>
                                <AppHeaderNavPanel />
							</Grid>
							<Grid item xs={6} container direction="row" justifyContent="center" alignItems="center">
							    <Typography align="center" variant="h6" color="inherit">
								    {title}
								</Typography>
							</Grid>
							<Grid item xs={3} container direction="row" justifyContent="flex-end" alignItems="center">
								<AppHeaderMenu />
							</Grid>
						</Grid>
					</AppBar>
				</div>
			</>
		)
	}
}

AppHeader.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
	return {
		title: state.ui.header.name,
	}
};
	
export default withStyles(styles) (connect(mapStateToProps)(AppHeader));