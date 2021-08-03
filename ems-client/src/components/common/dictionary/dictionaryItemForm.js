import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Divider } from '@material-ui/core/';
import {  Button } from 'common/gui';
import { Save, Close } from '@material-ui/icons/';
import { FormTextField, FormCheckBox } from 'common/form';

const styles = theme => ({
    content: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        maxWidth: '100%',
    },
});

class DictionaryItemForm extends Component {
    render(){
        const {classes, handleSubmit, pristine, submitting, invalid, submitSucceeded, onClose, action, dictionaryType } = this.props;

        return(
            <>
                { submitting && <Spinner /> }
                <form onSubmit={handleSubmit}>
                    <div className={classes.content}>
                    <Grid container spacing={1} justify="center">
                        <Grid item xs={6}>
                            <FormTextField
                                name="code"
                                label={constants.DICTIONARY_ITEM_FORM_CODE}
                                isRequired={true}
                                inputProps={{ maxLength: 10 }}
                                disabled={action === 'edit' || dictionaryType ==='P' ? true : false}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormCheckBox
                                name="isActive"
                                label={constants.DICTIONARY_ITEM_FORM_IS_ACTIVE}
                                value={false}
                                disabled={dictionaryType ==='P' && true }
                        />
                        </Grid>
                        <Grid item xs={12}>
                            <FormTextField
                                name="name"
                                label={constants.DICTIONARY_ITEM_FORM_NAME}
                                isRequired={true}
                                inputProps={{ maxLength: 120 }}
                                disabled={ dictionaryType ==='P' && true}
                            />
                        </Grid>
                    </Grid>
                    </div>
                    <Divider/>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-end"
                    >
                        { dictionaryType !== 'P' &&
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon=<Save/>
                                iconAlign="right"
                                variant="submit"
                                disabled={pristine || submitting || invalid || submitSucceeded }
                            />
                        }
                        <Button
                            label={constants.BUTTON_CLOSE}
                            icon=<Close />
                            iconAlign="right"
                            variant="cancel"
                            onClick={onClose}
                        />
                    </Grid>
                </form>
            </>

        );
    };
}

DictionaryItemForm.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DictionaryItemForm);
