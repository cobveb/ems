import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import InstitutionFormContainer from 'containers/modules/administrator/institutionFormContainer';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
    required: {
        backgroundColor: '#faffbd',
    },
    input: {
        padding: theme.spacing(1.5),
    },
    inputRequired: {
        padding: theme.spacing(1.5),
        backgroundColor: '#faffbd',
    },
    button: {
        margin: theme.spacing(3),
    },
    buttonLabel: {
        textTransform: 'capitalize',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
});


class Institution extends Component {

    handleSubmit = (values) => {
        this.props.submitSucceeded(values);
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    render(){
        const { classes, initialValues, isLoading, error } = this.props;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.section}>
                        <Typography variant="h6">{constants.SUBMENU_INSTITUTION_DETAIL}</Typography>
                        <Divider />
                        <InstitutionFormContainer onSubmit={this.handleSubmit} initialValues={initialValues}/>
                    </div>
                </Grid>
            </>
        )
    }
}

export default withStyles(styles)(Institution);