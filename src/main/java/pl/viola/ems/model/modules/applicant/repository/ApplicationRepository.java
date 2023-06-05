package pl.viola.ems.model.modules.applicant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.applicant.ApplicantApplication;

import java.util.Date;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicantApplication, Long> {

    List<ApplicantApplication> findByApplicantIn(List<OrganizationUnit> organizationUnits);

    List<ApplicantApplication> findByCoordinatorIn(List<OrganizationUnit> organizationUnits);

    ApplicantApplication findTopByApplicantAndCreateDateBetweenOrderByIdDesc(OrganizationUnit applicant, Date startDate, Date stopDate);

    @Procedure(name = "generateApplicationNumber")
    String generateApplicationNumber(@Param("applicant") String applicant);

}
