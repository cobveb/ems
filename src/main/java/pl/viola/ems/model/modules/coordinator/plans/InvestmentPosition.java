package pl.viola.ems.model.modules.coordinator.plans;


import lombok.*;
import lombok.experimental.SuperBuilder;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.accountant.CostType;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

@EqualsAndHashCode(exclude = {"positionFundingSources"}, callSuper = false)
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@RequiredArgsConstructor
@Entity
@Table(name = "cor_investment_positions", schema = "emsadm")
public class InvestmentPosition extends CoordinatorPlanPosition {

    @Size(max = 200, message = "{valid.maxSize}")
    private String name;

    @NonNull
    @NotBlank(message = "{valid.notBlank}")
    @Size(max = 200, message = "{valid.maxSize}")
    private String task;

    @Size(max = 200, message = "{valid.maxSize}")
    private String application;

    @Size(max = 200, message = "{valid.maxSize}")
    private String substantiation;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "category_id")
    private DictionaryItem category;

    @NonNull
    @Column(name = "realization_date")
    private Date realizationDate;

    @Transient
    @NonNull
    private BigDecimal taskPositionNet;

    @Transient
    @NonNull
    private BigDecimal taskPositionGross;

    @Transient
    private BigDecimal expensesPositionAwardedNet;

    @Transient
    private BigDecimal expensesPositionAwardedGross;

    @Transient
    private BigDecimal realizedPositionNet;

    @Transient
    private BigDecimal realizedPositionGross;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "coordinatorPlanPosition", cascade = {CascadeType.ALL})
    @ToString.Exclude
    private List<FundingSource> positionFundingSources;

    public BigDecimal getTaskPositionNet() {
        return this.getTaskPositionGross().divide(this.getVat(), 2, RoundingMode.HALF_EVEN);
    }

    public BigDecimal getTaskPositionGross() {
        return sumFoundingPositionsAmount("task");
    }

    @Override
    public BigDecimal getAmountRequestedNet() {
        return this.getAmountRequestedGross().divide(this.getVat(), 2, RoundingMode.HALF_EVEN);
    }

    @Override
    public @NonNull BigDecimal getAmountRequestedGross() {

        return sumFoundingPositionsAmount("expenses");
    }

    public BigDecimal getExpensesPositionAwardedNet() {
        return this.getExpensesPositionAwardedGross().divide(this.getVat(), 2, RoundingMode.HALF_EVEN);
    }

    @Override
    public BigDecimal getExpensesPositionAwardedGross() {

        return sumFoundingPositionsAmount("awarded");
    }

    private BigDecimal sumFoundingPositionsAmount(String typeAmount) {
        BigDecimal positionAmount = new BigDecimal(0);
        for (FundingSource source : positionFundingSources) {
            switch (typeAmount) {
                case "task":
                    positionAmount = positionAmount.add(source.getSourceAmountGross());
                    break;
                case "expenses":
                    positionAmount = positionAmount.add(source.getSourceExpensesPlanGross());
                    break;
                case "awarded":
                    if (source.getSourceExpensesPlanAwardedGross() != null) {
                        positionAmount = positionAmount.add(source.getSourceExpensesPlanAwardedGross());
                    }
                    break;
            }
        }
        return positionAmount;

    }

    @Override
    public CostType getCostType() {
        return null;
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
    public BigDecimal getAmountInferredGross() {
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

}
