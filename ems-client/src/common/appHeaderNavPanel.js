import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles, IconButton, Toolbar, Tooltip } from '@material-ui/core/';
import { Link } from 'react-router-dom';
import { Home } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';


const styles = theme => ({
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

class AppHeaderNavPanel extends Component {
    render(){

        const { classes } = this.props;

        return(
            <>
                <Toolbar className={classes.toolbar}>
                    <Tooltip title={constants.APP_HEADER_HOME_BUTTON}>
                        <IconButton
                            color="inherit"
                            className={classes.button}
                            component={Link}
                            to='/modules'
                        >
                            <Home />
                        </IconButton>
                	</Tooltip>
                </Toolbar>
            </>
        )
    }
}

AppHeaderNavPanel.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (AppHeaderNavPanel);