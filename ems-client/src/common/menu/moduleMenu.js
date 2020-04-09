import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Typography, List, Icon  } from '@material-ui/core/';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ModuleMenuItem from 'common/menu/moduleMenuItem';


const styles = theme => ({
    expansionPanelClose:{
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    expansionPanelOpen: {
       whiteSpace: 'nowrap',
    },
    subheaderIcon:  {
        marginRight: theme.spacing(3),
        padding: 0,
    },
    list:{
        width: '100%',
        maxWidth: '100%'
    },
})

const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0,0,0,.125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 0,
        },
    },
    expanded: {
        margin: 0,
    },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0,0,0,.03)',
        borderBottom: '1px solid rgba(0,0,0,.125)',
        marginBottom: -1,
        paddingLeft: 16,
        minHeight: 48,
        '&$expanded': {
            minHeight: 48,
        },
        margin: 0,
    },
    content: {
        '&$expanded': {
            margin: 0,
        },
    },
    expanded: {
        margin: 0,
    },
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: 0,
        margin: 0,
    },
}))(MuiExpansionPanelDetails);


class ModuleMenu extends Component {
    state = {
        expanded: this.props.defaultExpanded || false,
    };

    handleChange = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    render(){
        const {classes, name, menuItems, icon, open} = this.props;
        const { expanded }= this.state;
        return(
            <ExpansionPanel
                square
                expanded={expanded}
                onChange={this.handleChange}
            >
                <ExpansionPanelSummary
                    classes={{
                        content: classNames(classes.expansionPanelClose),
                    }}
                >
                    <Icon className={classes.subheaderIcon}>{icon}</Icon>
                    <Typography>{name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <List className={classes.list}>
                        {menuItems.map((item, index) => (
                            <ModuleMenuItem
                                item={item}
                                key={index}
                                open={open}
                            />
                        ))}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

ModuleMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    menuItems: PropTypes.array.isRequired,
    defaultExpanded: PropTypes.bool,
};

export default withStyles(styles)(ModuleMenu);