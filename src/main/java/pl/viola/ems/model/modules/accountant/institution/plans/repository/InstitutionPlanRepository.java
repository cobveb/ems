package pl.viola.ems.model.modules.accountant.institution.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface InstitutionPlanRepository extends JpaRepository<InstitutionPlan, Long> {

    InstitutionPlan findByYearAndType(Integer year, CoordinatorPlan.PlanType type);

    Optional<InstitutionPlan> findByYearAndTypeAndStatusIn(Integer year, CoordinatorPlan.PlanType type, List<InstitutionPlan.InstitutionPlanStatus> statuses);

    Set<InstitutionPlan> findByStatusInOrderByIdDesc(List<InstitutionPlan.InstitutionPlanStatus> status);

    Set<InstitutionPlan> findByYearAndStatusInOrderByIdDesc(Integer year, List<InstitutionPlan.InstitutionPlanStatus> status);

    Set<InstitutionPlan> findByTypeInOrderByIdDesc(List<CoordinatorPlan.PlanType> types);

    Set<InstitutionPlan> findByYearAndTypeInOrderByIdDesc(Integer year, List<CoordinatorPlan.PlanType> types);

    Set<InstitutionPlan> findByType(CoordinatorPlan.PlanType type);

    InstitutionPlan findFirstByYearAndTypeOrderByIdDesc(Integer year, CoordinatorPlan.PlanType type);

    InstitutionPlan findByCorrectionPlan(InstitutionPlan correctionPlan);
}
