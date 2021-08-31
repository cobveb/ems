package pl.viola.ems.model.modules.accountant.institution.plans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.FinancialPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Set;

@ToString(exclude = {"plan", "institutionCoordinatorPlanPositions"})
@EqualsAndHashCode(exclude = {"plan", "institutionCoordinatorPlanPositions"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "acc_institution_plan_positions", schema = "emsadm")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = FinancialPosition.class, name = "fin"),
        @JsonSubTypes.Type(value = PublicProcurementPosition.class, name = "inw"),
})
@DynamicUpdate
public abstract class InstitutionPlanPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "institutionPlanPositionSequence")
    @SequenceGenerator(name = "institutionPlanPositionSequence", sequenceName = "acc_inst_plan_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @NonNull
    @Enumerated(EnumType.STRING)
    private CoordinatorPlanPosition.PlanPositionStatus status;

    @NonNull
    @Column(name = "am_req_net")
    private BigDecimal amountRequestedNet;

    @NonNull
    @Column(name = "am_req_gross")
    private BigDecimal amountRequestedGross;

    @Column(name = "am_awa_net")
    private BigDecimal amountAwardedNet;

    @Column(name = "am_awa_gross")
    private BigDecimal amountAwardedGross;

    @NonNull
    @Column(name = "am_rea_net")
    private BigDecimal amountRealizedNet;

    @NonNull
    @Column(name = "am_rea_gross")
    private BigDecimal amountRealizedGross;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "institutionPlanPosition", cascade = {CascadeType.ALL})
    private Set<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pos_correction_id", referencedColumnName = "id")
    private InstitutionPlanPosition correctionPlanPosition;

    @JsonIgnore
    @NonNull
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private InstitutionPlan plan;

    public InstitutionPlanPosition(@NonNull CoordinatorPlanPosition.PlanPositionStatus status, @NonNull BigDecimal amountRequestedNet, @NonNull BigDecimal amountRequestedGross, BigDecimal amountAwardedNet, BigDecimal amountAwardedGross, @NonNull BigDecimal amountRealizedNet, @NonNull BigDecimal amountRealizedGross, @NonNull InstitutionPlan plan) {
        this.status = status;
        this.amountRequestedNet = amountRequestedNet;
        this.amountRequestedGross = amountRequestedGross;
        this.amountAwardedNet = amountAwardedNet;
        this.amountAwardedGross = amountAwardedGross;
        this.amountRealizedNet = amountRealizedNet;
        this.amountRealizedGross = amountRealizedGross;
        this.plan = plan;
    }

    public abstract CostType getCostType();

}
