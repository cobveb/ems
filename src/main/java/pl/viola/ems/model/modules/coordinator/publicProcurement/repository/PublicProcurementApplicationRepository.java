package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface PublicProcurementApplicationRepository extends JpaRepository<Application, Long>, PublicProcurementApplicationCustomRepository {
    Set<Application> findByCoordinatorIn(List<OrganizationUnit> organizationUnits);

    Set<Application> findByCreateDateBetweenAndCoordinatorIn(Date createDateFrom, Date createDateTo, List<OrganizationUnit> organizationUnits);

    Set<Application> findByStatusIn(List<Application.ApplicationStatus> statuses);

    Set<Application> findByCreateDateBetweenAndStatusIn(Date createDateFrom, Date createDateTo, List<Application.ApplicationStatus> statuses);

    Set<Application> findByStatusInAndCoordinatorIn(List<Application.ApplicationStatus> statuses, Set<OrganizationUnit> organizationUnits);

    Set<Application> findByCreateDateBetweenAndStatusInAndCoordinatorIn(Date createDateFrom, Date createDateTo, List<Application.ApplicationStatus> statuses, Set<OrganizationUnit> organizationUnits);

    List<Application> findByEstimationTypeAndApplicationProtocolIsNotNull(PublicProcurementPosition.EstimationType estimationType);

    Set<Application> findBySendDateBetweenAndEstimationTypeAndApplicationProtocolIsNotNull(Date sendDateFrom, Date sendDateTo, PublicProcurementPosition.EstimationType estimationType);

    @Procedure(name = "publicProcurementGenerateApplicationNumber")
    String generateApplicationNumber(@Param("p_coordinator") String coordinator, @Param("p_mode") String mode, @Param("p_estimation_type") String estimation_type);
}



