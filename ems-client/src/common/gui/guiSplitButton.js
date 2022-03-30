import React from 'react';
import { makeStyles, Button, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, ListItemText } from '@material-ui/core/';
import { ArrowDropDown } from '@material-ui/icons/';
import {green, amber, red, grey} from '@material-ui/core/colors/';

const useStyles = makeStyles(theme => ({
    button: {
        marginRight: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5),
        marginTop: theme.spacing(1),
    },
    add: {
        backgroundColor: green[500],
        '&:hover': {
             backgroundColor:  green[800],
        },
    },
    addPop: {
        backgroundColor: green[500],
    },
    edit: {
        backgroundColor: amber[500],
        '&:hover': {
             backgroundColor:  amber[800],
        },
    },
    editPop: {
        backgroundColor: amber[500],
    },
    delete: {
        backgroundColor: red[500],
        '&:hover': {
             backgroundColor: red[800],
        },
    },
    deletePop: {
        color: red[500],
        backgroundColor: '#fff',
    },
    cancel: {
        color: '#fff',
        backgroundColor: grey[500],
        '&:hover': {
             backgroundColor: grey[700],
        },
    },
    cancelPop: {
        backgroundColor: grey[500],
    },
    buttonLabel: {
        textTransform: 'capitalize',
    },
    disabled: {
        backgroundColor: grey[100],
    },
    listItemText: {
            fontSize: theme.spacing(1.7),
        }
}));



export default function SplitButton(props) {
    const { variant, disabled, options, ...other } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex] = React.useState(options.length-1);
    const [filteredOptions] = React.useState(options.filter(function(index, option){
        return index !== options[selectedIndex];
    }));
    const handleClick = (index) => {
        if (Number.isInteger(index)){
            options[index].onClick();
        } else {
            options[selectedIndex].onClick();
        }
    };

    const handleMenuItemClick = (event, index) => {
        setOpen(false);
        handleClick(index);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <ButtonGroup
                className={classes.button}
                variant="contained"
                ref={anchorRef}
                classes={{
                    root: disabled || (options[selectedIndex].disabled) ? classes.disabled : `${classes[`${variant}`]}`,
                }}
                disabled={disabled}
            >
                <Button
                    onClick={handleClick}
                    classes={{
                        root: `${classes[`${variant}`]}`,
                        label: classes.buttonLabel,
                    }}
                    disabled={options[selectedIndex].disabled}
                >
                    <>
                        {options[selectedIndex].icon}
                        {options[selectedIndex].label}
                    </>
                </Button>
                <Button
                    classes={{
                        root: other.version ==='text' ? `${classes[`${variant}Txt`]}` : `${classes[`${variant}`]}`,
                        label: classes.buttonLabel
                    }}
                    color="primary"
                    size="small"
                    onClick={handleToggle}
                    disabled={disabled}
                >
                    <ArrowDropDown />
                </Button>
            </ButtonGroup>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{zIndex: 1500}}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'right top' : 'center bottom',
                        }}
                    >
                        <Paper
                        classes={{
                            root: `${classes[`${variant}Pop`]}`,
                        }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                    {filteredOptions.map((option, index) => (
                                        <MenuItem
                                            key={index}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                            classes={{
                                                root:  `${classes[`${variant}`]}`,
                                            }}
                                            disabled={option.disabled}
                                        >
                                            {option.icon}
                                            <ListItemText primary={option.label} classes={{primary : classes.listItemText}} />
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    )
}