package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.plans.FinancialSubPosition;

@Repository
public interface FinancialSubPositionRepository extends CoordinatorPlanSubPositionRepository<FinancialSubPosition> {
}
