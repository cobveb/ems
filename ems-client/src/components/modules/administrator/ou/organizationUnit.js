import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import OrganizationUnitFormContainer from 'containers/modules/administrator/organizationUnitFormContainer';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
    },
});

class OrganizationUnit extends Component {
    state = {
        // if an API error has occurred, do not update the list of organizational units with data that is currently being edited
        isError: false,
    };

    handleSubmit = (values) => {
        this.props.submitSucceeded(values);
        this.setState({
            isError: false,
        })
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
        this.setState({
            isError: true,
        })
    }

    render(){
        const { classes, initialValues, isLoading, error, title, edit, ous, onClose, unassignedCoordinators, onRemoveDirectorCoordinator, onAddDirectorCoordinator } = this.props;
        const { isError} = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.root}>
                        <Typography variant="h6">{title}</Typography>
                        <Divider />
                        <OrganizationUnitFormContainer
                            onSubmit={this.handleSubmit}
                            initialValues={initialValues}
                            ous={ous}
                            unassignedCoordinators={unassignedCoordinators}
                            edit={edit}
                            onAddDirectorCoordinator={onAddDirectorCoordinator}
                            onRemoveDirectorCoordinator={onRemoveDirectorCoordinator}
                            onClose={() => onClose(isError === true ? null : initialValues)}
                        />
                    </div>
                </Grid>
            </>
        )
    }
}

export default withStyles(styles)(OrganizationUnit);