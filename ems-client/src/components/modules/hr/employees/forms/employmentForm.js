import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core';
import { Save, Cancel, Work, Edit, List } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormDateField, FormTextField, FormSelectField, FormCheckBox, FormTableField } from 'common/form';
import { ModalDialog, Spinner} from 'common/';
import WorkplaceFormContainer from 'containers/modules/hr/employees/forms/workplaceFormContainer';
import AuthorizationFormContainer from 'containers/modules/hr/employees/forms/authorizationFormContainer';
import StatementFormContainer from 'containers/modules/hr/employees/forms/statementFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(25.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        maxWidth: '100%',
    },
    active: {
        maxWidth: '100%',
        paddingRight: theme.spacing(2),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    tableWrapperUPO: {
        overflow: 'auto',
        height: theme.spacing(30),
    },
    containerButtons: {
        maxWidth: '100%',
        paddingLeft: theme.spacing(20),
    },
});

class EmploymentForm extends Component {
    state = {
        tableHead: [
            {
                id: 'place.name',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_PLACE,
                type: 'object',
            },
            {
                id: 'workplace.name',
                label: constants.EMPLOYEE_EMPLOYMENTS_TABLE_HEAD_ROW_WORKPLACE,
                type: 'object',
            },
            {
                id: 'dateFrom',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DATE_FROM,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'dateTo',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DATE_TO,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'isActive',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_ACTIVE,
                type: 'boolean',
            },
        ],
        tableHeadStatements: [
            {
                id: 'statementDate',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'dateFrom',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE_FROM,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'dateTo',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE_TO,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'isActive',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_ACTIVE,
                type: 'boolean',
            },
        ],
        tableHeadAuthorizations: [
            {
                id: 'authorizationDate',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DATE,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'dateFrom',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DATE_FROM,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'dateTo',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DATE_TO,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'isActive',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_ACTIVE,
                type: 'boolean',
            },
        ],
        selected: [],
        selectedType: null,
        openDetails: null,
        openDetailsAction: null,
        deleteType: null,
        formChanged : false,
    }

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: true});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleSelect = (type, row) => {
        this.setState(prevState => {
            let selected = [...prevState.selected];
            let selectedType = prevState.selectedType;
            selected = row;
            selectedType = row.length > 0 ? type : null;

            return {selected, selectedType}
        });
    }

    handleDoubleClick = (type, row) => {

        this.setState(prevState =>{
            let selected = [...prevState.selected];
            let openDetails = prevState.openDetails;
            let openDetailsAction = prevState.openDetailsAction;
            selected[0] = row;
            openDetails = type;
            openDetailsAction = 'edit';

            return{selected, openDetails, openDetailsAction}
        });
    }

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.props.reset();
        this.props.onClose();
    }

    handleOpenDetails = (event, action, type) => {
        this.setState({openDetails: type, openDetailsAction: action});
    };

    handleCloseDetails = () => {
        this.setState({openDetails: null, openDetailsAction: null, selected: []});
    };

    handleDelete = (event, type) =>{
        this.setState({deleteType: type});
    }

    handleCloseDialog = () => {
        this.setState({deleteType: null});
    }

    handleSubmit = (values, type) =>{
        this.props.onSubmitEmploymentDetail(values, this.props.initialValues, type, this.state.openDetailsAction);
        this.handleCloseDetails();
    }

    handleConfirmDelete = () =>{
        this.props.onDeleteEmploymentDetail(this.props.initialValues, this.state.selected[0], this.state.deleteType)
        this.setState({selected: [], selectedType: null, deleteType: null});
    }

    render(){
        const { classes, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, employmentTypes, employmentType, employmentStatuses, isAuthorization, isStatement, hrNumber } = this.props;
        const { selected, selectedType, tableHead, tableHeadStatements, tableHeadAuthorizations, openDetails, openDetailsAction, deleteType, formChanged } = this.state;
        return(
            <>

                {deleteType !== null &&
                    <ModalDialog
                        message={ deleteType === "statement" ? constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DELETE_MSG :
                            deleteType === "workplace" ? constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DELETE_MSG :
                                constants.EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                { (openDetails !== null && openDetails === 'authorization') &&
                    <AuthorizationFormContainer
                        initialValues={openDetailsAction==="add" ? {
                            isActive: true,
                            authorizationDate: initialValues.employmentDate,
                            dateFrom: initialValues.dateFrom,
                            dateTo: initialValues.dateTo
                        }: selected[0]}
                        processingBases={this.props.processingBases}
                        open={openDetails !== null ? true : false}
                        onClose={this.handleCloseDetails}
                        onSubmit={(values) => this.handleSubmit(values, "authorization")}
                    />
                }
                { (openDetails !== null && openDetails === 'statement') &&
                    <StatementFormContainer
                        initialValues={openDetailsAction==="add" ? {
                            isActive: true,
                            statementDate: initialValues.employmentDate,
                            dateFrom: initialValues.dateFrom,
                            dateTo: initialValues.dateTo
                        }: selected[0]}
                        open={openDetails !== null ? true : false}
                        onClose={this.handleCloseDetails}
                        onSubmit={(values) => this.handleSubmit(values, "statement")}
                    />
                }
                { (openDetails !== null && openDetails === 'workplace') ?
                    <WorkplaceFormContainer
                        initialValues={openDetailsAction==="add" ? {
                            isActive: true,
                            dateFrom: initialValues.dateFrom,
                            dateTo: initialValues.dateTo
                        }: selected[0]}
                        action={openDetailsAction}
                        places={this.props.places}
                        workplaces={this.props.workplaces}
                        open={openDetails !== null ? true : false}
                        onClose={this.handleCloseDetails}
                        onSubmit={(values) => this.handleSubmit(values, "workplace")}
                    />
                :
                    <form onSubmit={handleSubmit}>
                        {formChanged === true &&
                            <ModalDialog
                                message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                                variant="warning"
                                onConfirm={this.handleConfirmClose}
                                onClose={this.handleCancelClose}
                            />
                        }
                        { submitting && <Spinner /> }
                            <div className={classes.content}>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <Work className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.EMPLOYEE_BASIC_INFORMATION}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={0} justify="flex-end" className={classes.active}>
                                        <FormCheckBox
                                            name="isActive"
                                            label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_ACTIVE}
                                        />
                                    </Grid>
                                    <Grid container spacing={1} justify="center" className={classes.container}>
                                        <Grid item xs={12}>
                                            <FormSelectField
                                                name="employmentType"
                                                label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_CONTRACT_TYPE}
                                                options={employmentTypes}
                                                isRequired={true}
                                            />
                                        </Grid>
                                        { employmentType !== undefined && (
                                            (['UPR', 'KON'].includes(employmentType.code) && hrNumber !== null) ||
                                                !['UPR', 'KON'].includes(employmentType.code)
                                        ) &&
                                            <>
                                                <Grid item xs={8} >
                                                    <FormTextField
                                                        name="number"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_NUMBER}
                                                        isRequired={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <FormDateField
                                                        name="employmentDate"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_CONTRACT_DATE}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <FormDateField
                                                        name="dateFrom"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_EMPLOYMENT_DATE_FROM}
                                                        isRequired={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <FormDateField
                                                        name="dateTo"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_EMPLOYMENT_DATE_TO}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <FormSelectField
                                                        name="status"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATUS}
                                                        options={employmentStatuses}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormCheckBox
                                                        name="isProcess"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_PROCESS}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormCheckBox
                                                        name="isStatement"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormCheckBox
                                                        name="isAuthorization"
                                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_UPO}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <FormTextField
                                                        name="comments.content"
                                                        label={constants.DESCRIPTION}
                                                        multiline
                                                        rows="1"
                                                    />
                                                </Grid>
                                            </>
                                        }
                                    </Grid>
                                </div>
                                { employmentType !== undefined && (
                                    (['UPR', 'KON'].includes(employmentType.code) && hrNumber !== null) ||
                                        !['UPR', 'KON'].includes(employmentType.code)
                                ) &&
                                    <>
                                        <div className={classes.section}>

                                            <Grid container spacing={0} justify="center" className={classes.container}>
                                                <Grid item xs={12} sm={6} >
                                                    <Toolbar className={classes.toolbar}>
                                                        <List className={classes.subHeaderIcon} fontSize="small" />
                                                        <Typography variant="subtitle1" >
                                                            {constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENTS_TITLE}
                                                        </Typography>
                                                    </Toolbar>
                                                    <FormTableField
                                                        className={classes.tableWrapperUPO}
                                                        name="statements"
                                                        head={tableHeadStatements}
                                                        allRows={initialValues.statements !== undefined ? initialValues.statements : []}
                                                        checkedRows={selectedType === 'statement' ? selected : [] }
                                                        toolbar={true}
                                                        addButtonProps={{
                                                            disabled: action === 'add' || !isStatement ||  (isStatement && !pristine),
                                                        }}
                                                        editButtonProps={{
                                                            label :constants.BUTTON_EDIT,
                                                            icon : <Edit/>,
                                                            variant: "edit",
                                                        }}
                                                        onAdd={(event) => this.handleOpenDetails(event, "add", 'statement')}
                                                        onEdit={(event) => this.handleOpenDetails(event, 'edit', 'statement')}
                                                        onDelete={(event) => this.handleDelete(event, 'statement' )}
                                                        multiChecked={false}
                                                        checkedColumnFirst={true}
                                                        onSelect={(row) => this.handleSelect('statement', row)}
                                                        onDoubleClick={(row) => this.handleDoubleClick('statement', row)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} >
                                                    <Toolbar className={classes.toolbar}>
                                                        <List className={classes.subHeaderIcon} fontSize="small" />
                                                        <Typography variant="subtitle1" >
                                                            {constants.EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATIONS_TITLE}
                                                        </Typography>
                                                    </Toolbar>
                                                    <FormTableField
                                                        className={classes.tableWrapperUPO}
                                                        name="authorizations"
                                                        head={tableHeadAuthorizations}
                                                        allRows={initialValues.authorizations !== undefined ? initialValues.authorizations : [] }
                                                        checkedRows={selectedType === 'authorization' ? selected : []}
                                                        toolbar={true}
                                                        addButtonProps={{
                                                            disabled: action === 'add' || !isAuthorization || (isAuthorization && !pristine),
                                                        }}
                                                        editButtonProps={{
                                                            label :constants.BUTTON_EDIT,
                                                            icon : <Edit/>,
                                                            variant: "edit",
                                                        }}
                                                        onAdd={(event) => this.handleOpenDetails(event, "add", 'authorization')}
                                                        onEdit={(event) => this.handleOpenDetails(event, 'edit', 'authorization')}
                                                        onDelete={(event) => this.handleDelete(event, 'authorization')}
                                                        multiChecked={false}
                                                        checkedColumnFirst={true}
                                                        onSelect={(row) => this.handleSelect('authorization', row)}
                                                        onDoubleClick={(row) => this.handleDoubleClick('authorization', row)}
                                                    />
                                                </Grid>
                                           </Grid>
                                        </div>
                                        <div className={classes.section}>
                                            <Toolbar className={classes.toolbar}>
                                                <Work className={classes.subHeaderIcon} fontSize="small" />
                                                <Typography variant="subtitle1" >
                                                    {constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACES}
                                                </Typography>
                                            </Toolbar>
                                            <Grid container spacing={0} justify="center" className={classes.container}>
                                                <Grid item xs={12} sm={12} >
                                                    <FormTableField
                                                        className={classes.tableWrapperUPO}
                                                        name="workplaces"
                                                        head={tableHead}
                                                        allRows={initialValues.workplaces !== undefined ? initialValues.workplaces : []}
                                                        checkedRows={selectedType === 'workplace' ? selected : []}
                                                        toolbar={true}
                                                        addButtonProps={{
                                                            disabled: action === 'add',
                                                        }}
                                                        editButtonProps={{
                                                            label :constants.BUTTON_EDIT,
                                                            icon : <Edit/>,
                                                            variant: "edit",
                                                        }}
                                                        onAdd={(event) => this.handleOpenDetails(event, "add", 'workplace')}
                                                        onEdit={(event) => this.handleOpenDetails(event, 'edit', 'workplace')}
                                                        onDelete={(event) => this.handleDelete(event, 'workplace')}
                                                        multiChecked={false}
                                                        checkedColumnFirst={true}
                                                        onSelect={(row) => this.handleSelect('workplace', row)}
                                                        onDoubleClick={(row) => this.handleDoubleClick('workplace', row)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </>
                                }
                            </div>
                            <div>
                                <Divider />
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    className={classes.container}
                                >
                                    <Grid item xs={10}>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="flex-start"
                                            className={classes.containerButtons}
                                        >
                                            <Button
                                                label={constants.BUTTON_SAVE}
                                                icon=<Save />
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
                                            alignItems="flex-start"
                                            className={classes.container}
                                        >
                                            <Button
                                                label={constants.BUTTON_CLOSE}
                                                icon=<Cancel />
                                                iconAlign="left"
                                                variant="cancel"
                                                onClick={this.handleClose}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                    </form>
                }
            </>
        );
    };
};

EmploymentForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    hrNumber: PropTypes.string,
    isAuthorization: PropTypes.bool,
    isStatement: PropTypes.bool,
    employmentTypes: PropTypes.array.isRequired,
    employmentType: PropTypes.object,
    employmentStatuses: PropTypes.array.isRequired,
    places: PropTypes.array.isRequired,
    workplaces: PropTypes.array.isRequired,
    processingBases: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(EmploymentForm);