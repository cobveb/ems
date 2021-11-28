package pl.viola.ems.model.modules.accountant.institution.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;

import java.util.List;

@Repository
public interface InstitutionPlanRepository extends JpaRepository<InstitutionPlan, Long> {
    InstitutionPlan findByYearAndType(Integer year, CoordinatorPlan.PlanType type);

    List<InstitutionPlan> findByStatusIn(List<InstitutionPlan.InstitutionPlanStatus> status);

    List<InstitutionPlan> findByTypeIn(List<CoordinatorPlan.PlanType> types);

    List<InstitutionPlan> findByType(CoordinatorPlan.PlanType type);
}
