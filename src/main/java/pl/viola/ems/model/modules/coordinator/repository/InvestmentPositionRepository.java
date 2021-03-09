package pl.viola.ems.model.modules.coordinator.repository;

import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.InvestmentPosition;

@Repository
public interface InvestmentPositionRepository extends CoordinatorPlanPositionRepository<InvestmentPosition> {
}
