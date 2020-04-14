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

    handleSubmit = (values) => {
        this.props.submitSucceeded(values);
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    render(){
        const { classes, initialValues, isLoading, error, title, edit, onClose } = this.props;
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
                            edit={edit}
                            onClose={() => onClose(initialValues)}
                        />
                    </div>
                </Grid>
            </>
        )
    }
}

export default withStyles(styles)(OrganizationUnit);