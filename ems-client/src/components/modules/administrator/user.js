import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import UserFormContainer from 'containers/modules/administrator/userFormContainer';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';

const styles = theme => ({
    section: {
        marginBottom: theme.spacing(1),
    },
});


class User extends Component {

    handleSubmit = (values) => {
        this.props.submitSucceeded(values);
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    render(){
        const { classes, initialValues, isLoading, error, title, edit, ous } = this.props;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.section}>
                        <Typography variant="h6">{title}</Typography>
                        <Divider />
                        <UserFormContainer
                            onSubmit={this.handleSubmit}
                            initialValues={initialValues}
                            edit={edit}
                            ous={ous}
                        />
                    </div>
                </Grid>
            </>
        )
    }
}

export default withStyles(styles)(User);