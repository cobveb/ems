package pl.viola.ems.model.modules.accountant.institution.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;

import java.util.List;
import java.util.Set;

@Repository
public interface InstitutionCoordinatorPlanPositionRepository extends JpaRepository<InstitutionCoordinatorPlanPosition, Long> {

    List<InstitutionCoordinatorPlanPosition> findByInstitutionPlanPosition(InstitutionPlanPosition institutionPlanPosition);

    List<InstitutionCoordinatorPlanPosition> findByInstitutionPlanPositionIn(Set<InstitutionPlanPosition> planPositions);

    InstitutionCoordinatorPlanPosition findByCoordinatorPlanPosition(CoordinatorPlanPosition coordinatorPlanPosition);

    Set<InstitutionCoordinatorPlanPosition> findByCoordinatorPlanPositionIn(List<CoordinatorPlanPosition> coordinatorPlanPositions);

}
