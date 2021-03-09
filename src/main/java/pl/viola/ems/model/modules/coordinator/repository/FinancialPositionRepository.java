package pl.viola.ems.model.modules.coordinator.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.FinancialPosition;

@Repository
public interface FinancialPositionRepository extends CoordinatorPlanPositionRepository<FinancialPosition> {
}
