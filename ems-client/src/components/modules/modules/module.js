import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button  } from '@material-ui/core/';
import {purple, green, amber, teal, cyan} from '@material-ui/core/colors/';
import { Settings, DescriptionOutlined, AccountBalanceOutlined, HowToReg, People } from '@material-ui/icons/';

const variantIcon = {
    hr: People,
    accountant: AccountBalanceOutlined,
    coordinator: HowToReg,
    applicant: DescriptionOutlined,
    administrator: Settings,
};

const styles = theme => ({
    module: {
        margin: theme.spacing(4),
        height: theme.spacing(20),
        width: theme.spacing(20),
    },
    label: {
        flexDirection: 'column',
        textTransform: 'capitalize',
        fontSize: theme.spacing(2),
    },
    accountant: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[800]
        },
    },
    coordinator: {
        backgroundColor: amber[500],
        '&:hover': {
            backgroundColor: amber[800],
        },
    },
    administrator: {
        backgroundColor: purple[500],
        '&:hover': {
            backgroundColor: purple[800],
        },
    },
    applicant: {
        backgroundColor: teal[500],
        '&:hover': {
            backgroundColor: teal[800],
        },
    },
    hr: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[800],
        },
    },
    icon: {
        fontSize: theme.spacing(8),
        marginBottom: theme.spacing(1),
    },
})
class Module extends Component {

    handleClick = () => {
        this.props.updateHeader(this.props.name)
    }

    render(){

        const { classes, name, code } = this.props;

        const variant = classes[code]
        const Icon = variantIcon[code];

        return(
            <>
                <Button
                    variant="contained"
                    color="primary"
                    className={classNames(classes.module, `${variant}`)}
                    classes={{label: classes.label}}
                    component={Link}
                    to={`/modules/${code}`}
                    onClick = {this.handleClick}
                >
                    <Icon className={classNames(classes.icon)}/>
                    {name}
                </Button>
            </>
        )
    }
}

Module.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	code: PropTypes.string.isRequired,
};

export default withStyles(styles)(Module);