package pl.viola.ems.model.modules.coordinator.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.FinancialSubPosition;

@Repository
public interface FinancialSubPositionRepository extends CoordinatorPlanSubPositionRepository<FinancialSubPosition> {
}
