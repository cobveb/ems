import React from 'react';
import { withStyles, Tab } from '@material-ui/core/';
import PropTypes from 'prop-types';

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginBottom: theme.spacing(0),
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
    },
    labelIcon: {
        minHeight: theme.spacing(1),
    },
    wrapper: {
        flexDirection:'row',
            '&  > *:first-child' : {
                marginTop: theme.spacing(0.8),
                marginRight: theme.spacing(1),
            },
    },

}))(props => <Tab {...props} />);

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

function GuiTab(props){
    const { classes, index, ...custom } = props;
    return(
        <>
            <StyledTab {...a11yProps(index)} {...custom} ></StyledTab>
        </>
    )
}

GuiTab.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
};

export default (GuiTab)