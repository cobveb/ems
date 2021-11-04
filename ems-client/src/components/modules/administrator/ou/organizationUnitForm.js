import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { MyLocation, Contacts, Save, Cancel, PeopleAlt } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import { FormTextField, FormCheckBox, FormRadioButtonField, FormTableField } from 'common/form';
import { Button } from 'common/gui';
import DirectorCoordinatorsFormContainer from 'containers/modules/administrator/directorCoordinatorsFormContainer'

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(19.5)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    active: {
        paddingRight: theme.spacing(2),
    },
    container: {
        maxWidth: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(18),
    },
});

const zipCodeMask = [/\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, /\d/,];
const phoneMask = ['+', '4','8',' ','(', /[1-9]/, /\d/,')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

class OrganizationUnitForm extends Component {
    state = {
        selected: [],
        openDirectorCoordinators: false,
        directorCoordinatorAction: null,
        roles: [
            {
                code: "CHIEF",
                name: constants.ORGANIZATION_UNIT_CHIEF,
            },
            {
                code: "ECONOMIC",
                name: constants.ORGANIZATION_UNIT_ECONOMIC,
            },
            {
                code: "DIRECTOR",
                name: constants.ORGANIZATION_UNIT_DIRECTOR,
            },
            {
                code: "COORDINATOR",
                name: constants.ORGANIZATION_UNIT_COORDINATOR,
            },
        ],
        tableHead: [
            {
                id: 'code',
                label: constants.ORGANIZATION_UNIT_COORDINATOR_CODE,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.ORGANIZATION_UNIT_COORDINATOR_NAME,
                type: 'text',
            },
        ],
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleAddDirectorCoordinators = () =>{
        this.setState({
            openDirectorCoordinators: !this.state.openDirectorCoordinators,
        })
    }

    handleSubmitDirectorCoordinators = (values) =>{
        this.props.onAddDirectorCoordinator(values.directorCoordinators);
        this.setState({
            openDirectorCoordinators: !this.state.openDirectorCoordinators,
        })
    }

    handleDeleteDirectorCoordinator = (event, action) => {
        this.setState(state => ({ directorCoordinatorAction: action}));
    }

    handleCancelDelete = () => {
        this.setState({ directorCoordinatorAction: null, selected: [] });
    }

    handleConfirmDelete = () => {
        this.props.onRemoveDirectorCoordinator(this.state.selected[0]);
        this.setState(state => ({ directorCoordinatorAction: null, selected: []}));
    }

    render(){
        const { initialValues, handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, edit, onClose, role, unassignedCoordinators } = this.props;
        const { selected, roles, tableHead, openDirectorCoordinators, directorCoordinatorAction } = this.state;
        return (
            <>

                {directorCoordinatorAction === "delete" &&
                    <ModalDialog
                        message={constants.ORGANIZATION_UNIT_DIRECTOR_REMOVE_COORDINATOR_MESSAGE}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }

                { openDirectorCoordinators &&
                    <DirectorCoordinatorsFormContainer
                        initialValues={{directorCoordinators: initialValues.directorCoordinators}}
                        unassignedCoordinators={unassignedCoordinators}
                        open={openDirectorCoordinators}
                        onSubmit={this.handleSubmitDirectorCoordinators}
                        onClose={this.handleAddDirectorCoordinators}
                    />
                }

                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Grid container spacing={0} justify="flex-end"  className={classes.active}>
                                <FormCheckBox
                                    name="active"
                                    label={constants.ORGANIZATION_UNIT_ACTIVE}
                                />
                            </Grid>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="code"
                                        label={constants.INSTITUTION_BASIC_INFORMATION_CODE}
                                        isRequired={true}
                                        inputProps={{ maxLength: 10 }}
                                        disabled={edit}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="shortName"
                                        label={constants.INSTITUTION_BASIC_INFORMATION_SHORT_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 80 }}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="name"
                                        label={constants.INSTITUTION_BASIC_INFORMATION_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 120 }}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormRadioButtonField
                                        name="role"
                                        label={constants.INSTITUTION_BASIC_INFORMATION_ROLE}
                                        row
                                        options={roles}
                                    />
                                </Grid>
                                { role === 'DIRECTOR' &&
                                    <Grid item xs={12} sm={12} >
                                        <Toolbar className={classes.toolbar}>
                                            <PeopleAlt className={classes.subHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >{constants.ORGANIZATION_UNIT_COORDINATORS}</Typography>
                                        </Toolbar>
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="directorCoordinators"
                                            head={tableHead}
                                            allRows={initialValues.directorCoordinators}
                                            checkedRows={selected}
                                            toolbar={true}
                                            editButtonProps={{
                                                hide: true,
                                            }}
                                            deleteButtonProps={{
                                                disabled : selected.length > 0 ? false : true,
                                            }}
                                            onAdd={this.handleAddDirectorCoordinators}
                                            onEdit={() => {}}
                                            onDelete={(event) => this.handleDeleteDirectorCoordinator(event, 'delete', )}
                                            multiChecked={false}
                                            checkedColumnFirst={true}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            orderBy="code"
                                        />
                                    </Grid>
                                }
                            </Grid>
                        </div>
                        <div className={classes.section}>
                            <Divider />
                            <Toolbar className={classes.toolbar} >
                                <MyLocation className={classes.subHeaderIcon} fontSize="small"/>
                                <Typography variant="subtitle1" >
                                   {constants.INSTITUTION_ADDRESS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="city"
                                        label={constants.INSTITUTION_ADDRESS_CITY}
                                        inputProps={{ maxLength: 30 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="zipCode"
                                        label={constants.INSTITUTION_ADDRESS_ZIP_CODE}
                                        mask={zipCodeMask}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="street"
                                        label={constants.INSTITUTION_ADDRESS_STREET}
                                        inputProps={{ maxLength: 50 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="building"
                                        label={constants.INSTITUTION_ADDRESS_BUILDING}
                                        inputProps={{ maxLength: 5 }}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.section}>
                            <Divider/>
                            <Toolbar className={classes.toolbar} >
                                <Contacts className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.INSTITUTION_CONTACTS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="flex-start" direction="row" alignItems="flex-start" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="phone"
                                        label={constants.INSTITUTION_CONTACTS_PHONE}
                                        mask={phoneMask}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="fax"
                                        label={constants.INSTITUTION_CONTACTS_FAX}
                                        mask={phoneMask}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormTextField
                                        name="email"
                                        label={constants.INSTITUTION_CONTACTS_EMAIL}
                                        isRequired={true}
                                    />
                                </Grid>
                            </Grid>
                        </div>
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
                                onClick={onClose}
                            />
                        </Grid>
                    </div>
                </form>
            </>
        )
    }
}

export default withStyles(styles)(OrganizationUnitForm)
