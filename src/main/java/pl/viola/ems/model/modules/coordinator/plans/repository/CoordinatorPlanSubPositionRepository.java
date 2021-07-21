package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanSubPosition;

import java.util.List;

@NoRepositoryBean
public interface CoordinatorPlanSubPositionRepository<T extends CoordinatorPlanSubPosition> extends JpaRepository<T, Long> {
    List<T> findByPlanPosition(CoordinatorPlanPosition planPosition);
}
