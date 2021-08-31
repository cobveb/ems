package pl.viola.ems.model.modules.accountant.institution.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import java.util.List;

@Repository
public interface InstitutionCoordinatorPlanPositionRepository extends JpaRepository<InstitutionCoordinatorPlanPosition, Long> {
    List<InstitutionCoordinatorPlanPosition> findByInstitutionPlanPosition(InstitutionPlanPosition institutionPlanPosition);

    InstitutionCoordinatorPlanPosition findByCoordinatorPlanPosition(CoordinatorPlanPosition coordinatorPlanPosition);
}
