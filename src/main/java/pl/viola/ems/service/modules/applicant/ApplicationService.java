package pl.viola.ems.service.modules.applicant;

import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.applicant.Application;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;

import java.util.List;

public interface ApplicationService {
    List<Application> findByApplicant(User principal);

    List<Application> findByCoordinator(User principal);

    List<ApplicationPosition> findPositionsByApplication(Long applicationId);

    Application saveApplication(Application application, String action, User principal);

    Application updateApplicationStatus(Long applicationId, String newStatus);

    String deleteApplication(Long applicationId);
}
