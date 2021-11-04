package pl.viola.ems.model.modules.coordinator.plans;

import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.accountant.CostType;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
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
    public BigDecimal getAmountInferredGross() {
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

}
