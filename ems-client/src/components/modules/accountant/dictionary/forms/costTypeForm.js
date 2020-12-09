import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar}  from '@material-ui/core/';
import PropTypes from 'prop-types';
import { Button } from 'common/gui';
import { ModalDialog} from 'common/';
import * as constants from 'constants/uiNames';
import { Save, Cancel, Description, DateRangeRounded, Edit } from '@material-ui/icons/';
import { FormTextField, FormCheckBox, FormTableField } from 'common/form';
import CostYearFormContainer from 'containers/modules/accountant/dictionary/forms/costYearFormContainer';
import {findIndexElement} from 'utils/';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        width: '100%',
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    active: {
        paddingRight: theme.spacing(2),
    },
    toolbar: {
        minHeight: theme.spacing(5),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(47)}px)`,
    },
});

class CostTypeForm extends Component {
    state = {
        tableHead: [
            {
                id: 'year',
                label: constants.ACCOUNTANT_COST_TYPE_YEARS_VALIDITY_YEAR,
                type: 'date',
                dateFormat: 'yyyy',
            }
        ],
        allCoordinators: [...this.props.coordinators],
        years: this.props.initialValues.years,
        selected: [],
        openCostYearDetails: '',
        costYearAction: '',
        nextYearTmpId: this.props.initialValues.years.length+1,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleOpenCostYearDetails = (event, action) => {
        this.setState({openCostYearDetails: !this.state.openCostYearDetails, costYearAction: action});
    };

    handleCloseCostYearDetails = () => {
        this.setState({openCostYearDetails: !this.state.openCostYearDetails, selected: []});
    };

    handleSubmitYear = (values) => {
        switch(this.state.costYearAction){
            case 'add':
                values.positionId = this.state.nextYearTmpId;
                this.setState(prevState => {
                    const years = [...prevState.years];
                    const selected = [...prevState.selected];
                    let nextYearTmpId = {...prevState.nextYearTmpId};
                    let costYearAction = {...prevState.positionAction};
                    years.push(values);
                    selected[0] = values;
                    nextYearTmpId = this.state.nextYearTmpId + 1;
                    costYearAction = 'edit';
                    return {nextYearTmpId, years, selected, costYearAction};
                })
                break;
            case 'edit':
                const index = findIndexElement(values, this.state.years, "positionId")
                if (index !== null){
                    this.setState( prevState => {
                        const years = [...prevState.years];
                        const selected = [...prevState.selected];
                        years.splice(index, 1, values);
                        selected.splice(0, 1, values);
                        return {years, selected};
                    });
                }
                break;
            default:
                return null;
        }
    };

    handleConfirmDelete = () => {
        const index = findIndexElement(this.state.selected[0], this.state.years, "positionId");
        if (index !== null){
            this.setState( prevState => {
                const years = [...prevState.years];
                let selected = [...prevState.selected];
                let costYearAction = [...prevState.costYearAction];
                years.splice(index, 1);
                selected = []
                costYearAction = ''
                return {years, selected, costYearAction};
            });
        }
    }

    handleCancelDelete = () => {
        this.setState({ costYearAction: '' });
    }

    handleDeleteCostYear = (event, action) => {
        this.setState(state => ({ costYearAction: action}));
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues.years !== prevProps.initialValues.years){
            this.setState({
                years: this.props.initialValues.years,
            });
        }
        else if(JSON.stringify(this.state.allCoordinators) !== JSON.stringify(this.props.coordinators)){
            if(this.state.allCoordinators === prevState.allCoordinators){
                this.setState({
                    allCoordinators: [...this.props.coordinators],
                });
            }
        }
    }
    render(){
        const {handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, onClose, action} = this.props;
        const {selected, tableHead, years, costYearAction, openCostYearDetails, allCoordinators} = this.state;
        return(
            <>
                { costYearAction === "delete" &&
                    <ModalDialog
                        message={constants.ACCOUNTANT_CONFIRM_DELETE_YEAR_MESSAGE}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                { openCostYearDetails &&
                    <CostYearFormContainer
                        initialValues={costYearAction==="add" ? {}: selected[0]}
                        coordinators={allCoordinators}
                        years={years}
                        action={costYearAction}
                        open={openCostYearDetails}
                        onClose={this.handleCloseCostYearDetails}
                        onSubmit={this.handleSubmitYear}
                    />
                }
                <form onSubmit={handleSubmit}>
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Description className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.ACCOUNTANT_COST_TYPE_BASIC_INFORMATION}
                                </Typography>
                            </Toolbar>
                             <Grid container spacing={0} justify="flex-end"  className={classes.active}>
                                <FormCheckBox
                                    name="active"
                                    label={constants.ACCOUNTANT_COST_TYPE_ACTIVE}
                                />
                            </Grid>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="code"
                                        label={constants.ACCOUNTANT_COST_TYPE_NUMBER}
                                        isRequired={true}
                                        disabled={action === "edit" ? true : false}
                                        inputProps={{ maxLength: 12 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="name"
                                        label={constants.ACCOUNTANT_COST_TYPE_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 120 }}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <DateRangeRounded className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.ACCOUNTANT_COST_TYPE_YEARS_VALIDITY}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="years"
                                        head={tableHead}
                                        allRows={years}
                                        checkedRows={selected ? selected : []}
                                        toolbar={true}
                                        orderBy="year"
                                        editButtonProps={{
                                            label :constants.BUTTON_EDIT,
                                            icon : <Edit/>,
                                            variant: "edit",
                                        }}
                                        onAdd={(event) => this.handleOpenCostYearDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenCostYearDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDeleteCostYear(event, 'delete', )}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
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
                                icon=<Save/>
                                iconAlign="left"
                                type='submit'
                                variant="submit"
                                disabled={pristine || submitting || invalid || submitSucceeded }
                            />
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel/>
                                iconAlign="left"
                                variant="cancel"
                                onClick={onClose}
                            />
                        </Grid>
                    </div>
                </form>
            </>
        );
    };
};

CostTypeForm.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.string,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    onClose: PropTypes.func,
    coordinators: PropTypes.array,
};

export default withStyles(styles)(CostTypeForm);