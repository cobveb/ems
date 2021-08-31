package pl.viola.ems.service.modules.accountant.institution;

import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.FinancialPosition;

import java.util.List;

public interface InstitutionPlanService {

    List<InstitutionPlan> getPlans();

    InstitutionPlan getPlan(Long planId);

    List<InstitutionCoordinatorPlanPosition> getCoordinatorPlanPositions(Long positionId);

    List<InstitutionCoordinatorPlanPosition> updatePlanPositions(List<InstitutionCoordinatorPlanPosition> positions, CoordinatorPlan.PlanType planType, Long positionId, String action);

    void updateInstitutionPlan(CoordinatorPlan coordinatorPlan, String action);

    void updateInstitutionPlanPositions(List<FinancialPosition> positions);

    InstitutionPlan updatePlanStatus(Long planId, String action);
}
