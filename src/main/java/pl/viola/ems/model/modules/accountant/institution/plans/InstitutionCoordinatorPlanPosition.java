package pl.viola.ems.model.modules.accountant.institution.plans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.jetbrains.annotations.NotNull;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import javax.persistence.*;
import java.math.BigDecimal;

@ToString(exclude = {"institutionPlanPosition"})
@EqualsAndHashCode(exclude = {"institutionPlanPosition"})
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Data
@Entity
@Table(name = "acc_institution_plan_cor_pos", schema = "emsadm")
public class InstitutionCoordinatorPlanPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "institutionCoordinatorPlanPositionSequence")
    @SequenceGenerator(name = "institutionCoordinatorPlanPositionSequence", sequenceName = "acc_inst_plan_cor_pos_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Transient
    BigDecimal amountAwardedNet;

    @Transient
    BigDecimal amountAwardedGross;

    @NonNull
    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "cor_position_id", referencedColumnName = "id")
    private CoordinatorPlanPosition coordinatorPlanPosition;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pos_correction_id", referencedColumnName = "id")
    private InstitutionCoordinatorPlanPosition correctionPlanCoordinatorPosition;

    @JsonIgnore
    @NonNull
    @ManyToOne
    @JoinColumn(name = "institution_position_id")
    private InstitutionPlanPosition institutionPlanPosition;

    public CoordinatorPlanPosition.@NotNull PlanPositionStatus getPositionStatus() {
        return this.coordinatorPlanPosition.getStatus();
    }

    public Long getPlanId() {
        return this.coordinatorPlanPosition.getPlan().getId();
    }

    public String getPlanStatus() {
        return this.coordinatorPlanPosition.getPlan().getStatus().name();
    }

    public String getCoordinatorName() {
        return this.coordinatorPlanPosition.getPlan().getCoordinator().getName();
    }

    public BigDecimal getAmountRequestedNet() {
        return this.coordinatorPlanPosition.getAmountRequestedNet();
    }

    public BigDecimal getAmountRequestedGross() {
        return this.coordinatorPlanPosition.getAmountRequestedGross();
    }

    public BigDecimal getAmountAwardedNet() {
        if (amountAwardedNet != null) {
            return amountAwardedNet;
        } else {
            return this.coordinatorPlanPosition.getAmountAwardedNet();
        }
    }

    public BigDecimal getAmountAwardedGross() {
        if (amountAwardedGross != null) {
            return amountAwardedGross;
        } else {
            return this.coordinatorPlanPosition.getAmountAwardedGross();
        }
    }

    public BigDecimal getAmountRealizedNet() {
        return this.coordinatorPlanPosition.getAmountRealizedNet();
    }

    public BigDecimal getAmountRealizedGross() {
        return this.coordinatorPlanPosition.getAmountRealizedGross();
    }

    public BigDecimal getVat() {
        return this.coordinatorPlanPosition.getVat();
    }
}
