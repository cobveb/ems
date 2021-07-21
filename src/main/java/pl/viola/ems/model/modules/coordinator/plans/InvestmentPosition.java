package pl.viola.ems.model.modules.coordinator.plans;


import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"foundingSources"})
@EqualsAndHashCode(exclude = {"foundingSources"}, callSuper = true)
@NoArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "cor_investment_positions", schema = "emsadm")
public class InvestmentPosition extends CoordinatorPlanPosition {

    private String task;

    private String application;

    private String substantiation;

    @Transient
    @NonNull
    private BigDecimal expensesPlanNet;

    @Transient
    @NonNull
    private BigDecimal expensesPlanGross;

    @Transient
    private BigDecimal realizedPlanNet;

    @Transient
    private BigDecimal realizedPlanGross;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "investmentPosition", cascade = {CascadeType.ALL})
    private Set<FundingSource> foundingSources = new HashSet<>();

    public BigDecimal getExpensesPlanGross() {
        return this.expensesPlanGross = expensesPlanNet.multiply(this.getVat()).setScale(2, RoundingMode.HALF_EVEN);
    }

    public BigDecimal getExpensesPlanNet() {
        return this.expensesPlanNet = sumFoundingPositionsAmount("expenses");
    }

    @Override
    public @NonNull BigDecimal getAmountRequestedNet() {

        super.setAmountRequestedNet(sumFoundingPositionsAmount("requested"));
        return super.getAmountRequestedNet();
    }

    private BigDecimal sumFoundingPositionsAmount(String typeAmount) {
        BigDecimal planAmountNet = new BigDecimal(0);
        for (FundingSource source : foundingSources) {
            switch (typeAmount) {
                case "requested":
                    planAmountNet = planAmountNet.add(source.getSourceAmountRequestedNet());
                    break;
                case "expenses":
                    planAmountNet = planAmountNet.add(source.getSourceExpensesPlanNet());
            }
        }
        return planAmountNet;

    }
}
