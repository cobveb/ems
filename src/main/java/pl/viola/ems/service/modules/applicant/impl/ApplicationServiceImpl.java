package pl.viola.ems.service.modules.applicant.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.applicant.ApplicantApplication;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;
import pl.viola.ems.model.modules.applicant.repository.ApplicationPositionRepository;
import pl.viola.ems.model.modules.applicant.repository.ApplicationRepository;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.applicant.ApplicationService;

import java.util.*;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    OrganizationUnitService organizationUnitService;

    @Autowired
    ApplicationPositionRepository applicationPositionRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public List<ApplicantApplication> findByApplicant(final User principal) {

        List<OrganizationUnit> organizationUnits = new ArrayList<>();
        organizationUnits.add(
                principal.getOrganizationUnit()
        );

        findChildOu(organizationUnits.get(0).getCode(), organizationUnits);

        return applicationRepository.findByApplicantIn(organizationUnits);
    }

    @Override
    public List<ApplicantApplication> findByCoordinator(final User principal) {

        List<OrganizationUnit> coordinators = new ArrayList<>();
        coordinators.add(organizationUnitService.findCoordinatorByCode(
                principal.getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Applicant.coordinator.notFound", HttpStatus.NOT_FOUND)));

        findChildOu(coordinators.get(0).getCode(), coordinators);

        return applicationRepository.findByCoordinatorIn(coordinators);
    }


    @Override
    public List<ApplicationPosition> findPositionsByApplication(Long applicationId) {
        return applicationPositionRepository.findByApplication(applicationRepository.findById(applicationId));
    }


    @Override
    @Transactional
    public ApplicantApplication saveApplication(final ApplicantApplication application, final String action, final User principal) {
        ApplicantApplication currentApplication = application;
        switch (action) {
            case "add": {
                OrganizationUnit applicant = principal.getOrganizationUnit();
                currentApplication.setApplicant(applicant);
                currentApplication.setNumber(applicationRepository.generateApplicationNumber(applicant.getCode()));
                currentApplication.setCreateDate(new Date());
                currentApplication = applicationRepository.save(currentApplication);
                break;
            }
            case "edit": {
                saveApplicationPositions(currentApplication);
                currentApplication = applicationRepository.save(currentApplication);
                break;
            }
            default: {
                throw new AppException("Applicant.application.invalidAction", HttpStatus.BAD_REQUEST);
            }
        }
        return currentApplication;
    }

    @Override
    @Transactional
    public ApplicantApplication updateApplicationStatus(final Long applicationId, final String newStatus) {
        List<String> status = Arrays.asList("WY", "ZP");
        if (newStatus == null || !status.contains(newStatus)) {
            throw new AppException("Applicant.application.invalidStatus", HttpStatus.BAD_REQUEST);
        }

        ApplicantApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Applicant.application.notFound", HttpStatus.NOT_FOUND));
        application.getPositions().forEach(position -> position.setStatus(newStatus));
        application.setStatus(newStatus);
        application.setSendDate(newStatus.equals("WY") ? new Date() : null);
        applicationRepository.save(application);

        return application;
    }

    @Override
    @Transactional
    public String deleteApplication(Long applicationId) {
        boolean exists = applicationRepository.existsById(applicationId);
        if (exists) {
            applicationRepository.deleteById(applicationId);
            return messageSource.getMessage("Applicant.application.deleteMsg", null, Locale.getDefault());

        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "Applicant.application.notFound");
        }
    }

    private void findChildOu(final String parent, final List<OrganizationUnit> organizationUnits) {

        List<OrganizationUnit> childOrganizationUnits = new ArrayList<>(organizationUnitService.findByParent(parent));

        if (!childOrganizationUnits.isEmpty()) {
            organizationUnits.addAll(childOrganizationUnits);
            childOrganizationUnits.forEach(ou ->
                    findChildOu(ou.getCode(), organizationUnits)
            );
        }
    }

    private void saveApplicationPositions(ApplicantApplication application) {
        Set<ApplicationPosition> positions = application.getPositions();
        applicationPositionRepository.deleteAll(applicationPositionRepository.findByApplication(Optional.of(application)));
        positions.forEach(position -> {
            position.setApplication(application);
            position.setStatus("ZP");
        });
        application.setPositions(positions);
    }
}
