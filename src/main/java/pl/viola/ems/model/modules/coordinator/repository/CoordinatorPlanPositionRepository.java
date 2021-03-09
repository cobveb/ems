package pl.viola.ems.model.modules.coordinator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlanPosition;

import java.util.List;

@NoRepositoryBean
public interface CoordinatorPlanPositionRepository<T extends CoordinatorPlanPosition> extends JpaRepository<T, Long> {
    List<T> findByPlan(CoordinatorPlan plan);

}
