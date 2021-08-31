package pl.viola.ems.model.modules.accountant.institution.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;

@Repository
public interface InstitutionPlanRepository extends JpaRepository<InstitutionPlan, Long> {
    InstitutionPlan findByYearAndType(Integer year, CoordinatorPlan.PlanType type);
}
