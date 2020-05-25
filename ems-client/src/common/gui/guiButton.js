import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, CircularProgress} from '@material-ui/core';
import PropTypes from 'prop-types';
import {green, amber, red, blue, grey} from '@material-ui/core/colors/';

const useStyles = makeStyles(theme => ({
    button: {
        marginRight: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5),
        marginTop: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    add: {
        backgroundColor: green[500],
        '&:hover': {
             backgroundColor: green[800],
        },
    },
    edit: {
        backgroundColor: amber[500],
        '&:hover': {
             backgroundColor: amber[800],
        },
    },
    delete: {
        backgroundColor: red[500],
        '&:hover': {
             backgroundColor: red[800],
        },
    },
    submit: {
        backgroundColor: blue[500],
        '&:hover': {
             backgroundColor: blue[700],
        },
    },
    cancel: {
        backgroundColor: grey[500],
        '&:hover': {
             backgroundColor: grey[700],
        },
    },
    buttonLabel: {
        textTransform: 'capitalize',
    },
    buttonProgress: {
	    color: blue[500],
	    position: 'absolute',
	    top: '50%',
	    left: '50%',
	    marginTop: -12,
	    marginLeft: -12,
	},
}));



function ContainedButton(props){
    const classes = useStyles();
    const { label, icon, iconAlign, onClick, variant, isLoading, ...other } = props;
    return(
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            classes={{root: classes[variant], label: classes.buttonLabel}}
            size="medium"
            onClick = {onClick}
            {...other}
        >
            {iconAlign === "left" && icon}
            {label}
            {iconAlign === "right" && icon}
            {isLoading && <CircularProgress  size={26} className={classes.buttonProgress} />}
        </Button>
    )
}

ContainedButton.propTypes = {
	label: PropTypes.string.isRequired,
	variant: PropTypes.oneOf(['add', 'edit', 'delete', 'submit', 'cancel', 'preview']).isRequired,
	icon: PropTypes.element,
	iconAlign: PropTypes.oneOf(['left', 'right']),
	onClick: PropTypes.func,
	isLoading: PropTypes.bool,
};

export default ContainedButton;