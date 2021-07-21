package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;

import java.util.List;
import java.util.Set;

@Repository
public interface CoordinatorPlanRepository extends JpaRepository<CoordinatorPlan, Long> {

    List<CoordinatorPlan> findByCoordinatorIn(List<OrganizationUnit> organizationUnits);

    CoordinatorPlan findByYearAndCoordinatorInAndStatusIn(Integer year, List<OrganizationUnit> organizationUnits, List<CoordinatorPlan.PlanStatus> statuses);

    List<CoordinatorPlan> findByStatusIn(List<CoordinatorPlan.PlanStatus> statuses);

    List<CoordinatorPlan> findByStatusInAndCoordinatorIn(List<CoordinatorPlan.PlanStatus> statuses, Set<OrganizationUnit> coordinator);

    List<CoordinatorPlan> findByStatusInAndTypeIn(List<CoordinatorPlan.PlanStatus> statuses, List<CoordinatorPlan.PlanType> types);

    List<CoordinatorPlan> findByStatusInAndType(List<CoordinatorPlan.PlanStatus> statuses, CoordinatorPlan.PlanType type);

}
