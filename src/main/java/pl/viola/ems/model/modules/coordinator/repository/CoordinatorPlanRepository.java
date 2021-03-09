package pl.viola.ems.model.modules.coordinator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlan;

import java.util.List;

@Repository
public interface CoordinatorPlanRepository extends JpaRepository<CoordinatorPlan, Long> {

    List<CoordinatorPlan> findByCoordinatorIn(List<OrganizationUnit> organizationUnits);

    List<CoordinatorPlan> findByStatusInAndTypeIn(List<CoordinatorPlan.PlanStatus> statuses, List<CoordinatorPlan.PlanType> types);

}
