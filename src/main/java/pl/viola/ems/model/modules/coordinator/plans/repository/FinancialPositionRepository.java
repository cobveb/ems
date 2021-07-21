package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.plans.FinancialPosition;

@Repository
public interface FinancialPositionRepository extends CoordinatorPlanPositionRepository<FinancialPosition> {
}
