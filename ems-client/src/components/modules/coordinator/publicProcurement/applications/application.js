import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApplicationFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationFormContainer';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import * as constants from 'constants/uiNames';

const styles = theme => ({
    content: {
        height: '100%',
        overflow: 'auto',
        padding: 0,
        maxWidth: '100%',
    },
    container: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
});

class Application extends Component{
    render(){
        const { classes, isLoading, initialValues, action, estimationTypes, vats, planPositions, coordinators, modes }  = this.props;
        return(
            <>
                <Grid
                    container
                    direction="column"
                    spacing={0}
                >
                    <Typography variant='h6'>
                        { action === "add" ?
                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_CREATE
                                :  constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_EDIT + ` ${initialValues.orderedObject}`
                        }
                    </Typography>
                    <Divider />
                    <div className={classes.content}>
                        <ApplicationFormContainer
                            isLoading={isLoading}
                            initialValues={initialValues}
                            action={action}
                            estimationTypes={estimationTypes}
                            vats={vats}
                            planPositions={planPositions}
                            coordinators={coordinators}
                            modes={modes}
                            onPrint={this.props.onPrint}
                            onSubmit={this.props.onSave}
                            onSaveAssortmentGroup={this.props.onSaveAssortmentGroup}
                            onDeleteAssortmentGroup={this.props.onDeleteAssortmentGroup}
                            onSavePart={this.props.onSavePart}
                            onDeletePart={this.props.onDeletePart}
                            onSaveCriterion={this.props.onSaveCriterion}
                            onDeleteCriterion={this.props.onDeleteCriterion}
                            onSend={this.props.onSendApplication}
                            onClose={this.props.onClose}
                        />
                    </div>
                </Grid>
            </>
        )
    }
}

Application.propTypes = {
    classes: PropTypes.object,
    initialValues: PropTypes.object,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}
export default withStyles(styles)(Application);

