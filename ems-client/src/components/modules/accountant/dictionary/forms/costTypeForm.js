import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar}  from '@material-ui/core/';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import { Button } from 'common/gui';
import ModalDialog from 'common/modalDialog';
import * as constants from 'constants/uiNames';
import { Save, Cancel, Description, DateRangeRounded, Edit } from '@material-ui/icons/';
import { FormTextField, FormCheckBox, FormTableField } from 'common/form';
import CostYearFormContainer from 'containers/modules/accountant/dictionary/forms/costYearFormContainer';

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
        rows: this.props.initialValues.years,
        selected: null,
        openCostYearDetails: '',
        costYearAction: '',
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleOpenCostYearDetails = (event, action) => {
        this.setState({openCostYearDetails: !this.state.openCostYearDetails, costYearAction: action});
    };

    handleCloseCostYearDetails = () => {
            this.setState({openCostYearDetails: !this.state.openCostYearDetails, selected: null});
        };

    handleConfirmDelete = () => {
        /*const index = this.findIndex(this.state.selected[0], this.state.positions);
        if (index !== null){
            this.setState( prevState => {
                const positions = [...prevState.positions];
                let selected = [...prevState.selected];
                let positionAction = [...prevState.positionAction];
                positions.splice(index, 1);
                selected = []
                positionAction = ''
                this.props.handlePositions(positions);
                return {positions, selected, positionAction};
            });
        }*/
        console.log("confirm delete")
    }

    handleCancelDelete = () => {
        this.setState({ costYearAction: '' });
    }

    handleDeleteCostYear = (event, action) => {
        this.setState(state => ({ costYearAction: action}));
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues.years !== prevProps.initialValues.years){
            this.setState({
                rows: this.props.initialValues.years,
            });
        }
    }
    render(){
        const {classes, error, onSubmit, pristine, submitting, invalid, submitSucceeded, onClose, action, coordinators} = this.props;
        const {selected, tableHead, rows, costYearAction, openCostYearDetails} = this.state;

        return(
            <>
                {error && <ModalDialog message={error} variant="error"/>}
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
                        coordinators={coordinators}
                        years={rows}
                        action={costYearAction}
                        open={openCostYearDetails}
                        onClose={this.handleCloseCostYearDetails}
                        onSubmit={this.handleSubmitYear}
                    />
                }
                <form onSubmit={onSubmit}>
                    {submitting && <Spinner />}
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
                                        name="number"
                                        label={constants.ACCOUNTANT_COST_TYPE_NUMBER}
                                        isRequired={true}
                                        disabled={action === "edit" ? true : false}
                                        inputProps={{ maxLength: 12 }}
                                    />
                                </Grid>
                                {/*TODO: Ustwić maksymalną ilosc znaków dla pola Nazwa*/}
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="name"
                                        label={constants.ACCOUNTANT_COST_TYPE_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 30 }}
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
                                        allRows={rows}
                                        checkedRows={selected ? selected : []}
                                        toolbar={true}
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