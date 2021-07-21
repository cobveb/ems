package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;

import java.util.List;

@Repository
public interface PublicProcurementApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCoordinatorIn(List<OrganizationUnit> organizationUnits);

    @Procedure(name = "publicProcurementGenerateApplicationNumber")
    String generateApplicationNumber(@Param("coordinator") String coordinator, @Param("application_mode") String mode);
}
