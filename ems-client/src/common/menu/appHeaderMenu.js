import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles, Button, Popper, Paper, ClickAwayListener, MenuList, Grow} from '@material-ui/core/';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LogoutIco from '@material-ui/icons/ExitToApp';
import AppHeaderMenuItem from 'common/menu/appHeaderMenuItem';
import Username from 'common/username';
import * as constants from 'constants/uiNames';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		marginRight: theme.spacing(0),
	},
	label: {
        textTransform: 'capitalize',
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    button: {
        marginRight: theme.spacing(3),
    },
    menu: {
        zIndex: 1500,
    },
});

class AppHeaderMenu extends Component {
	
	state = {
		open: false,
	};
	
	handleMenu = () => {
		this.setState(state => ({ open: !state.open }));
	};
	
	handleClose = (event) => {
//	    console.log(this.anchorEl.)
	    if (this.anchorEl.contains(event.target)) {
	        console.log("in anchor")
              return;
        }
	    this.setState({ open: false });
	    console.log('out anchor')
	};
	
	render(){
		const { classes } = this.props;
		const { open } = this.state;
		
		return(
			<>
			    <Button
				    onClick={this.handleMenu}
					color="inherit"
					aria-owns={open ? 'menu-list-grow' : undefined}
					aria-haspopup="true"
					ref={node => {
						this.anchorEl = node;
					}}
					classes={{label: classes.label}}
					className={classes.button}
				>
					<AccountCircle className={classes.icon} />
					<Username />
				</Button>
				<Popper className={classes.menu} open={open} anchorEl={this.anchorEl} transition >
				    {({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							id="menu-list-grow"
							style={{ transformOrigin: placement === 'bottom' ? 'center bottom' : 'center bottom' }}
						>
						<Paper className={classes.paper}>
							<ClickAwayListener onClickAway={this.handleClose}>
								<MenuList>
									<AppHeaderMenuItem code="logout" onClick={this.handleClose} icon=<LogoutIco className={classes.logout} /> name={constants.HEADER_MENU_LOGOUT} path="/logout"/>
								</MenuList>
							</ClickAwayListener>
						</Paper>
						</Grow>
					)}
				</Popper>
			</>
		)
	}
}

AppHeaderMenu.propTypes = {
	classes: PropTypes.object.isRequired,
};
	
export default withStyles(styles)(AppHeaderMenu);