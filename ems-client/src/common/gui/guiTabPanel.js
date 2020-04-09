import React from 'react';
import { withStyles, Box } from '@material-ui/core/';
import PropTypes from 'prop-types';

const StyledBox = withStyles(theme => ({
    root: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(6)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(6)}px)`,
        minHeight: `calc(100vh - ${theme.spacing(6)}px)`,
        padding: `${theme.spacing(2)}px  ${theme.spacing(0.5)}px  0  ${theme.spacing(0.5)}px`,
    },
}))(props => <Box {...props} />);


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <>
            { value === index
                ?
                    <StyledBox
                        hidden={value !== index}
                        {...other}
                    >
                        {children}
                    </StyledBox>
                :
                    null
            }
        </>
    );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default (TabPanel)
