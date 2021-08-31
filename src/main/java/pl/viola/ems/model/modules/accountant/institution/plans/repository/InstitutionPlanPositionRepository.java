package pl.viola.ems.model.modules.accountant.institution.plans.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;

@Repository
public interface InstitutionPlanPositionRepository extends JpaRepository<InstitutionPlanPosition, Long> {

}
