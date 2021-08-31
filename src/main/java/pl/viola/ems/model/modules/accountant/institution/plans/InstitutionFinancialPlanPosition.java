package pl.viola.ems.model.modules.accountant.institution.plans;

import lombok.*;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@ToString(exclude = {"costType"})
@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "acc_institution_plan_pos_fin", schema = "emsadm")
public class InstitutionFinancialPlanPosition extends InstitutionPlanPosition {


    @NonNull
    @ManyToOne
    @JoinColumn(name = "cost_type_id")
    private CostType costType;


    public InstitutionFinancialPlanPosition(CoordinatorPlanPosition.PlanPositionStatus planPositionStatus, BigDecimal amountRequestedNet, BigDecimal amountRequestedGross, BigDecimal amountAwardedNet, BigDecimal amountAwardedGross, BigDecimal amountRealizedNet, BigDecimal amountRealizedGross, InstitutionPlan institutionPlan, CostType costType) {
        super(planPositionStatus, amountRequestedNet, amountRequestedGross, amountAwardedNet, amountAwardedGross, amountRealizedNet, amountRealizedGross, institutionPlan);
        this.costType = costType;
    }

    public InstitutionFinancialPlanPosition(CoordinatorPlanPosition.PlanPositionStatus planPositionStatus, BigDecimal amountRequestedNet, BigDecimal amountRequestedGross, InstitutionPlan institutionPlan, CostType costType) {
        super(planPositionStatus, amountRequestedNet, amountRequestedGross, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, institutionPlan);
        this.costType = costType;
    }

    @Override
    public Set<InstitutionCoordinatorPlanPosition> getInstitutionCoordinatorPlanPositions() {
        return super.getInstitutionCoordinatorPlanPositions();
    }

    @Override
    public void setInstitutionCoordinatorPlanPositions(Set<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions) {
        super.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));
    }

    @Override
    public InstitutionPlanPosition getCorrectionPlanPosition() {
        return super.getCorrectionPlanPosition();
    }

    @Override
    public void setCorrectionPlanPosition(InstitutionPlanPosition correctionPlanPosition) {
        super.setCorrectionPlanPosition(correctionPlanPosition);
    }

}