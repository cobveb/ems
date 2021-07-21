package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;

import java.util.List;

@Repository
public interface PublicProcurementPositionRepository extends CoordinatorPlanPositionRepository<PublicProcurementPosition> {
    List<PublicProcurementPosition> findByPlanIn(List<CoordinatorPlan> plans);
}
