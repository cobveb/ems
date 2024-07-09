import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core/';
import { FormTextField, FormCheckBox, FormTableField, FormSelectField } from 'common/form';
import { Button } from 'common/gui';
import { Save, Cancel, Edit, List } from '@material-ui/icons/';
import RegisterEntitlementSystemFormContainer from 'containers/modules/asi/dictionary/registers/forms/registerEntitlementSystemFormContainer';
import { ModalDialog } from 'common/';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.1)}px)`,
        overflow: 'auto',
        maxWidth: '100%',
        padding: 0,
    },
    active: {
        paddingRight: theme.spacing(2),
    },
    container: {
        maxWidth: '100%',
    },
    actionContainer: {
        maxWidth: '100%',
        paddingLeft: theme.spacing(5),
        margin: 0,
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(62.1)}px)`,
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
        if(!this.state.openDetails){
            this.props.onGetUnassignedSystem();
        }
        this.setState({openDetails: !this.state.openDetails, detailsAction: action});
    };

    handleCloseDetails = () => {
        this.setState({openDetails: null, detailsAction: null, selected: []});
    };

    handleSubmitPermissionSystems = (values) => {
        this.props.onSubmitPermissionSystems(values.entitlementSystems);
        this.handleCloseDetails();
    }

    handleDelete = (event, action) => {
        this.setState(state => ({ detailsAction: action}));
    }

    handleConfirmDelete = () =>{
        this.props.onDeletePermissionSystem(this.state.selected[0]);
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
        const {classes, initialValues, pristine, handleSubmit, submitSucceeded, submitting, invalid, action, onClose, baseTypes} = this.props;
        const {selected, tableHeadCells, openDetails, detailsAction} = this.state;
        return(
            <>
                {detailsAction === "delete" &&
                    <ModalDialog
                        message={constants.ASI_DICTIONARY_REGISTER_SYSTEM_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {openDetails &&
                    <RegisterEntitlementSystemFormContainer
                        initialValues={{entitlementSystems:[]}}
                        unassignedSystems={this.props.systems}
                        open={openDetails}
                        onSubmit={this.handleSubmitPermissionSystems}
                        onClose={this.handleCloseDetails}
                    />
                }
                <>
                    <form onSubmit={handleSubmit}>
                        <Typography
                            variant="h6"
                        >
                            { action === "add" ?
                                constants.ASI_DICTIONARY_REGISTER_CREATE_REGISTER_TITLE
                                    : `${constants.ASI_DICTIONARY_REGISTER_EDIT_REGISTER_TITLE} ${initialValues.name}`
                            }
                        </Typography>
                        <Divider />
                        <div className={classes.content}>
                            <Grid container spacing={0} justifyContent="flex-end"  className={classes.active}>
                                <FormCheckBox
                                    name="isActive"
                                    label={constants.ASI_DICTIONARY_SYSTEMS_SYSTEM_ACTIVE}
                                />
                            </Grid>
                            <Grid container spacing={1} justifyContent="center" className={classes.container}>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="name"
                                        label={constants.ASI_DICTIONARY_REGISTER_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 120 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="baseType"
                                        label={constants.ASI_DICTIONARY_REGISTER_BASE_TYPE}
                                        options={baseTypes}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="description"
                                        label={constants.DESCRIPTION}
                                        multiline
                                        minRows={5}
                                        inputProps={{ maxLength: 500 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Toolbar className={classes.toolbar}>
                                        <List className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.ASI_DICTIONARY_REGISTER_PERMISSION_SYSTEMS}
                                        </Typography>
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="systems"
                                        head={tableHeadCells}
                                        allRows={initialValues.systems}
                                        checkedRows={selected ? selected : []}
                                        toolbar={true}
                                        orderBy="id"
                                        addButtonProps={{
                                            disabled : (!pristine || action === 'add')
                                        }}
                                        editButtonProps={{
                                            hide: true
                                        }}
                                        onAdd={(event) => this.handleOpenDetails(event, "add")}
                                        onEdit={() => {}}
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
                                justifyContent="center"
                                alignItems="flex-start"
                                className={classes.container}
                            >
                                <Grid item xs={10}>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
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
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        className={classes.container}
                                    >
                                        <Button
                                            label={constants.BUTTON_CLOSE}
                                            icon=<Cancel/>
                                            iconAlign="left"
                                            variant="cancel"
                                            onClick={() => onClose()}
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