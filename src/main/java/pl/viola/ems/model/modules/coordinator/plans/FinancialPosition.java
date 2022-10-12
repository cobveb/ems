package pl.viola.ems.model.modules.coordinator.plans;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.accountant.CostType;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;


@ToString(exclude = {"costType"})
@EqualsAndHashCode(exclude = {"costType"}, callSuper = true)
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@SuperBuilder
@Entity
@Table(name = "cor_financial_positions", schema = "emsadm")
public class FinancialPosition extends CoordinatorPlanPosition {

    @ManyToOne
    @JoinColumn(name = "cost_type_id")
    private CostType costType;

    @Transient
    private BigDecimal amountCorrectGross;

    @Transient
    private BigDecimal amountAwardedCorrectGross;

    public BigDecimal getAmountCorrectGross() {
        return super.getCorrectionPlanPosition() != null ?
            super.getAmountRequestedGross().subtract(super.getCorrectionPlanPosition().getAmountAwardedGross())
                : null;
    }

    public BigDecimal getAmountAwardedCorrectGross() {
        return super.getCorrectionPlanPosition() != null ?
                super.getAmountAwardedGross() != null ?
                        super.getAmountAwardedGross().subtract(super.getCorrectionPlanPosition().getAmountAwardedGross())
                        : null
                : null;
    }

    @Override
    public PublicProcurementPosition.EstimationType getEstimationType() {
        return null;
    }

    @Override
    public PublicProcurementPosition.OrderType getOrderType() {
        return null;
    }

    @Override
    public String getInitiationTerm() {
        return null;
    }

    @Override
    public BigDecimal getEuroExchangeRate() {
        return null;
    }

    @Override
    public BigDecimal getAmountRequestedEuroNet() {
        return null;
    }

    @Override
    public BigDecimal getAmountInferredNet() {
        return null;
    }

    @Override
    public void setAmountInferredNet(BigDecimal amountInferredNet) {

    }

    @Override
    public BigDecimal getAmountInferredGross() {
        return null;
    }

    @Override
    public void setAmountInferredGross(BigDecimal amountInferredGross) {

    }

    @Override
    public BigDecimal getExpensesPositionAwardedNet() {
        return null;
    }

    @Override
    public BigDecimal getExpensesPositionAwardedGross() {
        return null;
    }

    @Override
    public DictionaryItem getMode() {
        return null;
    }

    @Override
    public DictionaryItem getAssortmentGroup() {
        return null;
    }

    @Override
    public List<FundingSource> getPositionFundingSources() {
        return null;
    }

    @Override
    public void setPositionFundingSources(List<FundingSource> fundingSources) {
    }

    @Override
    public DictionaryItem getCategory() {
        return null;
    }

    @Override
    public String getName() {
        return this.costType.getName();
    }

    @Override
    public String getTask() {
        return null;
    }

    @Override
    public String getApplication() {
        return null;
    }

    @Override
    public String getSubstantiation() {
        return null;
    }

    @Override
    public Date getRealizationDate() {
        return null;
    }

    @Override
    public BigDecimal getTaskPositionNet() {
        return null;
    }

    @Override
    public BigDecimal getTaskPositionGross() {
        return null;
    }

    @Override
    public BigDecimal getRealizedPositionNet() {
        return null;
    }

    @Override
    public BigDecimal getRealizedPositionGross() {
        return null;
    }
}
