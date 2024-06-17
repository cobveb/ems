import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core/';
import { FormTextField, FormCheckBox, FormTableField } from 'common/form';
import { Button } from 'common/gui';
import { Save, Cancel, Edit, List } from '@material-ui/icons/';
import EntitlementSystemPermissionFormContainer from 'containers/modules/asi/dictionary/employees/forms/entitlementSystemPermissionFormContainer'
import { ModalDialog } from 'common/';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    active: {
        paddingRight: theme.spacing(2),
    },
    container: {
        width: '100%',
    },
    actionContainer: {
        paddingLeft: theme.spacing(5),
        margin: 0,
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(61.5)}px)`,
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
})

class EntitlementSystemForm extends Component {
    state = {
        selected: [],
        tableHeadCells:[
            {
                id: 'name',
                label: constants.TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
            {
                id: 'isActive',
                label: constants.USER_TABLE_HEAD_ROW_ACTIVE,
                type: 'boolean',
            },
        ],
        openDetails: false,
        detailsAction: null,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openDetails = {...prevState.openDetails};
            let detailsAction = {...prevState.detailsAction};
            selected[0] = row;
            openDetails =  !this.state.openDetails;
            detailsAction = 'edit';
            return {selected, detailsAction, openDetails}
        });
    }

    handleOpenDetails = (event, action) => {
        this.setState({openDetails: !this.state.openDetails, detailsAction: action});
    };

    handleCloseDetails = () => {
        this.setState({openDetails: null, detailsAction: null, selected: []});
    };

    handleSubmitPermission = (values) => {
        this.props.onSubmitPermission(values, this.state.detailsAction);
        this.handleCloseDetails();
    }

    handleDelete = (event, action) => {
        this.setState(state => ({ detailsAction: action}));
    }

    handleConfirmDelete = () =>{
        this.props.onDeletePermission(this.state.selected[0]);
        this.setState({
            detailsAction: null,
            selected: [],
        });
    }

    handleCloseDialog = () =>{
        this.setState({
            detailsAction: null,
            selected: [],
        });
    }

    render(){
        const {classes, initialValues, pristine, handleSubmit, submitSucceeded, submitting, invalid, action, onClose} = this.props;
        const {selected, tableHeadCells, openDetails, detailsAction} = this.state;

        return(
            <>
                {detailsAction === "delete" &&
                    <ModalDialog
                        message={constants.ASI_DICTIONARY_SYSTEMS_SYSTEM_PERMISSION_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {openDetails &&
                    <EntitlementSystemPermissionFormContainer
                        initialValues={detailsAction === 'add' ? {isActive: true} : selected[0]}
                        open={openDetails}
                        action={detailsAction}
                        onSubmit={this.handleSubmitPermission}
                        onClose={this.handleCloseDetails}
                    />
                }
                <>
                    <form onSubmit={handleSubmit}>
                        <Typography
                            variant="h6"
                        >
                            { action === "add" ?
                                constants.ASI_DICTIONARY_SYSTEMS_CREATE_SYSTEM_TITLE
                                    : `${constants.ASI_DICTIONARY_SYSTEMS_EDIT_SYSTEM_TITLE} ${initialValues.name}`
                            }
                        </Typography>
                        <Divider />
                        <div className={classes.content}>
                            <Grid container spacing={0} justify="flex-end"  className={classes.active}>
                                <FormCheckBox
                                    name="isActive"
                                    label={constants.ASI_DICTIONARY_SYSTEMS_SYSTEM_ACTIVE}
                                />
                            </Grid>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12}>
                                    <FormTextField
                                        name="name"
                                        label={constants.ASI_DICTIONARY_SYSTEMS_SYSTEM_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 120 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="description.content"
                                        label={constants.DESCRIPTION}
                                        multiline
                                        rows={5}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Toolbar className={classes.toolbar}>
                                        <List className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.ASI_DICTIONARY_SYSTEMS_SYSTEM_PERMISSIONS}
                                        </Typography>
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="permissions"
                                        head={tableHeadCells}
                                        allRows={initialValues.permissions}
                                        checkedRows={selected ? selected : []}
                                        toolbar={true}
                                        orderBy="id"
                                        addButtonProps={{
                                            disabled : (!pristine || action === 'add')
                                        }}
                                        editButtonProps={{
                                            label :constants.BUTTON_EDIT,
                                            icon : <Edit/>,
                                            variant: "edit",
                                        }}
                                        onAdd={(event) => this.handleOpenDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDelete(event, 'delete')}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
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
                                <Grid item xs={10}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                        className={classes.actionContainer}
                                    >
                                        <Button
                                            label={constants.BUTTON_SAVE}
                                            icon=<Save/>
                                            iconAlign="left"
                                            type='submit'
                                            variant="submit"
                                            disabled={pristine || submitting || invalid || submitSucceeded }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={2}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-end"
                                        alignItems="center"
                                    >
                                        <Button
                                            label={constants.BUTTON_CLOSE}
                                            icon=<Cancel/>
                                            iconAlign="left"
                                            variant="cancel"
                                            onClick={() => onClose(initialValues)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </form>
                </>
            </>
        )
    }
}

EntitlementSystemForm.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.string,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    onClose: PropTypes.func,
};

export default withStyles(styles)(EntitlementSystemForm);