package pl.viola.ems.service.modules.applicant;

import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.applicant.ApplicantApplication;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;

import java.util.List;

public interface ApplicationService {
    List<ApplicantApplication> findByApplicant(User principal);

    List<ApplicantApplication> findByCoordinator(User principal);

    List<ApplicationPosition> findPositionsByApplication(Long applicationId);

    ApplicantApplication saveApplication(ApplicantApplication application, String action, User principal);

    ApplicantApplication updateApplicationStatus(Long applicationId, String newStatus);

    String deleteApplication(Long applicationId);
}
