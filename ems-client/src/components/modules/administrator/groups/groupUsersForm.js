import React, { Component } from 'react';
import { withStyles, Grid, Divider }  from '@material-ui/core/';
import { Save, Cancel } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';
import { Button } from 'common/gui';
import PropTypes from 'prop-types';
import { FormTableTransferListField } from 'common/form';

const head = [
    { id: 'id', numeric: false, disablePadding: true, label: 'Kod' },
    { id: 'username', numeric: false, disablePadding: false, label: 'Nazwa' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Imię' },
    { id: 'surname', numeric: false, disablePadding: false, label: 'Nazwisko' },
];

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(28)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
        height: `calc(100vh - ${theme.spacing(30)}px)`,
    }
});


class GroupUsersForm extends Component {

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, allUsers, error, onClose } = this.props;
        return(
            <>
                {error && <ModalDialog message={error} variant="error"/>}
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <Grid container spacing={1} justify="center" className={classes.container}>
                            <Grid item xs={12} sm={12}>
                                <FormTableTransferListField
                                    head={head}
                                    name="users"
                                    leftSideLabel = {constants.GROUP_USERS_ALL_USERS}
                                    leftSide={allUsers.length ? allUsers : [] }
                                    rightSideLabel = {constants.GROUP_USERS_USERS_IN_GROUP}
                                    rightSide={initialValues.users.length ? initialValues.users: []}
                                    orderBy="username"
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div>
                        <Divider />
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon=<Save className={classes.leftIcon}/>
                                iconAlign="left"
                                type='submit'
                                variant="submit"
                                disabled={pristine || submitting || invalid || submitSucceeded }
                            />
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel className={classes.leftIcon}/>
                                iconAlign="left"
                                variant="cancel"
                                onClick = {onClose}
                            />
                        </Grid>
                    </div>
                </form>
            </>
        );
    };
}

GroupUsersForm.propTypes = {
    classes: PropTypes.object.isRequired,
    allUsers: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default withStyles(styles)(GroupUsersForm)