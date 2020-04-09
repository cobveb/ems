import React from 'react';
import { withStyles, Tabs } from '@material-ui/core/';

const StyledTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#1890ff',
    },
})(Tabs);

function GuiTabs(props){
    const { ...custom } = props;
    return(
        <>
            <StyledTabs
                indicatorColor="primary"
                textColor="primary"
                {...custom}
            >
            </StyledTabs>
        </>
    )
}

export default (GuiTabs)