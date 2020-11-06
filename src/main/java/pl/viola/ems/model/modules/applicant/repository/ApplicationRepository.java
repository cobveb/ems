package pl.viola.ems.model.modules.applicant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.applicant.Application;

import java.util.Date;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantIn(List<OrganizationUnit> organizationUnits);

    List<Application> findByCoordinatorIn(List<OrganizationUnit> organizationUnits);

    Application findTopByApplicantAndCreateDateBetweenOrderByIdDesc(OrganizationUnit applicant, Date startDate, Date stopDate);

    @Procedure(name = "generateApplicationNumber")
    String generateApplicationNumber(@Param("applicant") String applicant);

}
