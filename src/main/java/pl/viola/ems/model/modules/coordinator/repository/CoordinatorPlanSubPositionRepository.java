package pl.viola.ems.model.modules.coordinator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlanSubPosition;

@NoRepositoryBean
public interface CoordinatorPlanSubPositionRepository<T extends CoordinatorPlanSubPosition> extends JpaRepository<T, Long> {
}
