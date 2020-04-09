import React, { Component } from 'react';
import { withStyles, Grid, Divider }  from '@material-ui/core/';
import { Save, Cancel } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';
import { Button } from 'common/gui';
import { FormTextField } from 'common/form';
import PropTypes from 'prop-types';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(28)}px)`,
        overflow: 'auto',
        padding: `${theme.spacing(1)}px  0 0 0`,
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
    }
});

class GroupBasicInfoForm extends Component {

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, action, error, onClose, initialValues } = this.props;
        return(
            <>
                {error && <ModalDialog message={error} variant="error"/>}
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <Grid container spacing={1} justify="center" className={classes.container}>
                            <Grid item xs={12} sm={3}>
                                <FormTextField
                                    name="code"
                                    label={constants.GROUP_BASIC_INFORMATION_CODE}
                                    isRequired={true}
                                    inputProps={{ maxLength: 20 }}
                                    disabled={action === "edit" ? true : false}
                                    valueType="digits"
                                />
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <FormTextField
                                    name="name"
                                    label={constants.GROUP_BASIC_INFORMATION_NAME}
                                    isRequired={true}
                                    disabled={initialValues.code ==="admin"}
                                    inputProps={{ maxLength: 30 }}
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

GroupBasicInfoForm.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    error: PropTypes.string,
};

export default withStyles(styles)(GroupBasicInfoForm)