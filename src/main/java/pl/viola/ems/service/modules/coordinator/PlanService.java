package pl.viola.ems.service.modules.coordinator;

import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlanSubPosition;
import pl.viola.ems.payload.modules.accountant.CoordinatorPlanResponse;

import java.util.List;

public interface PlanService {
    List<CoordinatorPlan> findByCoordinator();

    <T extends CoordinatorPlanPosition> List<T> findPositionsByPlan(Long planId);

    CoordinatorPlan findPlanById(Long planId);

    CoordinatorPlan savePlan(CoordinatorPlan plan, String action, User principal);

    CoordinatorPlan updatePlanStatus(Long planId, CoordinatorPlan.PlanStatus newStatus);

    String deletePlan(Long planId);

    CoordinatorPlanPosition savePlanPosition(CoordinatorPlanPosition position, String action);

    String deletePlanPosition(Long planId, Long planPositionId);

    List<CoordinatorPlanResponse> getPlansByCoordinatorInAccountant();

    String deleteSubPosition(CoordinatorPlanSubPosition subPosition, Long positionId);

}
