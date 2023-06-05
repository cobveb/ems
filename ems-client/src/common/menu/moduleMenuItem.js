import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core/';

const styles = theme => ({
    listItemText: {
        fontSize: theme.spacing(1.9),
    },
    listIcon:{
        minWidth: theme.spacing(4),
    }
})

class ModuleMenuItem extends Component {
    render(){
        const {classes, item, open } = this.props;
        return(
            <Tooltip title={open ? "" : item.name}>
                <ListItem component={Link} to={item.path} button key={item.code} >
                    <ListItemIcon className={classes.listIcon}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} classes={{primary  : classes.listItemText}} />
                </ListItem>
            </Tooltip>
        )
    }
};

ModuleMenuItem.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModuleMenuItem);