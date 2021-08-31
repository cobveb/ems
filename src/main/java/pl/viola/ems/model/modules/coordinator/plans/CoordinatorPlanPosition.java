package pl.viola.ems.model.modules.coordinator.plans;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.accountant.CostType;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
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
})
@DynamicUpdate
public abstract class CoordinatorPlanPosition implements Serializable {

    public enum PlanPositionStatus {
        ZP, WY, ZA, SK, RE, ZR
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

    @NonNull
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private CoordinatorPlan plan;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "planPosition", cascade = {CascadeType.ALL}, orphanRemoval = true)
    private Set<CoordinatorPlanSubPosition> subPositions = new HashSet<>();

    public BigDecimal getAmountRequestedGross() {
        if (!this.subPositions.isEmpty()) {
            this.setAmountRequestedGross(this.getSubPositions().stream().map(CoordinatorPlanSubPosition::getAmountGross).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return this.amountRequestedGross;
    }

    public void removeSubPosition(CoordinatorPlanSubPosition subPosition) {
        subPositions.remove(subPosition);
    }

    public abstract CostType getCostType();
}
