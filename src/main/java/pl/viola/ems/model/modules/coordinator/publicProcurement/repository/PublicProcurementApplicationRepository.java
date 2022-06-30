package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;

import java.util.List;
import java.util.Set;

@Repository
public interface PublicProcurementApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCoordinatorIn(List<OrganizationUnit> organizationUnits);

    List<Application> findByStatusIn(List<Application.ApplicationStatus> statuses);

    List<Application> findByStatusInAndCoordinatorIn(List<Application.ApplicationStatus> statuses, Set<OrganizationUnit> organizationUnits);
//    Set<Application> findByStatusInAndCoordinatorIn(List<Application.ApplicationStatus> statuses, Set<OrganizationUnit> organizationUnits);

    List<Application> findByEstimationTypeAndApplicationProtocolIsNotNull(PublicProcurementPosition.EstimationType estimationType);

    @Procedure(name = "publicProcurementGenerateApplicationNumber")
    String generateApplicationNumber(@Param("p_coordinator") String coordinator, @Param("p_mode") String mode, @Param("p_estimation_type") String estimation_type);
}
