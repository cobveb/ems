package pl.viola.ems.model.modules.coordinator.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;

import java.util.List;
import java.util.Set;

@Repository
public interface CoordinatorPlanRepository extends JpaRepository<CoordinatorPlan, Long> {

    Set<CoordinatorPlan> findByCoordinatorInOrderByIdDesc(List<OrganizationUnit> organizationUnits);

    Set<CoordinatorPlan> findByYearAndCoordinatorInOrderByIdDesc(int year, List<OrganizationUnit> organizationUnits);

    CoordinatorPlan findByYearAndTypeAndCoordinatorInAndStatusIn(Integer year, CoordinatorPlan.PlanType type, List<OrganizationUnit> organizationUnits, List<CoordinatorPlan.PlanStatus> statuses);

    Set<CoordinatorPlan> findByStatusInAndCorrectionPlanIsNullOrderByIdDesc(List<CoordinatorPlan.PlanStatus> statuses);

    Set<CoordinatorPlan> findByYearAndStatusInAndCorrectionPlanIsNullOrderByIdDesc(int year, List<CoordinatorPlan.PlanStatus> statuses);

    Set<CoordinatorPlan> findByStatusInAndCorrectionPlanIsNotNullOrderByIdDesc(List<CoordinatorPlan.PlanStatus> statuses);

    Set<CoordinatorPlan> findByYearAndStatusInAndCorrectionPlanIsNotNullOrderByIdDesc(int year, List<CoordinatorPlan.PlanStatus> statuses);

    Set<CoordinatorPlan> findByStatusInAndCoordinatorInAndCorrectionPlanIsNullOrderByIdDesc(List<CoordinatorPlan.PlanStatus> statuses, Set<OrganizationUnit> coordinator);

    Set<CoordinatorPlan> findByYearAndStatusInAndCoordinatorInAndCorrectionPlanIsNullOrderByIdDesc(int year, List<CoordinatorPlan.PlanStatus> statuses, Set<OrganizationUnit> coordinator);

    Set<CoordinatorPlan> findByStatusInAndCoordinatorInAndCorrectionPlanIsNotNullOrderByIdDesc(List<CoordinatorPlan.PlanStatus> statuses, Set<OrganizationUnit> coordinator);

    Set<CoordinatorPlan> findByYearAndStatusInAndCoordinatorInAndCorrectionPlanIsNotNullOrderByIdDesc(int year, List<CoordinatorPlan.PlanStatus> statuses, Set<OrganizationUnit> coordinator);

    List<CoordinatorPlan> findByStatusInAndTypeIn(List<CoordinatorPlan.PlanStatus> statuses, List<CoordinatorPlan.PlanType> types);

    List<CoordinatorPlan> findByStatusInAndType(List<CoordinatorPlan.PlanStatus> statuses, CoordinatorPlan.PlanType type);

    Set<CoordinatorPlan> findByYearAndStatusInAndTypeAndCorrectionPlanIsNullOrderByIdDesc(int year, List<CoordinatorPlan.PlanStatus> statuses, CoordinatorPlan.PlanType type);

    Set<CoordinatorPlan> findByStatusInAndTypeAndCorrectionPlanIsNullOrderByIdDesc(List<CoordinatorPlan.PlanStatus> statuses, CoordinatorPlan.PlanType type);

    Set<CoordinatorPlan> findByStatusInAndTypeInAndCorrectionPlanIsNotNull(List<CoordinatorPlan.PlanStatus> statuses, List<CoordinatorPlan.PlanType> types);

    Set<CoordinatorPlan> findByYearAndStatusInAndTypeInAndCorrectionPlanIsNotNullOrderByIdDesc(int year, List<CoordinatorPlan.PlanStatus> statuses, List<CoordinatorPlan.PlanType> types);

    List<CoordinatorPlan> findByStatusAndTypeAndYear(CoordinatorPlan.PlanStatus status, CoordinatorPlan.PlanType type, int year);

    List<CoordinatorPlan> findByStatusInAndTypeAndYear(List<CoordinatorPlan.PlanStatus> statuses, CoordinatorPlan.PlanType type, int year);

    Set<CoordinatorPlan> findByInstitutionPlan(InstitutionPlan institutionPlan);

    Set<CoordinatorPlan> findByInstitutionPlanAndStatusNotIn(InstitutionPlan institutionPlan, List<CoordinatorPlan.PlanStatus> statuses);

}
