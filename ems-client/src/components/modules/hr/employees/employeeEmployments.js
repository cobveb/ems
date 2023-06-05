import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { ModalDialog, Spinner} from 'common/';
import { Table, Button } from 'common/gui';
import { Work, Cancel, Add, Edit, Delete } from '@material-ui/icons/';
import EmploymentFormContainer from 'containers/modules/hr/employees/forms/employmentFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(25.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
    },
    containerButtons: {
        maxWidth: '100%',
        paddingLeft: theme.spacing(10),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(39.8)}px)`,
    },
});

class EmployeeEmployments extends Component {

    state = {
        tableHead: [
            {
                id: 'employmentType.name',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_CONTRACT_TYPE,
                type: 'object',
            },
            {
                id: 'dateFrom',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_EMPLOYMENT_DATE_FROM,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'dateTo',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_EMPLOYMENT_DATE_TO,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'status.name',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATUS,
                type: 'object',
            },
            {
                id: 'isActive',
                label: constants.EMPLOYEE_EMPLOYMENT_DETAILS_ACTIVE,
                type: 'boolean',
            }
        ],
        rows: [],
        selected: null,
        openEmploymentDetails: false,
        openDetailsAction: null,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) => {
        this.setState({
            selected: row,
            openEmploymentDetails: !this.state.openEmploymentDetails,
            openDetailsAction: 'edit',
        });
        this.props.getEmploymentDetails(row)
    }

    handleOpenEmploymentDetails = (event, action) => {
        this.setState({openEmploymentDetails: !this.state.openEmploymentDetails, openDetailsAction: action});
        if(action === 'edit'){
            this.props.getEmploymentDetails(this.state.selected)
        }
    };

    handleCloseEmploymentDetails = () => {
        this.setState({openEmploymentDetails: !this.state.openEmploymentDetails, openDetailsAction: null, selected: null});
    };

    handleDeleteEmployment = () =>{
        this.setState(state => ({ openDetailsAction: "delete"}));
    }

    handleConfirmDelete = () => {
        this.props.onDeleteEmployment(this.state.selected);
        this.setState({
            openDetailsAction: null,
            selected: null,
        });
    }

    handleCloseDialog = () =>{
        this.setState(state => ({
                openDetailsAction: null,
            })
        );
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState(prevState => {
                let rows = [...prevState.rows];
                rows = this.props.initialValues;
                return {rows}
            });
        }
        if(this.props.employment !== null && this.props.employment !== prevProps.employment){
             /* If submit employment on add action */
            this.setState(prevState => {
                let selected = {...prevState.selected};
                let openDetailsAction = prevState.openDetails;
                selected = this.props.employment;
                openDetailsAction = 'edit';
                return {selected, openDetailsAction}
            });
        } else if(this.state.selected && this.props.employment === null){
            /* If submit employment on edit action */
            const idx = this.props.initialValues.findIndex(employment => employment.id === this.state.selected.id);
            if(idx !== null && this.state.selected !== this.props.initialValues[idx]){
                this.setState(prevState => {
                    let selected = {...prevState.selected};
                    selected = this.props.initialValues[idx];
                    return {selected}
                });
            }
        }
    }

    render(){
        const { classes, onClose, isLoading } = this.props;
        const { tableHead, rows, selected, openEmploymentDetails, openDetailsAction } = this.state;
        return(
            <>
                { isLoading && <Spinner /> }
                {openDetailsAction === "delete" &&
                    <ModalDialog
                        message={constants.EMPLOYEE_EMPLOYMENTS_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                { openEmploymentDetails ?
                    <EmploymentFormContainer
                        initialValues={openDetailsAction==="add" ? {isActive: true, status: this.props.employmentStatuses[0]}: selected}
                        hrNumber={this.props.hrNumber}
                        employmentTypes={this.props.employmentTypes}
                        employmentStatuses={this.props.employmentStatuses}
                        places={this.props.places}
                        workplaces={this.props.workplaces}
                        processingBases={this.props.processingBases}
                        action={openDetailsAction}
                        onClose={this.handleCloseEmploymentDetails}
                        onSubmit={(values) => this.props.onSubmitEmployment(values, openDetailsAction)}
                        onSubmitEmploymentDetail={this.props.onSubmitEmploymentDetail}
                        onDeleteEmploymentDetail={this.props.onDeleteEmploymentDetail}
                    />
                :
                    <>
                        <div className={classes.content}>
                            <div className={classes.section}>
                                <Toolbar className={classes.toolbar}>
                                    <Work className={classes.subHeaderIcon} fontSize="small" />
                                    <Typography variant="subtitle1" >
                                        {constants.EMPLOYEE_EMPLOYMENTS_PERIODS}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={0} justify="center" className={classes.container}>
                                    <Grid item xs={12} sm={12} >
                                        <Table
                                            className={classes.tableWrapper}
                                            name="employments"
                                            headCells={tableHead}
                                            rows={rows}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            rowKey="id"
                                            defaultOrderBy="id"
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
                                justify="flex-end"
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
                                            label={constants.BUTTON_ADD}
                                            icon=<Add/>
                                            iconAlign="right"
                                            variant="add"
                                            onClick = { (event) => this.handleOpenEmploymentDetails(event, 'add', )}
                                            data-action="add"
                                        />
                                        <Button
                                            label={constants.BUTTON_EDIT}
                                            icon=<Edit/>
                                            iconAlign="right"
                                            disabled={selected === null}
                                            variant="edit"
                                            onClick = { (event) => this.handleOpenEmploymentDetails(event, 'edit', )}
                                            data-action="edit"
                                        />
                                        <Button
                                            label={constants.BUTTON_DELETE}
                                            icon=<Delete/>
                                            iconAlign="right"
                                            disabled={selected === null}
                                            onClick = {this.handleDeleteEmployment}
                                            variant="delete"
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
                                            onClick={onClose}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </>
                }
            </>
        );
    };
};

EmployeeEmployments.propTypes = {
	classes: PropTypes.object.isRequired,
	hrNumber: PropTypes.string,
	isLoading: PropTypes.bool,
    getEmploymentDetails: PropTypes.func,
    employmentTypes:PropTypes.array,
    employmentStatuses:PropTypes.array,
    processingBases: PropTypes.array,
};

export default withStyles(styles)(EmployeeEmployments);