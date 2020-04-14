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
    { id: 'code', numeric: false, disablePadding: true, label: constants.USER_GROUPS_TABLE_HEAD_ROW_CODE },
    { id: 'name', numeric: false, disablePadding: false, label: constants.USER_GROUPS_TABLE_HEAD_ROW_NAME },
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


class UserGroupsForm extends Component {

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, allGroups, error, onClose } = this.props;
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
                                    name="groups"
                                    leftSideLabel = {constants.USER_GROUPS_ALL_GROUPS}
                                    leftSide={allGroups.length ? allGroups : [] }
                                    rightSideLabel = {constants.USER_GROUPS_ALL_USER_GROUPS}
                                    rightSide={initialValues.groups.length ? initialValues.groups : []}
                                    orderBy="name"
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

UserGroupsForm.propTypes = {
    classes: PropTypes.object.isRequired,
    allUsers: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default withStyles(styles)(UserGroupsForm)