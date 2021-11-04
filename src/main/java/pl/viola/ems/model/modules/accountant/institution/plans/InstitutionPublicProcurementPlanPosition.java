package pl.viola.ems.model.modules.accountant.institution.plans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "pub_institution_plan_pos", schema = "emsadm")
public class InstitutionPublicProcurementPlanPosition extends InstitutionPlanPosition {

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "estimation_type")
    private PublicProcurementPosition.EstimationType estimationType;

    @Enumerated(EnumType.STRING)
    @NonNull
    @Column(name = "order_type")
    private PublicProcurementPosition.OrderType orderType;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "assortment_id")
    private DictionaryItem assortmentGroup;

    public InstitutionPublicProcurementPlanPosition(CoordinatorPlanPosition.PlanPositionStatus planPositionStatus, BigDecimal amountRequestedNet, BigDecimal amountRequestedGross, InstitutionPlan institutionPublicProcurementPlan, PublicProcurementPosition.EstimationType estimationType, PublicProcurementPosition.OrderType orderType, DictionaryItem assortmentGroup) {
        super(planPositionStatus, amountRequestedNet, amountRequestedGross, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, institutionPublicProcurementPlan);
        this.estimationType = estimationType;
        this.orderType = orderType;
        this.assortmentGroup = assortmentGroup;
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

    @Override
    public CostType getCostType() {
        return null;
    }

}
