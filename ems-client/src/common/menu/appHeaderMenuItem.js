import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core/';

const styles = theme => ({
	menuItem: {
		'&:focus': {
			backgroundColor: theme.palette.primary.main,
			'& $primary, & $icon': {
				color: theme.palette.common.white,
			},
	    },
	    padding : theme.spacing(0.7),
	},
	primary: {
		fontSize: theme.spacing(1.7),
	},
	icon: {
		fontSize: theme.spacing(0.5),
		marginRight: theme.spacing(0),
	},
	link : {
	    textDecoration: 'none',
	    display: 'block',
	},
	logout: {
	    '&:focus, &:hover': {
            backgroundColor: theme.palette.secondary.main,
        	    '& $primary, & $icon': {
        		    color: theme.palette.common.white,
        		},
        	},
        padding : theme.spacing(0.7),
	}
});

function AppHeaderMenuItem(props){

	const { classes, code, name, icon, path, onClick} = props;
//	console.log(onClick)
	return(
		<>
		    <Link to={path} className={classes.link}>
			    <MenuItem data-testid="menu-item" onClick={onClick} className={code==='logout' ? classes.logout : classes.menuItem} >
		    	    <ListItemIcon className={classes.icon}>
		        	    {icon}
		            </ListItemIcon>
		            <ListItemText classes={{ primary: classes.primary }} primary={name} />
		        </MenuItem>
		    </Link>
		</>
	);
}

AppHeaderMenuItem.propTypes = {
	classes: PropTypes.object.isRequired,
	code: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	icon: PropTypes.node.isRequired,
	path: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
	
export default withStyles(styles)(AppHeaderMenuItem);