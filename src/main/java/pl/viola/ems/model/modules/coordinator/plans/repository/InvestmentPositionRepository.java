package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.plans.InvestmentPosition;

@Repository
public interface InvestmentPositionRepository extends CoordinatorPlanPositionRepository<InvestmentPosition> {
}
