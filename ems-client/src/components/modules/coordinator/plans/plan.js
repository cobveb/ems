import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Tabs, Tab, TabPanel } from 'common/gui';
import { ModalDialog, Spinner} from 'common/';
import { Info, LibraryBooks } from '@material-ui/icons/';
import PlanBasicInfoFormContainer from 'containers/modules/coordinator/plans/forms/planBasicInfoFormContainer';
import PlanPositionsFormContainer from 'containers/modules/coordinator/plans/forms/planPositionsFormContainer';

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
    },
});

class Plan extends Component {
    state = {
        positions: [],
        numTab: 0,
    }

    handleChangeTabs = (event, numTab) => {
        this.setState({ numTab });
        if(numTab === 1){
            this.props.onTabPositions()
        }
    };

    render(){
        const {classes, initialValues, action, error, isLoading, onClose, types, positions, vats, units, categories, foundingSources, costsTypes } = this.props;
        const { numTab } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.root}>
                        <Typography
                            variant="h6"
                        >
                            { action === "add" ?
                                constants.COORDINATOR_PLAN_CREATE_NEW_PLAN_TITLE
                                    :  constants.COORDINATOR_PLAN_EDIT_PLAN_TITLE + ` ${initialValues.number}`
                            }
                        </Typography>
                        <Divider />
                        <Tabs
                            value={numTab}
                            onChange={this.handleChangeTabs}
                            variant="fullWidth"
                            scrollButtons="on"
                        >
                            <Tab label={constants.COORDINATOR_PLAN_BASIC_INFORMATION} icon={<Info />} index={0} />
                            <Tab label={constants.COORDINATOR_PLAN_POSITIONS} icon={<LibraryBooks />} index={1} disabled={action==="hhh"}/>
                        </Tabs>
                        <TabPanel value={numTab} index={0}>
                            <PlanBasicInfoFormContainer
                                types={types}
                                initialValues={initialValues}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>
                        <TabPanel value={numTab} index={1}>
                            <PlanPositionsFormContainer
                                types={types}
                                initialValues={positions}
                                planStatus={initialValues.status.code}
                                planType={initialValues.type.code}
                                onClose={() => onClose(initialValues)}
                                vats={vats}
                                units={units}
                                categories={categories}
                                costsTypes={costsTypes}
                                foundingSources={foundingSources}
                            />
                        </TabPanel>
                    </div>
                </Grid>
            </>
        );
    };
};
Plan.propTypes = {
    classes: PropTypes.object,
    initialValues: PropTypes.object,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}
export default withStyles(styles)(Plan);