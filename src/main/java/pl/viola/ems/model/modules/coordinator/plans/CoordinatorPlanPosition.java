package pl.viola.ems.model.modules.coordinator.plans;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.common.dictionary.DictItem;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.accountant.CostType;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ToString(exclude = {"plan", "subPositions"})
@EqualsAndHashCode(exclude = {"plan", "subPositions"})
@Data

@NoArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "cor_plan_positions", schema = "emsadm")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = FinancialPosition.class, name = "fin"),
        @JsonSubTypes.Type(value = PublicProcurementPosition.class, name = "pzp"),
        @JsonSubTypes.Type(value = InvestmentPosition.class, name = "inw"),
})
@DynamicUpdate
public abstract class CoordinatorPlanPosition implements Serializable, DictItem {

    public enum PlanPositionStatus {
        ZP, WY, UZ, ZA, SK, RE, ZR, AA, KR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "coordinatorPlanPositionSequence")
    @SequenceGenerator(name = "coordinatorPlanPositionSequence", sequenceName = "cor_plan_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Enumerated(EnumType.STRING)
    private PlanPositionStatus status;

    @Column(name = "am_req_net")
    private BigDecimal amountRequestedNet;

    @Column(name = "am_req_gross")
    private BigDecimal amountRequestedGross;

    @Column(name = "am_awa_net")
    private BigDecimal amountAwardedNet;

    @Column(name = "am_awa_gross")
    private BigDecimal amountAwardedGross;

    @Column(name = "am_rea_net")
    private BigDecimal amountRealizedNet;

    @Column(name = "am_rea_gross")
    private BigDecimal amountRealizedGross;

    @NonNull
    private BigDecimal vat;

    @Column(name = "desc_coordinator")
    @Size(max = 250, message = "{valid.maxSize}")
    private String coordinatorDescription;

    @Column(name = "desc_management")
    @Size(max = 250, message = "{valid.maxSize}")
    private String managementDescription;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private CoordinatorPlan plan;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "pos_correction_id", referencedColumnName = "id")
    private CoordinatorPlanPosition correctionPlanPosition;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "planPosition", cascade = {CascadeType.ALL}, orphanRemoval = true)
    private Set<CoordinatorPlanSubPosition> subPositions = new HashSet<>();

    public BigDecimal getAmountRequestedGross() {
        if (!this.plan.getType().equals(CoordinatorPlan.PlanType.FIN)) {
            if (!this.subPositions.isEmpty()) {
                this.setAmountRequestedGross(this.getSubPositions().stream().map(CoordinatorPlanSubPosition::getAmountGross).reduce(BigDecimal.ZERO, BigDecimal::add));
            }
        }
        return this.amountRequestedGross;
    }

    public void removeSubPosition(CoordinatorPlanSubPosition subPosition) {
        subPositions.remove(subPosition);
    }

    public abstract CostType getCostType();

    public abstract PublicProcurementPosition.EstimationType getEstimationType();

    public abstract PublicProcurementPosition.OrderType getOrderType();

    public abstract String getInitiationTerm();

    public abstract BigDecimal getEuroExchangeRate();

    public abstract BigDecimal getAmountRequestedEuroNet();

    public abstract BigDecimal getAmountInferredNet();

    public abstract void setAmountInferredNet(BigDecimal amountInferredNet);

    public abstract BigDecimal getAmountInferredGross();

    public abstract void setAmountInferredGross(BigDecimal amountInferredGross);

    public abstract BigDecimal getExpensesPositionAwardedNet();

    public abstract BigDecimal getExpensesPositionAwardedGross();

    public abstract DictionaryItem getMode();

    public abstract DictionaryItem getAssortmentGroup();

    public abstract List<FundingSource> getPositionFundingSources();

    public abstract void setPositionFundingSources(List<FundingSource> fundingSources);

    public abstract DictionaryItem getCategory();

    public abstract String getName();

    public abstract String getTask();

    public abstract String getApplication();

    public abstract String getSubstantiation();

    public abstract Date getRealizationDate();

    public abstract BigDecimal getTaskPositionNet();

    public abstract BigDecimal getTaskPositionGross();

    public abstract BigDecimal getRealizedPositionNet();

    public abstract BigDecimal getRealizedPositionGross();
}
