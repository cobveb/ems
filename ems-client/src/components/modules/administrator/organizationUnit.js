import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import OrganizationUnitFormContainer from 'containers/modules/administrator/organizationUnitFormContainer';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';

const styles = theme => ({
    icon: {
        marginRight: theme.spacing(1),
    }
});

class OrganizationUnit extends Component {

    handleSubmit = (values) => {
        this.props.submitSucceeded(values);
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    render(){
        const { classes, initialValues, isLoading, error, title, edit } = this.props;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.section}>
                        <Typography variant="h6">{title}</Typography>
                        <Divider />
                        <OrganizationUnitFormContainer
                            onSubmit={this.handleSubmit}
                            initialValues={initialValues}
                            edit={edit}
                        />
                    </div>
                </Grid>
            </>
        )
    }
}

export default withStyles(styles)(OrganizationUnit);