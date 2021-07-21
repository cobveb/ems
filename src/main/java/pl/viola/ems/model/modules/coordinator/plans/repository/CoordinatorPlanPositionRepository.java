package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import java.util.List;

@NoRepositoryBean
public interface CoordinatorPlanPositionRepository<T extends CoordinatorPlanPosition> extends JpaRepository<T, Long> {
    List<T> findByPlan(CoordinatorPlan plan);

    List<T> findByPlanIn(List<CoordinatorPlan> plans);
}
