import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { InputField } from 'common/gui';
import { FormTextField, FormDictionaryField, FormDigitsField, FormSelectField, FormAmountField } from 'common/form';
import { Grid } from '@material-ui/core/';


class PlanFinancialContentPosition extends Component {

    render(){
        const {initialValues, planStatus, units, costsTypes, vats} = this.props;

        return(
            <>
                <Grid item xs={4} >
                    <FormDigitsField
                        name="quantity"
                        label={constants.APPLICATION_POSITION_DETAILS_QUANTITY}
                        isRequired={true}
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormDictionaryField
                        isRequired={true}
                        name="unit"
                        dictionaryName='Jednostki miary'
                        label={constants.APPLICATION_POSITION_DETAILS_UNIT}
                        disabled={planStatus!=='ZP' && true}
                        items={units}
                    />
                </Grid>
                <Grid item xs={4} >
                    <InputField
                        name="status"
                        label={constants.APPLICATION_POSITION_DETAILS_STATUS}
                        disabled
                        value={ Object.keys(initialValues).length !== 0 && initialValues.status ? initialValues.status.name : ''}
                    />
                </Grid>
                <Grid item xs={5}>
                    <FormAmountField
                        isRequired={true}
                        name="amountRequestedNet"
                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_NET}
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
                <Grid item xs={2}>
                    <FormSelectField
                        isRequired={true}
                        name="vat"
                        label={constants.COORDINATOR_PLAN_POSITION_VAT}
                        value={initialValues.vat !== undefined ? initialValues.vat : ""}
                        options={vats}
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
                <Grid item xs={5}>
                    <FormAmountField
                        name="amountRequestedGross"
                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS}
                        disabled
                    />
                </Grid>
                <Grid item xs={6} >
                    <InputField
                        name="amountAwardedNet"
                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_NET}
                        disabled
                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                    />
                </Grid>
                <Grid item xs={6} >
                    <InputField
                        name="amountAwardedGross"
                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS}
                        disabled
                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormDictionaryField
                        isRequired={true}
                        name="costType"
                        dictionaryName={constants.ACCOUNTANT_SUBMENU_DICTIONARIES_COST_TYPES}
                        label={constants.COORDINATOR_PLAN_POSITION_FINANCIAL_COST_TYPES}
                        disabled={planStatus!=='ZP' && true}
                        items={costsTypes}
                    />
                </Grid>
                <Grid item xs={12} >
                    <FormTextField
                        name="description"
                        label={constants.COORDINATOR_PLAN_POSITION_FINANCIAL_DESCRIPTION}
                        multiline
                        rows="5"
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
            </>
        );
    };
};

PlanFinancialContentPosition.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default PlanFinancialContentPosition;
