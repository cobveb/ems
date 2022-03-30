package pl.viola.ems.service.modules.coordinator.publicProcurement.impl;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.repository.TextRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionCoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionPlanPositionRepository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.*;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.*;
import pl.viola.ems.model.modules.publicProcurement.institution.plans.InstitutionPublicProcurementPlanPosition;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.coordinator.application.*;
import pl.viola.ems.service.common.JasperPrintService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.coordinator.publicProcurement.ApplicationProtocolService;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

import static pl.viola.ems.utils.Utils.getArt30percent;

@Service
public class PublicProcurementApplicationServiceImpl implements PublicProcurementApplicationService {
    private static final Logger logger = LoggerFactory.getLogger(PublicProcurementApplicationServiceImpl.class);

    @Autowired
    OrganizationUnitService organizationUnitService;

    @Autowired
    PlanService planService;

    @Autowired
    PublicProcurementApplicationRepository publicProcurementApplicationRepository;

    @Autowired
    PublicProcurementApplicationAssortmentGroupRepository publicProcurementApplicationAssortmentGroupRepository;

    @Autowired
    PublicProcurementPartRepository publicProcurementPartRepository;

    @Autowired
    PublicProcurementCriterionRepository publicProcurementCriterionRepository;

    @Autowired
    MessageSource messageSource;

    @Autowired
    JasperPrintService jasperPrintService;

    @Autowired
    AssortmentGroupSubsequentYearRepository assortmentGroupSubsequentYearRepository;

    @Autowired
    InstitutionCoordinatorPlanPositionRepository institutionCoordinatorPlanPositionRepository;

    @Autowired
    InstitutionPlanPositionRepository institutionPlanPositionRepository;

    @Autowired
    ApplicationProtocolService applicationProtocolService;

    @Autowired
    TextRepository textRepository;

    @Autowired
    ApplicationAssortmentGroupPlanPositionRepository applicationAssortmentGroupPlanPositionRepository;


    @Override
    public List<ApplicationProcurementPlanPosition> getApplicationProcurementPlanPosition() {
        List<ApplicationProcurementPlanPosition> positions = new ArrayList<>();

        List<InstitutionPlanPosition> institutionPublicProcurementPlanPositions = new ArrayList<>();

        List<CoordinatorPlanPosition> planPositions = planService.getPlanPositionByYearAndPlanType(CoordinatorPlan.PlanType.PZP);

        List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPositionIn(planPositions);

        if (!institutionCoordinatorPlanPositions.isEmpty()) {

            institutionCoordinatorPlanPositions.forEach(institutionCoordinatorPlanPosition ->
                    institutionPublicProcurementPlanPositions.add(institutionCoordinatorPlanPosition.getInstitutionPlanPosition()));
        }

        if (!institutionPublicProcurementPlanPositions.isEmpty()) {
            institutionPublicProcurementPlanPositions.forEach(publicProcurementPosition -> {

                ApplicationProcurementPlanPosition applicationProcurementPlanPosition = new ApplicationProcurementPlanPosition(
                        publicProcurementPosition.getId(),
                        publicProcurementPosition.getAssortmentGroup().getCode(),
                        publicProcurementPosition.getAssortmentGroup().getName(),
                        publicProcurementPosition.getEstimationType().name(),
                        publicProcurementPosition.getOrderType().name(),
                        publicProcurementPosition.getAmountRequestedNet(),
                        publicProcurementPosition.getAmountRealizedNet(),
                        publicProcurementPosition.getAmountInferredNet(),
                        getArt30percent(publicProcurementPosition.getAmountRealizedNet(), publicProcurementPosition.getAmountArt30Net()),
                        publicProcurementPosition.getAmountArt30Net(),
                        publicProcurementPosition.getAmountArt30Gross()
                );
                positions.add(applicationProcurementPlanPosition);
            });
        }
        return positions;
    }

    @Override
    public List<ApplicationPlanPosition> getPlanPositionByYearAndPlanType(final CoordinatorPlan.PlanType planType) {
        List<ApplicationPlanPosition> positions = new ArrayList<>();

        List<CoordinatorPlanPosition> planPositions = planService.getPlanPositionByYearAndPlanType(planType);

        if (!planPositions.isEmpty()) {
            planPositions.forEach(planPosition -> {
                ApplicationPlanPosition applicationPlanPosition = new ApplicationPlanPosition(
                        planPosition.getId(),
                        planType.equals(CoordinatorPlan.PlanType.FIN) ? planPosition.getCostType().getCode() : planPosition.getId().toString(),
                        planType.equals(CoordinatorPlan.PlanType.FIN) ? planPosition.getCostType().getName() : planPosition.getTask(),
                        planPosition.getAmountAwardedNet(),
                        planPosition.getAmountAwardedGross()
                );
                positions.add(applicationPlanPosition);
            });
        }
        return positions;
    }

    @Override
    public List<ApplicationPayload> getApplicationsByCoordinator() {
        List<ApplicationPayload> applications = new ArrayList<>();
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        publicProcurementApplicationRepository.findByCoordinatorIn(coordinators).forEach(application -> {
            ApplicationPayload applicationPayload = new ApplicationPayload(
                    application.getId(),
                    application.getNumber(),
                    application.getOrderedObject().getContent(),
                    application.getEstimationType(),
                    application.getMode(),
                    application.getOrderValueNet(),
                    application.getStatus(),
                    application.getCoordinator()
            );
            applications.add(applicationPayload);
        });
        return applications;
    }

    @Override
    public List<ApplicationPayload> getApplicationsByAccessLevel(String accessLevel) {
        List<ApplicationPayload> applicationPayloads = new ArrayList<>();
        List<Application> applications = new ArrayList<>();

        switch (accessLevel) {
            case "public":
                applications = publicProcurementApplicationRepository.findByStatusIn(new ArrayList<>(Arrays.asList(
                        Application.ApplicationStatus.WY,
                        Application.ApplicationStatus.AZ,
                        Application.ApplicationStatus.AD,
                        Application.ApplicationStatus.AM,
                        Application.ApplicationStatus.AK,
                        Application.ApplicationStatus.ZA,
                        Application.ApplicationStatus.RE,
                        Application.ApplicationStatus.ZR,
                        Application.ApplicationStatus.AN
                )));
                break;
            case "director":
                List<Application.ApplicationStatus> statuses = Arrays.asList(
                        Application.ApplicationStatus.AZ,
                        Application.ApplicationStatus.AD,
                        Application.ApplicationStatus.AM,
                        Application.ApplicationStatus.AK,
                        Application.ApplicationStatus.ZA,
                        Application.ApplicationStatus.RE,
                        Application.ApplicationStatus.ZR,
                        Application.ApplicationStatus.AN
                );

                if (Utils.getCurrentUser().getOrganizationUnit().getRole().equals(OrganizationUnit.Role.DIRECTOR) && Utils.getCurrentUser().getOrganizationUnit().getCode().equals("dyrm")) {
                    applications = publicProcurementApplicationRepository.findByStatusIn(statuses);
                    applications = applications.stream().filter(application -> ((application.getOrderIncludedPlanType().equals(CoordinatorPlan.PlanType.INW) &&
                                    application.getCoordinator().getCode().equals("dam")) || Utils.getCurrentUser().getOrganizationUnit().getDirectorCoordinators().contains(application.getCoordinator())))
                            .collect(Collectors.toList());
                } else if (Utils.getCurrentUser().getOrganizationUnit().getRole().equals(OrganizationUnit.Role.DIRECTOR) || Utils.getCurrentUser().getOrganizationUnit().getRole().equals(OrganizationUnit.Role.ECONOMIC)) {
                    applications = publicProcurementApplicationRepository.findByStatusInAndCoordinatorIn(statuses, Utils.getCurrentUser().getOrganizationUnit().getDirectorCoordinators());
                } else if (Utils.getCurrentUser().getOrganizationUnit().getRole().equals(OrganizationUnit.Role.CHIEF) ||
                        Utils.getCurrentUser().getGroups().stream().anyMatch(group -> group.getCode().equals("admin"))) {
                    applications = publicProcurementApplicationRepository.findByStatusIn(statuses);
                }
                break;
            case "accountant":
                applications = publicProcurementApplicationRepository.findByStatusIn(new ArrayList<>(Arrays.asList(
                        Application.ApplicationStatus.AD,
                        Application.ApplicationStatus.AK,
                        Application.ApplicationStatus.ZA,
                        Application.ApplicationStatus.RE,
                        Application.ApplicationStatus.ZR,
                        Application.ApplicationStatus.AN
                )));
        }

        applications.forEach(application -> {
            ApplicationPayload applicationPayload = new ApplicationPayload(
                    application.getId(),
                    application.getNumber(),
                    application.getOrderedObject().getContent(),
                    application.getEstimationType(),
                    application.getMode(),
                    application.getOrderValueNet(),
                    application.getStatus(),
                    application.getCoordinator()
            );
            applicationPayloads.add(applicationPayload);
        });
        return applicationPayloads;
    }

    @Override
    public ApplicationDetailsPayload getApplication(Long applicationId) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));
        return getApplicationPayload(application);
    }

    @Transactional
    @Override
    public ApplicationDetailsPayload saveApplication(final ApplicationDetailsPayload applicationPayload, final String action, final User principal) {
        Application application = new Application();
        if (action.equals("add")) {
            applicationPayload.setCoordinator(principal.getOrganizationUnit());
            applicationPayload.setCreateUser(principal);
            if (applicationPayload.getCreateDate() == null) {
                applicationPayload.setCreateDate(new Date());
            }
            application.setOrderedObject(new Text(applicationPayload.getOrderedObject()));
        } else {
            application = publicProcurementApplicationRepository.findById(applicationPayload.getId())
                    .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

//            if(application.getEstimationType() != null && application.getApplicationProtocol() != null && application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50) && !applicationPayload.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50)){
//                applicationProtocolService.deleteApplicationProtocol(application.getApplicationProtocol().getId());
//                application.setApplicationProtocol(null);
//            }
        }
        if (applicationPayload.getReplaySourceApplication() != null && applicationPayload.getIsReplay()) {
            application.setReplaySourceApplication(publicProcurementApplicationRepository.findById(applicationPayload.getReplaySourceApplication().getId())
                    .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND)));
        } else if (applicationPayload.getReplaySourceApplication() != null && !applicationPayload.getIsReplay()) {
            application.setReplaySourceApplication(null);
        } else if (application.getReplaySourceApplication() != null && applicationPayload.getReplaySourceApplication() == null) {
            application.setReplaySourceApplication(null);
        }
        return getApplicationPayload(publicProcurementApplicationRepository.save(updateApplication(application, applicationPayload)));
    }

    @Transactional
    @Override
    public ApplicationDetailsPayload saveApplicationAssortmentGroup(final Long applicationId, final ApplicationAssortmentGroup applicationAssortmentGroup, final String action) {

        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

        applicationAssortmentGroup.setApplication(application);

        applicationAssortmentGroup.setInstitutionPublicProcurementPlanPosition(
                (InstitutionPublicProcurementPlanPosition) institutionPlanPositionRepository.findById(applicationAssortmentGroup.getApplicationProcurementPlanPosition().getId())
                        .orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))
        );

        if (applicationAssortmentGroup.getApplicationAssortmentGroupPlanPositions() != null) {
            applicationAssortmentGroup.getApplicationAssortmentGroupPlanPositions().forEach(applicationAssortmentGroupPlanPosition -> applicationAssortmentGroupPlanPosition.setApplicationAssortmentGroup(applicationAssortmentGroup));
            applicationAssortmentGroup.setOrderValueYearNet(applicationAssortmentGroup.getApplicationAssortmentGroupPlanPositions().stream().map(ApplicationAssortmentGroupPlanPosition::getPositionAmountNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            applicationAssortmentGroup.setOrderValueYearGross(applicationAssortmentGroup.getApplicationAssortmentGroupPlanPositions().stream().map(ApplicationAssortmentGroupPlanPosition::getPositionAmountGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        publicProcurementApplicationAssortmentGroupRepository.save(applicationAssortmentGroup);

//        //Remove application protocol if protocol exist and current application estimation type is different that DO50
//        if(application.getEstimationType() != null && application.getApplicationProtocol()!=null && application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50) &&
//            !applicationAssortmentGroup.getInstitutionPublicProcurementPlanPosition().getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50) ){
//            if(application.getAssortmentGroups().size() == 1) {
//                applicationProtocolService.deleteApplicationProtocol(application.getApplicationProtocol().getId());
//                application.setApplicationProtocol(null);
//            } else {
//                // Remove protocol if exists and application not contains any assortment group estimation equal DO50
//                if(application.getAssortmentGroups().stream().anyMatch(group -> group.getInstitutionPublicProcurementPlanPosition().getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50) && !group.equals(applicationAssortmentGroup))){
//                    applicationProtocolService.deleteApplicationProtocol(application.getApplicationProtocol().getId());
//                    application.setApplicationProtocol(null);
//                }
//            }
//        }
        if (application.getIsArt30() == null || (application.getIsArt30() != null && !application.getIsArt30())) {
            application.setEstimationType(applicationAssortmentGroup.getInstitutionPublicProcurementPlanPosition().getEstimationType());
        }
        if (action.equals("add")) {
            if (application.getAssortmentGroups().isEmpty()) {
                application.setOrderValueNet(applicationAssortmentGroup.getOrderGroupValueNet());
                application.setOrderValueGross(applicationAssortmentGroup.getOrderGroupValueGross());
            } else {
                application.setOrderValueNet(application.getOrderValueNet().add(applicationAssortmentGroup.getOrderGroupValueNet()));
                application.setOrderValueGross(application.getOrderValueGross().add(applicationAssortmentGroup.getOrderGroupValueGross()));
            }
            application.getAssortmentGroups().add(applicationAssortmentGroup);
            // Withdraw setup estimation to null if application assortment group is bigger than 1
//            if (application.getAssortmentGroups().size() > 1) {
//                if(application.getAssortmentGroups().stream().anyMatch(group -> !group.getInstitutionPublicProcurementPlanPosition().getEstimationType().equals(applicationAssortmentGroup.getInstitutionPublicProcurementPlanPosition().getEstimationType()))){
//                    application.setEstimationType(null);
//                }
//            }
        } else {
            application.setOrderValueNet(application.getAssortmentGroups().stream().map(ApplicationAssortmentGroup::getOrderGroupValueNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            application.setOrderValueGross(application.getAssortmentGroups().stream().map(ApplicationAssortmentGroup::getOrderGroupValueGross).reduce(BigDecimal.ZERO, BigDecimal::add));
        }

        if (application.getStatus().equals(Application.ApplicationStatus.ZA)) {
            application.setStatus(Application.ApplicationStatus.RE);
        }

        return getApplicationPayload(publicProcurementApplicationRepository.save(application));
    }

    @Transactional
    @Override
    public ApplicationAssortmentGroup saveAssortmentGroupSubsequentYear(Long assortmentGroupPlanPositionId, AssortmentGroupSubsequentYear assortmentGroupSubsequentYear, String action) {

        ApplicationAssortmentGroupPlanPosition assortmentGroupPlanPosition = applicationAssortmentGroupPlanPositionRepository.findById(assortmentGroupPlanPositionId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.assortmentGroupPlanPositionNotFound", HttpStatus.NOT_FOUND));

        assortmentGroupSubsequentYear.setApplicationAssortmentGroupPlanPosition(assortmentGroupPlanPosition);

        assortmentGroupSubsequentYearRepository.save(assortmentGroupSubsequentYear);

        if (action.equals("add")) {
            assortmentGroupPlanPosition.getSubsequentYears().add(assortmentGroupSubsequentYear);
        }

        if (!assortmentGroupPlanPosition.getApplicationAssortmentGroup().getApplicationAssortmentGroupPlanPositions().isEmpty()) {
            assortmentGroupPlanPosition.getApplicationAssortmentGroup().setSubsequentYears(
                    generateAssortmentGroupSubsequentYearsValue(assortmentGroupPlanPosition.getApplicationAssortmentGroup().getApplicationAssortmentGroupPlanPositions())
            );
        }
        return assortmentGroupPlanPosition.getApplicationAssortmentGroup();
    }

    @Transactional
    @Override
    public ApplicationAssortmentGroup deleteAssortmentGroupSubsequentYear(Long assortmentGroupPlanPositionId, Long subsequentYearId) {
        ApplicationAssortmentGroupPlanPosition assortmentGroupPlanPosition = applicationAssortmentGroupPlanPositionRepository.findById(assortmentGroupPlanPositionId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.assortmentGroupPlanPositionNotFound", HttpStatus.NOT_FOUND));

        AssortmentGroupSubsequentYear assortmentGroupSubsequentYear = assortmentGroupSubsequentYearRepository.findById(subsequentYearId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.applicationAssortmentGroup.notFound", HttpStatus.NOT_FOUND));

        assortmentGroupSubsequentYearRepository.deleteById(subsequentYearId);

        assortmentGroupPlanPosition.getSubsequentYears().remove(assortmentGroupSubsequentYear);
        if (!assortmentGroupPlanPosition.getApplicationAssortmentGroup().getApplicationAssortmentGroupPlanPositions().isEmpty()) {
            assortmentGroupPlanPosition.getApplicationAssortmentGroup().setSubsequentYears(
                    generateAssortmentGroupSubsequentYearsValue(assortmentGroupPlanPosition.getApplicationAssortmentGroup().getApplicationAssortmentGroupPlanPositions())
            );
        }

        return assortmentGroupPlanPosition.getApplicationAssortmentGroup();
    }

    @Transactional
    @Override
    public ApplicationDetailsPayload deleteApplicationAssortmentGroup(Long applicationAssortmentGroupId) {
        Optional<ApplicationAssortmentGroup> applicationAssortmentGroup = Optional.ofNullable(publicProcurementApplicationAssortmentGroupRepository.findById(applicationAssortmentGroupId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.assortmentGroupNotFound", HttpStatus.NOT_FOUND)));

        Application application = applicationAssortmentGroup.orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND)).getApplication();
        publicProcurementApplicationAssortmentGroupRepository.deleteById(applicationAssortmentGroupId);

        application.getAssortmentGroups().remove(applicationAssortmentGroup.get());

        if (application.getAssortmentGroups().size() == 1) {
            application.setEstimationType(application.getAssortmentGroups().stream().findFirst()
                    .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.estimationTypeNotFound", HttpStatus.NOT_FOUND))
                    .getInstitutionPublicProcurementPlanPosition().getEstimationType());
        } else if (application.getAssortmentGroups().size() == 0) {
            // Remove protocol if exists and application not contains any assortment group
            if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50) && application.getApplicationProtocol() != null) {
                applicationProtocolService.deleteApplicationProtocol(application.getApplicationProtocol().getId());
                application.setApplicationProtocol(null);
            }
            application.setEstimationType(null);
        } else {
            // Remove protocol if exists and application not contains any assortment group estimation equal DO50
            if (application.getApplicationProtocol() != null) {
                if (application.getAssortmentGroups().stream().anyMatch(group -> group.getInstitutionPublicProcurementPlanPosition().getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50) && !group.equals(applicationAssortmentGroup.get()))) {
                    applicationProtocolService.deleteApplicationProtocol(application.getApplicationProtocol().getId());
                    application.setApplicationProtocol(null);
                }
            }
        }

        application.setOrderValueNet(application.getAssortmentGroups().stream().map(ApplicationAssortmentGroup::getOrderGroupValueNet).reduce(BigDecimal.ZERO, BigDecimal::add));
        application.setOrderValueGross(application.getAssortmentGroups().stream().map(ApplicationAssortmentGroup::getOrderGroupValueGross).reduce(BigDecimal.ZERO, BigDecimal::add));
        return getApplicationPayload(publicProcurementApplicationRepository.save(application));
    }

    @Transactional
    @Override
    public ApplicationDetailsPayload deleteApplicationAssortmentGroupPlanPosition(Long planPositionId) {
        ApplicationAssortmentGroupPlanPosition assortmentGroupPlanPosition = applicationAssortmentGroupPlanPositionRepository.findById(planPositionId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.assortmentGroupPlanPositionNotFound", HttpStatus.NOT_FOUND));

        applicationAssortmentGroupPlanPositionRepository.deleteById(assortmentGroupPlanPosition.getId());

        ApplicationAssortmentGroup assortmentGroup = assortmentGroupPlanPosition.getApplicationAssortmentGroup();
        assortmentGroup.getApplicationAssortmentGroupPlanPositions().remove(assortmentGroupPlanPosition);
        if (assortmentGroup.getApplicationAssortmentGroupPlanPositions().isEmpty()) {
            assortmentGroup.setOrderValueYearNet(BigDecimal.ZERO);
            assortmentGroup.setOrderValueYearGross(BigDecimal.ZERO);
        } else {
            assortmentGroup.setOrderValueYearNet(assortmentGroup.getApplicationAssortmentGroupPlanPositions().stream().map(ApplicationAssortmentGroupPlanPosition::getPositionAmountNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            assortmentGroup.setOrderValueYearGross(assortmentGroup.getApplicationAssortmentGroupPlanPositions().stream().map(ApplicationAssortmentGroupPlanPosition::getPositionAmountGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        }

        return getApplicationPayload(assortmentGroup.getApplication());
    }

    @Transactional
    @Override
    public ApplicationPart saveApplicationPart(Long applicationId, ApplicationPart applicationPart, String action) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

        applicationPart.setApplication(application);
        if (!application.getParts().isEmpty()) {
            application.setIsParts(true);
        }
        if (application.getIsParts().equals(false)) {
            application.setIsParts(true);
        }

        //Update assortment group option value if part is option true
        if (applicationPart.getIsOption() != null && applicationPart.getIsOption() && (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.PO130) || application.getEstimationType().equals(PublicProcurementPosition.EstimationType.UE139))) {
            ApplicationAssortmentGroup assortmentGroup = application.getAssortmentGroups().stream().filter(applicationAssortmentGroup -> applicationAssortmentGroup.getId().equals(applicationPart.getApplicationAssortmentGroup().getId())).findFirst().orElse(null);
            if (assortmentGroup != null) {
                InstitutionPublicProcurementPlanPosition planPosition = assortmentGroup.getInstitutionPublicProcurementPlanPosition();

                List<ApplicationPart> parts = application.getParts().stream().filter(part -> part.getApplicationAssortmentGroup().getInstitutionPublicProcurementPlanPosition().equals(planPosition)).collect(Collectors.toList());
                if (!parts.isEmpty()) {
                    assortmentGroup.setAmountOptionNet(parts.stream().map(ApplicationPart::getAmountOptionNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                    assortmentGroup.setAmountOptionGross(parts.stream().map(ApplicationPart::getAmountOptionGross).reduce(BigDecimal.ZERO, BigDecimal::add));
                } else {
                    assortmentGroup.setAmountOptionNet(applicationPart.getAmountOptionNet());
                    assortmentGroup.setAmountOptionGross(applicationPart.getAmountOptionGross());
                }
                assortmentGroup.setIsOption(true);
            }
        }

        if (applicationPart.getAmountContractAwardedNet() != null) {
            ApplicationAssortmentGroup assortmentGroup = application.getAssortmentGroups().stream().filter(applicationAssortmentGroup -> applicationAssortmentGroup.getId().equals(applicationPart.getApplicationAssortmentGroup().getId())).findFirst().orElse(null);
            if (assortmentGroup != null) {
                assortmentGroup.setAmountContractAwardedNet(
                        assortmentGroup.getAmountContractAwardedNet() != null ?
                                assortmentGroup.getAmountContractAwardedNet().add(applicationPart.getAmountContractAwardedNet()).subtract(application.getParts().stream().filter(part -> part.getId().equals(applicationPart.getId())).findFirst()
                                        .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.partNotFound", HttpStatus.NOT_FOUND)).getAmountContractAwardedNet()) :
                                applicationPart.getAmountContractAwardedNet()
                );
                assortmentGroup.setAmountContractAwardedGross(
                        assortmentGroup.getAmountContractAwardedGross() != null ?
                                assortmentGroup.getAmountContractAwardedGross().add(applicationPart.getAmountContractAwardedGross()).subtract(application.getParts().stream().filter(part -> part.getId().equals(applicationPart.getId())).findFirst()
                                        .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.partNotFound", HttpStatus.NOT_FOUND)).getAmountContractAwardedGross()) :
                                applicationPart.getAmountContractAwardedGross()
                );
                if (assortmentGroup.getApplication().getStatus().equals(Application.ApplicationStatus.ZA)) {
                    assortmentGroup.getApplication().setStatus(Application.ApplicationStatus.RE);
                }
                if (applicationPart.getReasonNotRealized() != null) {
                    applicationPart.setReasonNotRealized(null);
                    applicationPart.setDescNotRealized(null);
                }
                publicProcurementApplicationAssortmentGroupRepository.save(assortmentGroup);
            }
        } else if (!applicationPart.getIsRealized() && !action.equals("add") && applicationPart.getReasonNotRealized() != null) {
            // Update amount inferred value if part is not realized
            if (application.getMode().equals(Application.ApplicationMode.PL)) {
                ApplicationAssortmentGroup assortmentGroup = application.getAssortmentGroups().stream().filter(applicationAssortmentGroup -> applicationAssortmentGroup.getId().equals(applicationPart.getApplicationAssortmentGroup().getId())).findFirst().orElse(null);

                InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = assortmentGroup.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                        .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();

                // Update amount inferred in Institution Public Procurement Plan Position
                assortmentGroup.getInstitutionPublicProcurementPlanPosition().setAmountInferredNet(
                        applicationPart.getApplicationAssortmentGroup().getIsOption() != null && applicationPart.getApplicationAssortmentGroup().getIsOption() ?
                                assortmentGroup.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(applicationPart.getAmountSumNet())
                                : assortmentGroup.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(applicationPart.getAmountNet())
                );

                assortmentGroup.getInstitutionPublicProcurementPlanPosition().setAmountInferredGross(
                        applicationPart.getApplicationAssortmentGroup().getIsOption() != null && applicationPart.getApplicationAssortmentGroup().getIsOption() ?
                                assortmentGroup.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(applicationPart.getAmountSumGross())
                                : assortmentGroup.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(applicationPart.getAmountGross())
                );

                // Update amount inferred in Coordinator Public Procurement Plan Position
                planPosition.setAmountInferredNet(
                        applicationPart.getApplicationAssortmentGroup().getIsOption() != null && applicationPart.getApplicationAssortmentGroup().getIsOption() ?
                                planPosition.getAmountInferredNet().subtract(applicationPart.getAmountSumNet())
                                : planPosition.getAmountInferredNet().subtract(applicationPart.getAmountNet()));
                planPosition.setAmountInferredGross(
                        applicationPart.getApplicationAssortmentGroup().getIsOption() != null && applicationPart.getApplicationAssortmentGroup().getIsOption() ?
                                planPosition.getAmountInferredGross().subtract(applicationPart.getAmountSumGross())
                                : planPosition.getAmountInferredGross().subtract(applicationPart.getAmountGross()));

                planService.updateInferredPositionValue(planPosition);
            }
        } else if (!applicationPart.getIsRealized() && !action.equals("add")) {
            // Subtract value if part is change to not realized and part has contract value
            ApplicationAssortmentGroup assortmentGroup = application.getAssortmentGroups().stream().filter(applicationAssortmentGroup -> applicationAssortmentGroup.getId().equals(applicationPart.getApplicationAssortmentGroup().getId())).findFirst().orElse(null);
            if (assortmentGroup != null) {
                ApplicationPart aplPart = application.getParts().stream().filter(part -> part.getId().equals(applicationPart.getId())).findFirst()
                        .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.partNotFound", HttpStatus.NOT_FOUND));
                if (aplPart.getAmountContractAwardedNet() != null) {
                    assortmentGroup.setAmountContractAwardedNet(
                            assortmentGroup.getAmountContractAwardedNet().subtract(aplPart.getAmountContractAwardedNet())
                    );
                    assortmentGroup.setAmountContractAwardedGross(
                            assortmentGroup.getAmountContractAwardedGross().subtract(aplPart.getAmountContractAwardedGross())
                    );
                }
                if (assortmentGroup.getApplication().getStatus().equals(Application.ApplicationStatus.ZA)) {
                    assortmentGroup.getApplication().setStatus(Application.ApplicationStatus.RE);
                }
            }
        }

        return publicProcurementPartRepository.save(applicationPart);
    }

    @Transactional
    @Override
    public String deleteApplicationPart(Long applicationPartId) {
        ApplicationPart applicationPart = publicProcurementPartRepository.findById(applicationPartId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.partNotFound", HttpStatus.NOT_FOUND));

        publicProcurementPartRepository.deleteById(applicationPartId);
        if (applicationPart.getApplication().getParts().size() == 1) {
            applicationPart.getApplication().setIsParts(false);
        }
        return messageSource.getMessage("Coordinator.publicProcurement.application.deletePartMsg", null, Locale.getDefault());
    }

    @Transactional
    @Override
    public ApplicationCriterion saveApplicationCriterion(Long applicationId, ApplicationCriterion applicationCriterion, String action) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));
        if (applicationCriterion.getScoringDescription() != null && applicationCriterion.getScoringDescription().getContent().isEmpty()) {
            textRepository.delete(applicationCriterion.getScoringDescription());
            applicationCriterion.setScoringDescription(null);
        }
        applicationCriterion.setApplication(application);

        return publicProcurementCriterionRepository.save(applicationCriterion);
    }

    @Override
    public String deleteApplicationCriterion(Long applicationCriterionId) {
        if (publicProcurementCriterionRepository.existsById(applicationCriterionId)) {
            publicProcurementCriterionRepository.deleteById(applicationCriterionId);
            return messageSource.getMessage("Coordinator.publicProcurement.application.deleteCriterionMsg", null, Locale.getDefault());
        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "Coordinator.publicProcurement.application.criterionNotFound");
        }
    }

    @Transactional
    @Override
    public ApplicationDetailsPayload updateApplicationStatus(Long applicationId, Application.ApplicationStatus newStatus) {

        User user = Utils.getCurrentUser();

        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));
        if (newStatus.equals(Application.ApplicationStatus.WY)) {
            if (application.getNumber() == null) {
                application.setNumber(publicProcurementApplicationRepository.generateApplicationNumber(application.getCoordinator().getCode(), application.getMode().name(), application.getEstimationType().name()));
            }
//            application.setSendDate(new Date());
            application.setSendUser(user);
            // Setup amount inferred and art 30 if application mode is planed
            if (application.getMode().equals(Application.ApplicationMode.PL)) {
                application.getAssortmentGroups().forEach(position -> {
                    BigDecimal blockedAmount = BigDecimal.ZERO;
                    blockedAmount = blockedAmount.add(position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet() != null ? position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet() : BigDecimal.ZERO);
                    blockedAmount = blockedAmount.add(position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedNet());

                    if (position.getIsOption() != null && position.getIsOption()) {
                        blockedAmount = blockedAmount.add(position.getOrderGroupValueNet().add(position.getAmountOptionNet()));
                    } else {
                        blockedAmount = blockedAmount.add(position.getOrderGroupValueNet());
                    }
                    if (blockedAmount.compareTo(position.getInstitutionPublicProcurementPlanPosition().getAmountRequestedNet()) > 0) {
                        throw new AppException(
                                HttpStatus.BAD_REQUEST,
                                "Coordinator.publicProcurement.application.positionGroupValueExceeded",
                                position.getInstitutionPublicProcurementPlanPosition().getAssortmentGroup().getName()
                        );
                    }

                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = position.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                            .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                    PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();
                    // Update amount inferred in Institution Public Procurement Plan Position
                    position.getInstitutionPublicProcurementPlanPosition().setAmountInferredNet(
                            position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet() != null ?
                                    // if option
                                    position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().add(position.getOrderGroupValueNet().add(position.getAmountOptionNet())) :
                                            position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().add(position.getOrderGroupValueNet()) :
                                    // if inferred is null and isOption
                                    position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueNet().add(position.getAmountOptionNet()) : position.getOrderGroupValueNet()
                    );
                    position.getInstitutionPublicProcurementPlanPosition().setAmountInferredGross(
                            position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross() != null ?
                                    // if option
                                    position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().add(position.getOrderGroupValueGross().add(position.getAmountOptionGross())) :
                                            position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().add(position.getOrderGroupValueGross()) :
                                    position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueGross().add(position.getAmountOptionGross()) : position.getOrderGroupValueGross()
                    );
                    // Update amount inferred in Coordinator Public Procurement Plan Position
                    planPosition.setAmountInferredNet(planPosition.getAmountInferredNet() == null ?
                            position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueNet().add(position.getAmountOptionNet()) : position.getOrderGroupValueNet() :
                            position.getIsOption() != null && position.getIsOption() ? planPosition.getAmountInferredNet().add(position.getOrderGroupValueNet().add(position.getAmountOptionNet())) : planPosition.getAmountInferredNet().add(position.getOrderGroupValueNet()));
                    planPosition.setAmountInferredGross(planPosition.getAmountInferredGross() == null ?
                            position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueGross().add(position.getAmountOptionGross()) : position.getOrderGroupValueGross() :
                            position.getIsOption() != null && position.getIsOption() ? planPosition.getAmountInferredGross().add(position.getOrderGroupValueGross().add(position.getAmountOptionGross())) : planPosition.getAmountInferredGross().add(position.getOrderGroupValueGross()));

                    // Update amount art30 value
                    if (application.getIsArt30() != null && application.getIsArt30()) {
                        if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50)) {

                            List<ApplicationProtocolPrice> prices = application.getApplicationProtocol().getPrices().stream().filter(applicationProtocolPrice -> applicationProtocolPrice.getApplicationAssortmentGroup().getInstitutionPublicProcurementPlanPosition().getAssortmentGroup().equals(position.getInstitutionPublicProcurementPlanPosition().getAssortmentGroup())).collect(Collectors.toList());

                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Net(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net() != null ?
                                            position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net().add(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add)) :
                                            prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add)
                            );
                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Gross(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross() != null ?
                                            position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross().add(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add)) :
                                            prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add)
                            );
                        } else {
                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Net(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net() != null ?
                                            // if option
                                            position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net().add(position.getOrderGroupValueNet().add(position.getAmountOptionNet())) :
                                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net().add(position.getOrderGroupValueNet()) :
                                            // if art30 is null and isOption
                                            position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueNet().add(position.getAmountOptionNet()) : position.getOrderGroupValueNet()
                            );
                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Gross(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross() != null ?
                                            // if option
                                            position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross().add(position.getOrderGroupValueGross().add(position.getAmountOptionGross())) :
                                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross().add(position.getOrderGroupValueGross()) :
                                            // if art30 is null and isOption
                                            position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueGross().add(position.getAmountOptionGross()) : position.getOrderGroupValueGross()
                            );
                        }
                    }
                    planService.updateInferredPositionValue(planPosition);
                });
            }
        } else if (newStatus.equals(Application.ApplicationStatus.AZ)) {
            application.setPublicAcceptUser(user);
        } else if (newStatus.equals(Application.ApplicationStatus.AD)) {
            application.setDirectorAcceptUser(user);
        } else if (newStatus.equals(Application.ApplicationStatus.AK)) {
            application.setAccountantAcceptUser(user);
        } else if (newStatus.equals(Application.ApplicationStatus.AM)) {
            application.setMedicalDirectorAcceptUser(user);
        } else if (newStatus.equals(Application.ApplicationStatus.ZR)) {
            application.setChiefAcceptUser(user);
            if (application.getMode().equals(Application.ApplicationMode.PL)) {
                if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50)) {
                    // Update amount inferred value
                    application.getAssortmentGroups().forEach(position -> {
                        InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = position.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                                .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                        PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();
                        // Update amount inferred in Institution Public Procurement Plan Position
                        position.getInstitutionPublicProcurementPlanPosition().setAmountInferredNet(
                                position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(position.getOrderGroupValueNet())
                        );
                        position.getInstitutionPublicProcurementPlanPosition().setAmountInferredGross(
                                position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(position.getOrderGroupValueGross())
                        );
                        // Update amount inferred in Coordinator Public Procurement Plan Position
                        planPosition.setAmountInferredNet(planPosition.getAmountInferredNet().subtract(position.getOrderGroupValueNet()));
                        planPosition.setAmountInferredGross(planPosition.getAmountInferredNet().add(position.getOrderGroupValueGross()));
                    });

                    // Update amount realized
                    List<ApplicationAssortmentGroup> assortmentGroups = new ArrayList<>();
                    application.getAssortmentGroups().forEach(group -> {
                        if (assortmentGroups.isEmpty()) {
                            assortmentGroups.add(group);
                        } else if (assortmentGroups.stream().anyMatch(assortmentGroup -> !assortmentGroup.getInstitutionPublicProcurementPlanPosition().equals(group.getInstitutionPublicProcurementPlanPosition()))) {
                            assortmentGroups.add(group);
                        }
                    });

                    assortmentGroups.forEach(position -> {
                        InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = position.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                                .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                        PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();
                        // Update amount realized in Institution Public Procurement Plan Position
                        List<ApplicationProtocolPrice> prices = application.getApplicationProtocol().getPrices().stream().filter(applicationProtocolPrice -> applicationProtocolPrice.getApplicationAssortmentGroup().getInstitutionPublicProcurementPlanPosition().getAssortmentGroup().equals(position.getInstitutionPublicProcurementPlanPosition().getAssortmentGroup())).collect(Collectors.toList());
                        position.getInstitutionPublicProcurementPlanPosition().setAmountRealizedNet(
                                position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedNet().add(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add))
                        );
                        position.getInstitutionPublicProcurementPlanPosition().setAmountRealizedGross(
                                position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedGross().add(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add))
                        );

                        // Update amount realized in Coordinator Public Procurement Plan Position
                        planPosition.setAmountRealizedNet(planPosition.getAmountRealizedNet() == null ?
                                prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add) :
                                planPosition.getAmountRealizedNet().add(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add)));
                        planPosition.setAmountRealizedGross(planPosition.getAmountRealizedGross() == null ?
                                prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add) :
                                planPosition.getAmountRealizedGross().add(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add)));
                        planService.updateInferredPositionValue(planPosition);

                    });
                }
            }
        } else if (!application.getStatus().equals(Application.ApplicationStatus.ZP) && newStatus.equals(Application.ApplicationStatus.ZP)) {
//            application.setSendDate(null);
            application.setSendUser(null);
            application.setPublicAcceptUser(null);
            application.setDirectorAcceptUser(null);
            application.setMedicalDirectorAcceptUser(null);
            application.setAccountantAcceptUser(null);
            application.setChiefAcceptUser(null);

            // Setup amount inferred and art 30 if application mode is planed
            if (application.getMode().equals(Application.ApplicationMode.PL)) {
                application.getAssortmentGroups().forEach(position -> {
                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = position.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                            .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                    PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();
                    // Update amount inferred in Institution Public Procurement Plan Position
                    position.getInstitutionPublicProcurementPlanPosition().setAmountInferredNet(
                            position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(position.getAmountSumNet())
                                    : position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(position.getOrderGroupValueNet())
                    );
                    position.getInstitutionPublicProcurementPlanPosition().setAmountInferredGross(
                            position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(position.getAmountSumGross())
                                    : position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(position.getOrderGroupValueGross())
                    );
                    // Update amount inferred in Coordinator Public Procurement Plan Position
                    planPosition.setAmountInferredNet(
                            position.getIsOption() != null && position.getIsOption() ? planPosition.getAmountInferredNet().subtract(position.getAmountSumNet())
                                    : planPosition.getAmountInferredNet().subtract(position.getOrderGroupValueNet()));
                    planPosition.setAmountInferredGross(
                            position.getIsOption() != null && position.getIsOption() ? planPosition.getAmountInferredGross().subtract(position.getAmountSumGross())
                                    : planPosition.getAmountInferredGross().subtract(position.getOrderGroupValueGross()));

                    // Update amount art30 value
                    if (application.getIsArt30() != null && application.getIsArt30()) {
                        if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50)) {

                            List<ApplicationProtocolPrice> prices = application.getApplicationProtocol().getPrices().stream().filter(applicationProtocolPrice -> applicationProtocolPrice.getApplicationAssortmentGroup().getInstitutionPublicProcurementPlanPosition().getAssortmentGroup().equals(position.getInstitutionPublicProcurementPlanPosition().getAssortmentGroup())).collect(Collectors.toList());

                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Net(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net() != null ?
                                            position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net().subtract(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add)) :
                                            prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add)
                            );
                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Gross(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross() != null ?
                                            position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross().subtract(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add)) :
                                            prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add)
                            );
                        } else {
                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Net(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net() != null ?
                                            // if option
                                            position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net().subtract(position.getOrderGroupValueNet().add(position.getAmountOptionNet())) :
                                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Net().subtract(position.getOrderGroupValueNet()) :
                                            // if art30 is null and isOption
                                            position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueNet().subtract(position.getAmountOptionNet()) : position.getOrderGroupValueNet()
                            );
                            position.getInstitutionPublicProcurementPlanPosition().setAmountArt30Gross(
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross() != null ?
                                            // if option
                                            position.getIsOption() != null && position.getIsOption() ? position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross().subtract(position.getOrderGroupValueGross().add(position.getAmountOptionGross())) :
                                                    position.getInstitutionPublicProcurementPlanPosition().getAmountArt30Gross().subtract(position.getOrderGroupValueGross()) :
                                            // if art30 is null and isOption
                                            position.getIsOption() != null && position.getIsOption() ? position.getOrderGroupValueGross().subtract(position.getAmountOptionGross()) : position.getOrderGroupValueGross()
                            );
                        }
                    }
                    planService.updateInferredPositionValue(planPosition);
                });
            }
        }
        if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50) && newStatus.equals(Application.ApplicationStatus.ZR)) {
            application.setStatus(Application.ApplicationStatus.ZR);
        } else if (newStatus.equals(Application.ApplicationStatus.ZR)) {
            application.setStatus(Application.ApplicationStatus.ZA);
        } else {
            application.setStatus(newStatus);
        }
        return getApplicationPayload(publicProcurementApplicationRepository.save(application));
    }

    @Override
    public ApplicationDetailsPayload confirmRealization(Long applicationId) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));
        if (application.getMode().equals(Application.ApplicationMode.PL)) {
            application.getAssortmentGroups().forEach(position -> {
                InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = position.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                        .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();

                // Update amount inferred in Institution Public Procurement Plan Position
                position.getInstitutionPublicProcurementPlanPosition().setAmountInferredNet(
                        position.getIsOption() != null && position.getIsOption() ?
                                position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(position.getAmountSumNet())
                                : position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(position.getOrderGroupValueNet())
                );

                position.getInstitutionPublicProcurementPlanPosition().setAmountInferredGross(
                        position.getIsOption() != null && position.getIsOption() ?
                                position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(position.getAmountSumGross())
                                : position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(position.getOrderGroupValueGross())
                );

                // Update amount inferred in Coordinator Public Procurement Plan Position
                planPosition.setAmountInferredNet(
                        position.getIsOption() != null && position.getIsOption() ?
                                planPosition.getAmountInferredNet().subtract(position.getAmountSumNet())
                                : planPosition.getAmountInferredNet().subtract(position.getOrderGroupValueNet()));
                planPosition.setAmountInferredGross(
                        position.getIsOption() != null && position.getIsOption() ?
                                planPosition.getAmountInferredGross().subtract(position.getAmountSumGross())
                                : planPosition.getAmountInferredGross().subtract(position.getOrderGroupValueGross()));

                // Update amount realized in Institution Public Procurement Plan Position
                if (position.getAmountContractAwardedNet() != null) {
                    position.getInstitutionPublicProcurementPlanPosition().setAmountRealizedNet(
                            position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedNet() != null ?
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedNet().add(position.getAmountContractAwardedNet())
                                    : position.getAmountContractAwardedNet()
                    );
                    position.getInstitutionPublicProcurementPlanPosition().setAmountRealizedGross(
                            position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedGross() != null ?
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedGross().add(position.getAmountContractAwardedGross())
                                    : position.getAmountContractAwardedGross()
                    );

                    // Update amount realized in Coordinator Public Procurement Plan Position
                    planPosition.setAmountRealizedNet(planPosition.getAmountRealizedNet() == null ?
                            position.getAmountContractAwardedNet() :
                            planPosition.getAmountRealizedNet().add(position.getAmountContractAwardedNet())
                    );
                    planPosition.setAmountRealizedGross(planPosition.getAmountRealizedGross() == null ?
                            position.getAmountContractAwardedGross() :
                            planPosition.getAmountRealizedGross().add(position.getAmountContractAwardedGross())
                    );
                }
                planService.updateInferredPositionValue(planPosition);
            });
        }

        application.setStatus(Application.ApplicationStatus.ZR);

        return getApplicationPayload(publicProcurementApplicationRepository.save(application));
    }

    @Override
    public ApplicationDetailsPayload rollbackPartRealization(Long applicationId, Set<ApplicationPart> parts) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

        if (parts.stream().anyMatch(part -> part.getReasonNotRealized() == null)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Coordinator.publicProcurement.application.part.reasonNotFound");
        }

        application.setParts(parts);

        if (application.getStatus().equals(Application.ApplicationStatus.ZA)) {
            application.setStatus(Application.ApplicationStatus.RE);
        }

        return getApplicationPayload(publicProcurementApplicationRepository.save(application));
    }

    @Override
    public ApplicationDetailsPayload rollbackRealization(Long applicationId) {
        User user = Utils.getCurrentUser();

        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

        if (application.getMode().equals(Application.ApplicationMode.PL)) {
            /*
                Rollback realization value on withdraw application on estimation type DO50.
                Functionality allowed only in Director module.
            */
            if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50)) {

                List<ApplicationAssortmentGroup> assortmentGroups = new ArrayList<>();
                application.getAssortmentGroups().forEach(group -> {
                    if (assortmentGroups.isEmpty()) {
                        assortmentGroups.add(group);
                    } else if (assortmentGroups.stream().anyMatch(assortmentGroup -> !assortmentGroup.getInstitutionPublicProcurementPlanPosition().equals(group.getInstitutionPublicProcurementPlanPosition()))) {
                        assortmentGroups.add(group);
                    }
                });

                assortmentGroups.forEach(position -> {
                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = position.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                            .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                    PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();

                    // Rollback amount realized in Institution Public Procurement Plan Position
                    List<ApplicationProtocolPrice> prices = application.getApplicationProtocol().getPrices().stream().filter(applicationProtocolPrice -> applicationProtocolPrice.getApplicationAssortmentGroup().getInstitutionPublicProcurementPlanPosition().getAssortmentGroup().equals(position.getInstitutionPublicProcurementPlanPosition().getAssortmentGroup())).collect(Collectors.toList());
                    position.getInstitutionPublicProcurementPlanPosition().setAmountRealizedNet(
                            position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedNet().subtract(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add))
                    );
                    position.getInstitutionPublicProcurementPlanPosition().setAmountRealizedGross(
                            position.getInstitutionPublicProcurementPlanPosition().getAmountRealizedGross().subtract(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add))
                    );

                    // Update amount realized in Coordinator Public Procurement Plan Position
                    planPosition.setAmountRealizedNet(
                            planPosition.getAmountRealizedNet().subtract(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add))
                    );
                    planPosition.setAmountRealizedGross(
                            planPosition.getAmountRealizedGross().add(prices.stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add))
                    );

                    planService.updateInferredPositionValue(planPosition);
                });

            } else {
                application.getAssortmentGroups().forEach(position -> {
                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPositionPlanPosition = position.getInstitutionPublicProcurementPlanPosition().getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(application.getCoordinator())).findFirst()
                            .orElseThrow(() -> new AppException("Public.institutionCoordinatorPlanPositionNotFound", HttpStatus.NOT_FOUND));
                    PublicProcurementPosition planPosition = (PublicProcurementPosition) institutionCoordinatorPlanPositionPlanPosition.getCoordinatorPlanPosition();

                    // Update amount inferred in Institution Public Procurement Plan Position
                    position.getInstitutionPublicProcurementPlanPosition().setAmountInferredNet(
                            position.getIsOption() != null && position.getIsOption() ?
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(position.getAmountSumNet())
                                    : position.getInstitutionPublicProcurementPlanPosition().getAmountInferredNet().subtract(position.getOrderGroupValueNet())
                    );

                    position.getInstitutionPublicProcurementPlanPosition().setAmountInferredGross(
                            position.getIsOption() != null && position.getIsOption() ?
                                    position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(position.getAmountSumGross())
                                    : position.getInstitutionPublicProcurementPlanPosition().getAmountInferredGross().subtract(position.getOrderGroupValueGross())
                    );

                    // Update amount inferred in Coordinator Public Procurement Plan Position
                    planPosition.setAmountInferredNet(
                            position.getIsOption() != null && position.getIsOption() ?
                                    planPosition.getAmountInferredNet().subtract(position.getAmountSumNet())
                                    : planPosition.getAmountInferredNet().subtract(position.getOrderGroupValueNet()));
                    planPosition.setAmountInferredGross(
                            position.getIsOption() != null && position.getIsOption() ?
                                    planPosition.getAmountInferredGross().subtract(position.getAmountSumGross())
                                    : planPosition.getAmountInferredGross().subtract(position.getOrderGroupValueGross()));

                    planService.updateInferredPositionValue(planPosition);
                });
            }
        }

        application.setCancelUser(user);
        application.setStatus(Application.ApplicationStatus.AN);

        return getApplicationPayload(publicProcurementApplicationRepository.save(application));
    }

    @Transactional
    @Override
    public String deleteApplication(Long applicationId) {
        if (publicProcurementApplicationRepository.existsById(applicationId)) {
            publicProcurementApplicationRepository.deleteById(applicationId);
            return messageSource.getMessage("Coordinator.publicProcurement.application.deleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "Coordinator.publicProcurement.application.notFound");
        }
    }


    @Override
    public void exportApplicationsToExcel(final ExportType exportType, final ArrayList<ExcelHeadRow> headRow, final HttpServletResponse response) throws IOException {

        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        List<ApplicationPayload> applications = getApplicationsByCoordinator();

        applications.forEach(application -> {
            Map<String, Object> row = new HashMap<>();
            row.put("number", application.getNumber());
            row.put("orderedObject", application.getOrderedObject());
            row.put("estimationType.name", application.getEstimationType());
            row.put("mode.name", application.getMode().name());
            row.put("orderValueNet", application.getOrderValueNet());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    @Override
    public void exportApplicationsPartsToExcel(final ExportType exportType, final Long applicationId, final ArrayList<ExcelHeadRow> headRow, final HttpServletResponse response) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));
        ArrayList<ApplicationPart> parts = new ArrayList<>(application.getParts());
        parts.sort(Comparator.comparing(ApplicationPart::getId));
        parts.forEach(part -> {
            Map<String, Object> row = new HashMap<>();
            row.put("name", part.getName());
            row.put("applicationAssortmentGroup.applicationProcurementPlanPosition.name", part.getApplicationAssortmentGroup().getApplicationProcurementPlanPosition().getName());
            row.put("amountNet", part.getAmountNet());
            row.put("amountGross", part.getAmountGross());
            if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.UE139) ||
                    application.getEstimationType().equals(PublicProcurementPosition.EstimationType.PO130)) {
                row.put("amountOptionNet", part.getAmountOptionNet());
                row.put("amountOptionGross", part.getAmountOptionGross());
                row.put("amountSumNet", part.getAmountSumNet());
                row.put("amountSumGross", part.getAmountSumGross());
            }
            rows.add(row);
        });
        if (application.getEstimationType().equals(PublicProcurementPosition.EstimationType.UE139) ||
                application.getEstimationType().equals(PublicProcurementPosition.EstimationType.PO130)) {
            headRow.add(new ExcelHeadRow("amountOptionNet", "Wartość opcji netto", "amount", null));
            headRow.add(new ExcelHeadRow("amountOptionGross", "Wartość opcji brutto", "amount", null));
            headRow.add(new ExcelHeadRow("amountSumNet", "Suma podstawa + opcja netto", "amount", null));
            headRow.add(new ExcelHeadRow("amountSumNet", "Suma podstawa + opcja brutto", "amount", null));
        }

        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    @Override
    public void exportApplicationToJasper(Long applicationId, HttpServletResponse response) throws IOException, JRException, SQLException {
        logger.info("generate application pdf " + applicationId);
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(applicationId, "/jasper/prints/modules/coordinator/publicProcurement/application.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }

    private ApplicationDetailsPayload getApplicationPayload(Application application) {
        ApplicationDetailsPayload applicationPayload = new ApplicationDetailsPayload();
        applicationPayload.setId(application.getId());
        applicationPayload.setNumber(application.getNumber());
        applicationPayload.setMode(application.getMode());
        if (application.getReasonNotIncluded() != null) {
            applicationPayload.setReasonNotIncluded(application.getReasonNotIncluded().getContent());
        }
        applicationPayload.setCreateDate(application.getCreateDate());
        applicationPayload.setSendDate(application.getSendDate());
        applicationPayload.setStatus(application.getStatus());
        applicationPayload.setIsReplay(application.getIsReplay());
        if (application.getReplaySourceApplication() != null && application.getIsReplay()) {
            applicationPayload.setReplaySourceApplication(
                    new ApplicationPayload(
                            application.getReplaySourceApplication().getId(),
                            application.getReplaySourceApplication().getNumber(),
                            application.getReplaySourceApplication().getOrderedObject().getContent(),
                            application.getReplaySourceApplication().getEstimationType(),
                            application.getReplaySourceApplication().getMode(),
                            application.getReplaySourceApplication().getOrderValueNet(),
                            application.getReplaySourceApplication().getStatus(),
                            application.getReplaySourceApplication().getCoordinator()
                    )
            );
        }
        applicationPayload.setOrderedObject(application.getOrderedObject().getContent());
        applicationPayload.setIsCombined(application.getIsCombined());
        applicationPayload.setOrderRealizationTerm(application.getOrderRealizationTerm());
        applicationPayload.setEstimationType(application.getEstimationType());
        applicationPayload.setIsArt30(application.getIsArt30());
        applicationPayload.setOrderValueNet(application.getOrderValueNet());
        applicationPayload.setOrderValueGross(application.getOrderValueGross());
        applicationPayload.setIsParts(application.getIsParts());
        if (application.getOrderReasonLackParts() != null) {
            applicationPayload.setOrderReasonLackParts(application.getOrderReasonLackParts().getContent());
        }
        applicationPayload.setCpv(application.getCpv());
        applicationPayload.setOrderValueBased(application.getOrderValueBased());
        applicationPayload.setOrderValueSettingPerson(application.getOrderValueSettingPerson());
        applicationPayload.setDateEstablishedValue(application.getDateEstablishedValue());
        if (application.getJustificationPurchase() != null) {
            applicationPayload.setJustificationPurchase(application.getJustificationPurchase().getContent());
        }
        if (application.getOrderDescription() != null) {
            applicationPayload.setOrderDescription(application.getOrderDescription().getContent());
        }
        applicationPayload.setPersonsPreparingDescription(application.getPersonsPreparingDescription());
        if (application.getRequirementsVariantBids() != null) {
            applicationPayload.setRequirementsVariantBids(application.getRequirementsVariantBids().getContent());
        }
        if (application.getProposedOrderingProcedure() != null) {
            applicationPayload.setProposedOrderingProcedure(application.getProposedOrderingProcedure().getContent());
        }
        applicationPayload.setPersonsPreparingJustification(application.getPersonsPreparingJustification());
        applicationPayload.setOrderContractorName(application.getOrderContractorName());
        applicationPayload.setPersonsChoosingContractor(application.getPersonsChoosingContractor());
        if (application.getOrderContractorConditions() != null) {
            applicationPayload.setOrderContractorConditions(application.getOrderContractorConditions().getContent());
        }
        applicationPayload.setPersonsPreparingConditions(application.getPersonsPreparingConditions());
        if (application.getOrderImportantRecords() != null) {
            applicationPayload.setOrderImportantRecords(application.getOrderImportantRecords().getContent());
        }
        applicationPayload.setPersonsPreparingCriteria(application.getPersonsPreparingCriteria());
        if (application.getTenderCommittee() != null) {
            applicationPayload.setTenderCommittee(application.getTenderCommittee().getContent());
        }
        if (application.getWarrantyRequirements() != null) {
            applicationPayload.setWarrantyRequirements(application.getWarrantyRequirements().getContent());
        }
        if (application.getDescription() != null) {
            applicationPayload.setDescription(application.getDescription().getContent());
        }
        applicationPayload.setOrderIncludedPlanType(application.getOrderIncludedPlanType());
        if (application.getContractorContract() != null) {
            applicationPayload.setContractorContract(application.getContractorContract().getContent());
        }
        applicationPayload.setOfferPriceGross(application.getOfferPriceGross());
        if (application.getReceivedOffers() != null) {
            applicationPayload.setReceivedOffers(application.getReceivedOffers().getContent());
        }
        if (application.getJustificationChoosingOffer() != null) {
            applicationPayload.setJustificationChoosingOffer(application.getJustificationChoosingOffer().getContent());
        }
        if (application.getJustificationNonCompetitiveProcedure() != null) {
            applicationPayload.setJustificationNonCompetitiveProcedure(application.getJustificationNonCompetitiveProcedure().getContent());
        }
        if (application.getConditionsParticipation() != null) {
            applicationPayload.setConditionsParticipation(application.getConditionsParticipation().getContent());
        }
        applicationPayload.setIsMarketConsultation(application.getIsMarketConsultation());
        applicationPayload.setIsOrderFinanced(application.getIsOrderFinanced());
        applicationPayload.setIsParticipatedPreparation(application.getIsParticipatedPreparation());
        applicationPayload.setIsSecuringContract(application.getIsSecuringContract());
        applicationPayload.setOrderProcedure(application.getOrderProcedure());
        applicationPayload.setCreateUser(application.getCreateUser());
        applicationPayload.setSendUser(application.getSendUser());
        applicationPayload.setPublicAcceptUser(application.getPublicAcceptUser());
        applicationPayload.setDirectorAcceptUser(application.getDirectorAcceptUser());
        applicationPayload.setMedicalDirectorAcceptUser(application.getMedicalDirectorAcceptUser());
        applicationPayload.setAccountantAcceptUser(application.getAccountantAcceptUser());
        applicationPayload.setChiefAcceptUser(application.getChiefAcceptUser());
        applicationPayload.setCoordinator(application.getCoordinator());
        applicationPayload.setCoordinatorCombined(application.getCoordinatorCombined());
        if (!application.getAssortmentGroups().isEmpty()) {
            application.getAssortmentGroups().forEach(applicationAssortmentGroup -> {
                if (applicationAssortmentGroup.getApplicationAssortmentGroupPlanPositions() != null && !applicationAssortmentGroup.getApplicationAssortmentGroupPlanPositions().isEmpty()) {
                    applicationAssortmentGroup.setSubsequentYears(
                            generateAssortmentGroupSubsequentYearsValue(applicationAssortmentGroup.getApplicationAssortmentGroupPlanPositions())
                    );
                }
            });
        }
        applicationPayload.setAssortmentGroups(application.getAssortmentGroups());
        applicationPayload.setParts(application.getParts());
        if (!application.getParts().isEmpty()) {
            applicationPayload.setPartsAmountNet(application.getParts().stream().map(ApplicationPart::getAmountSumNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            applicationPayload.setPartsAmountGross(application.getParts().stream().map(ApplicationPart::getAmountSumGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        applicationPayload.setCriteria(application.getCriteria());
        if (application.getApplicationProtocol() != null && application.getEstimationType() != null && application.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50)) {
            ApplicationProtocolPayload protocol = new ApplicationProtocolPayload();
            protocol.setId(application.getApplicationProtocol().getId());
            protocol.setEmail(application.getApplicationProtocol().getEmail());
            protocol.setPhone(application.getApplicationProtocol().getPhone());
            protocol.setInternet(application.getApplicationProtocol().getInternet());
            protocol.setPaper(application.getApplicationProtocol().getPaper());
            protocol.setOther(application.getApplicationProtocol().getOther());
            if (application.getApplicationProtocol().getOtherDesc() != null) {
                protocol.setOtherDesc(application.getApplicationProtocol().getOtherDesc().getContent());
            }
            protocol.setRenouncement(application.getApplicationProtocol().getRenouncement());
            if (application.getApplicationProtocol().getNonCompetitiveOffer() != null) {
                protocol.setNonCompetitiveOffer(application.getApplicationProtocol().getNonCompetitiveOffer().getContent());
            }
            if (application.getApplicationProtocol().getReceivedOffers() != null) {
                protocol.setReceivedOffers(application.getApplicationProtocol().getReceivedOffers().getContent());
            }
            if (application.getApplicationProtocol().getJustificationChoosingOffer() != null) {
                protocol.setJustificationChoosingOffer(application.getApplicationProtocol().getJustificationChoosingOffer().getContent());
            }
            //TODO Remove Contractor from Application Protocol. Changed to Contractor Description
            protocol.setContractor(application.getApplicationProtocol().getContractor());
            if (application.getApplicationProtocol().getContractorDesc() != null) {
                protocol.setContractorDesc(application.getApplicationProtocol().getContractorDesc().getContent());
            }
            protocol.setSendUser(application.getApplicationProtocol().getSendUser());
            protocol.setAccountantAcceptUser(application.getApplicationProtocol().getAccountantAcceptUser());
            protocol.setChiefAcceptUser(application.getApplicationProtocol().getChiefAcceptUser());
            protocol.setPrices(application.getApplicationProtocol().getPrices());
            protocol.setStatus(application.getApplicationProtocol().getStatus());
            if (!application.getApplicationProtocol().getPrices().isEmpty()) {
                protocol.setPricesAmountNet(application.getApplicationProtocol().getPrices().stream().map(ApplicationProtocolPrice::getAmountContractAwardedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                protocol.setPricesAmountGross(application.getApplicationProtocol().getPrices().stream().map(ApplicationProtocolPrice::getAmountContractAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
            }
            applicationPayload.setApplicationProtocol(protocol);
        }
        return applicationPayload;
    }

    private Application updateApplication(Application application, ApplicationDetailsPayload applicationDetails) {

        application.setId(applicationDetails.getId());
        application.setNumber(applicationDetails.getNumber());
        application.setMode(applicationDetails.getMode());
        if (application.getReasonNotIncluded() != null && applicationDetails.getReasonNotIncluded() != null) {
            application.getReasonNotIncluded().setContent(applicationDetails.getReasonNotIncluded());
        } else if (applicationDetails.getReasonNotIncluded() != null) {
            application.setReasonNotIncluded(new Text(applicationDetails.getReasonNotIncluded()));
        }
        application.setCreateDate(applicationDetails.getCreateDate());
        application.setSendDate(applicationDetails.getSendDate());
        application.setStatus(applicationDetails.getStatus());
        application.setIsReplay(applicationDetails.getIsReplay());
        application.getOrderedObject().setContent(applicationDetails.getOrderedObject());
        application.setIsCombined(applicationDetails.getIsCombined());
        application.setOrderRealizationTerm(applicationDetails.getOrderRealizationTerm());
        application.setEstimationType(applicationDetails.getEstimationType());
        application.setIsArt30(applicationDetails.getIsArt30());
        application.setOrderValueNet(applicationDetails.getOrderValueNet());
        application.setOrderValueGross(applicationDetails.getOrderValueGross());
        application.setIsParts(applicationDetails.getIsParts());
        if (application.getOrderReasonLackParts() != null && applicationDetails.getOrderReasonLackParts() != null) {
            application.getOrderReasonLackParts().setContent(applicationDetails.getOrderReasonLackParts());
        } else if (applicationDetails.getOrderReasonLackParts() != null) {
            application.setOrderReasonLackParts(new Text(applicationDetails.getOrderReasonLackParts()));
        }
        application.setCpv(applicationDetails.getCpv());
        application.setOrderValueBased(applicationDetails.getOrderValueBased());
        application.setOrderValueSettingPerson(applicationDetails.getOrderValueSettingPerson());
        application.setDateEstablishedValue(applicationDetails.getDateEstablishedValue());
        if (application.getJustificationPurchase() != null && applicationDetails.getJustificationPurchase() != null) {
            application.getJustificationPurchase().setContent(applicationDetails.getJustificationPurchase());
        } else if (applicationDetails.getJustificationPurchase() != null) {
            application.setJustificationPurchase(new Text(applicationDetails.getJustificationPurchase()));
        }
        if (application.getOrderDescription() != null && applicationDetails.getOrderDescription() != null) {
            application.getOrderDescription().setContent(applicationDetails.getOrderDescription());
        } else if (applicationDetails.getOrderDescription() != null) {
            application.setOrderDescription(new Text(applicationDetails.getOrderDescription()));
        }
        application.setPersonsPreparingDescription(applicationDetails.getPersonsPreparingDescription());
        if (application.getRequirementsVariantBids() != null && applicationDetails.getRequirementsVariantBids() != null) {
            application.getRequirementsVariantBids().setContent(applicationDetails.getRequirementsVariantBids());
        } else if (applicationDetails.getRequirementsVariantBids() != null) {
            application.setRequirementsVariantBids(new Text(applicationDetails.getRequirementsVariantBids()));
        }
        if (application.getProposedOrderingProcedure() != null && applicationDetails.getProposedOrderingProcedure() != null) {
            application.getProposedOrderingProcedure().setContent(applicationDetails.getProposedOrderingProcedure());
        } else if (applicationDetails.getProposedOrderingProcedure() != null) {
            application.setProposedOrderingProcedure(new Text(applicationDetails.getProposedOrderingProcedure()));
        }
        application.setPersonsPreparingJustification(applicationDetails.getPersonsPreparingJustification());
        application.setOrderContractorName(applicationDetails.getOrderContractorName());
        application.setPersonsChoosingContractor(applicationDetails.getPersonsChoosingContractor());
        if (application.getOrderContractorConditions() != null && applicationDetails.getOrderContractorConditions() != null) {
            application.getOrderContractorConditions().setContent(applicationDetails.getOrderContractorConditions());
        } else if (applicationDetails.getOrderContractorConditions() != null) {
            application.setOrderContractorConditions(new Text(applicationDetails.getOrderContractorConditions()));
        }
        application.setPersonsPreparingConditions(applicationDetails.getPersonsPreparingConditions());
        if (application.getOrderImportantRecords() != null && applicationDetails.getOrderImportantRecords() != null) {
            application.getOrderImportantRecords().setContent(applicationDetails.getOrderImportantRecords());
        } else if (applicationDetails.getOrderImportantRecords() != null) {
            application.setOrderImportantRecords(new Text(applicationDetails.getOrderImportantRecords()));
        }
        application.setPersonsPreparingCriteria(applicationDetails.getPersonsPreparingCriteria());
        if (application.getTenderCommittee() != null && applicationDetails.getTenderCommittee() != null) {
            application.getTenderCommittee().setContent(applicationDetails.getTenderCommittee());
        } else if (applicationDetails.getTenderCommittee() != null) {
            application.setTenderCommittee(new Text(applicationDetails.getTenderCommittee()));
        }
        if (application.getWarrantyRequirements() != null && applicationDetails.getWarrantyRequirements() != null) {
            application.getWarrantyRequirements().setContent(applicationDetails.getWarrantyRequirements());
        } else if (applicationDetails.getWarrantyRequirements() != null) {
            application.setWarrantyRequirements(new Text(applicationDetails.getWarrantyRequirements()));
        }
        if (application.getDescription() != null && applicationDetails.getDescription() != null) {
            application.getDescription().setContent(applicationDetails.getDescription());
        } else if (applicationDetails.getDescription() != null) {
            application.setDescription(new Text(applicationDetails.getDescription()));
        }
        application.setOrderIncludedPlanType(applicationDetails.getOrderIncludedPlanType());
        if (application.getContractorContract() != null && applicationDetails.getContractorContract() != null) {
            application.getContractorContract().setContent(applicationDetails.getContractorContract());
        } else if (applicationDetails.getContractorContract() != null) {
            application.setContractorContract(new Text(applicationDetails.getContractorContract()));
        }
        application.setOfferPriceGross(applicationDetails.getOfferPriceGross());
        if (application.getReceivedOffers() != null && applicationDetails.getReceivedOffers() != null) {
            application.getReceivedOffers().setContent(applicationDetails.getReceivedOffers());
        } else if (applicationDetails.getReceivedOffers() != null) {
            application.setReceivedOffers(new Text(applicationDetails.getReceivedOffers()));
        }
        if (application.getJustificationChoosingOffer() != null && applicationDetails.getJustificationChoosingOffer() != null) {
            application.getJustificationChoosingOffer().setContent(applicationDetails.getJustificationChoosingOffer());
        } else if (applicationDetails.getJustificationChoosingOffer() != null) {
            application.setJustificationChoosingOffer(new Text(applicationDetails.getJustificationChoosingOffer()));
        }
        if (application.getJustificationNonCompetitiveProcedure() != null && applicationDetails.getJustificationNonCompetitiveProcedure() != null) {
            application.getJustificationNonCompetitiveProcedure().setContent(applicationDetails.getJustificationNonCompetitiveProcedure());
        } else if (applicationDetails.getJustificationNonCompetitiveProcedure() != null) {
            application.setJustificationNonCompetitiveProcedure(new Text(applicationDetails.getJustificationNonCompetitiveProcedure()));
        }
        if (application.getConditionsParticipation() != null && applicationDetails.getConditionsParticipation() != null) {
            application.getConditionsParticipation().setContent(applicationDetails.getConditionsParticipation());
        } else if (applicationDetails.getConditionsParticipation() != null) {
            application.setConditionsParticipation(new Text(applicationDetails.getConditionsParticipation()));
        }
        application.setIsMarketConsultation(applicationDetails.getIsMarketConsultation());
        application.setIsOrderFinanced(applicationDetails.getIsOrderFinanced());
        application.setIsParticipatedPreparation(applicationDetails.getIsParticipatedPreparation());
        application.setIsSecuringContract(applicationDetails.getIsSecuringContract());
        application.setOrderProcedure(applicationDetails.getOrderProcedure());
        application.setCreateUser(applicationDetails.getCreateUser());
        application.setSendUser(applicationDetails.getSendUser());
        application.setCoordinator(applicationDetails.getCoordinator());
        application.setCoordinatorCombined(applicationDetails.getCoordinatorCombined());
        application.setAssortmentGroups(applicationDetails.getAssortmentGroups());
        application.setParts(applicationDetails.getParts());
        application.setCriteria(applicationDetails.getCriteria());
        if (applicationDetails.getApplicationProtocol() != null && applicationDetails.getEstimationType() != null && applicationDetails.getEstimationType().equals(PublicProcurementPosition.EstimationType.DO50)) {
            if (application.getApplicationProtocol() != null) {
                application.getApplicationProtocol().setId(applicationDetails.getApplicationProtocol().getId());
                application.getApplicationProtocol().setStatus(applicationDetails.getApplicationProtocol().getStatus() != null ? applicationDetails.getApplicationProtocol().getStatus() : ApplicationProtocol.ProtocolStatus.ZP);
                application.getApplicationProtocol().setEmail(applicationDetails.getApplicationProtocol().getEmail());
                application.getApplicationProtocol().setPhone(applicationDetails.getApplicationProtocol().getPhone());
                application.getApplicationProtocol().setInternet(applicationDetails.getApplicationProtocol().getInternet());
                application.getApplicationProtocol().setPaper(applicationDetails.getApplicationProtocol().getPaper());
                application.getApplicationProtocol().setOther(applicationDetails.getApplicationProtocol().getOther());
                if (application.getApplicationProtocol().getOtherDesc() != null && applicationDetails.getApplicationProtocol().getOtherDesc() != null) {
                    application.getApplicationProtocol().getOtherDesc().setContent(applicationDetails.getApplicationProtocol().getOtherDesc());
                } else if (applicationDetails.getApplicationProtocol().getOtherDesc() != null) {
                    application.getApplicationProtocol().setOtherDesc(new Text(applicationDetails.getApplicationProtocol().getOtherDesc()));
                }
                application.getApplicationProtocol().setRenouncement(applicationDetails.getApplicationProtocol().getRenouncement());
                if (application.getApplicationProtocol().getNonCompetitiveOffer() != null && applicationDetails.getApplicationProtocol().getNonCompetitiveOffer() != null) {
                    application.getApplicationProtocol().getNonCompetitiveOffer().setContent(applicationDetails.getApplicationProtocol().getNonCompetitiveOffer());
                } else if (applicationDetails.getApplicationProtocol().getNonCompetitiveOffer() != null) {
                    application.getApplicationProtocol().setNonCompetitiveOffer(new Text(applicationDetails.getApplicationProtocol().getNonCompetitiveOffer()));
                }
                if (application.getApplicationProtocol().getReceivedOffers() != null && applicationDetails.getApplicationProtocol().getReceivedOffers() != null) {
                    application.getApplicationProtocol().getReceivedOffers().setContent(applicationDetails.getApplicationProtocol().getReceivedOffers());
                } else if (applicationDetails.getApplicationProtocol().getReceivedOffers() != null) {
                    application.getApplicationProtocol().setReceivedOffers(new Text(applicationDetails.getApplicationProtocol().getReceivedOffers()));
                }
                if (application.getApplicationProtocol().getJustificationChoosingOffer() != null && applicationDetails.getApplicationProtocol().getJustificationChoosingOffer() != null) {
                    application.getApplicationProtocol().getJustificationChoosingOffer().setContent(applicationDetails.getApplicationProtocol().getJustificationChoosingOffer());
                } else if (applicationDetails.getApplicationProtocol().getJustificationChoosingOffer() != null) {
                    application.getApplicationProtocol().setJustificationChoosingOffer(new Text(applicationDetails.getApplicationProtocol().getJustificationChoosingOffer()));
                }
                //TODO Remove Contractor from Application Protocol. Changed to Contractor Description
                if (applicationDetails.getApplicationProtocol().getContractor() != null && applicationDetails.getApplicationProtocol().getContractor().getId() != null) {
                    application.getApplicationProtocol().setContractor(applicationDetails.getApplicationProtocol().getContractor());
                }
                if (application.getApplicationProtocol().getContractorDesc() != null && applicationDetails.getApplicationProtocol().getContractorDesc() != null) {
                    application.getApplicationProtocol().getContractorDesc().setContent(applicationDetails.getApplicationProtocol().getContractorDesc());
                } else if (applicationDetails.getApplicationProtocol().getContractorDesc() != null) {
                    application.getApplicationProtocol().setContractorDesc(new Text(applicationDetails.getApplicationProtocol().getContractorDesc()));
                }
                application.getApplicationProtocol().setSendUser(applicationDetails.getApplicationProtocol().getSendUser());
                application.getApplicationProtocol().setAccountantAcceptUser(applicationDetails.getApplicationProtocol().getAccountantAcceptUser());
                application.getApplicationProtocol().setChiefAcceptUser(applicationDetails.getApplicationProtocol().getChiefAcceptUser());
                application.getApplicationProtocol().setPrices(applicationDetails.getApplicationProtocol().getPrices());
                if (!application.getApplicationProtocol().getPrices().isEmpty()) {
                    application.getApplicationProtocol().getPrices().forEach(price -> price.setApplicationProtocol(application.getApplicationProtocol()));
                }
            } else {
                ApplicationProtocol protocol = new ApplicationProtocol();
                protocol.setApplication(application);
                protocol.setId(applicationDetails.getApplicationProtocol().getId());
                protocol.setEmail(applicationDetails.getApplicationProtocol().getEmail());
                protocol.setPhone(applicationDetails.getApplicationProtocol().getPhone());
                protocol.setInternet(applicationDetails.getApplicationProtocol().getInternet());
                protocol.setPaper(applicationDetails.getApplicationProtocol().getPaper());
                protocol.setOther(applicationDetails.getApplicationProtocol().getOther());
                if (applicationDetails.getApplicationProtocol().getOtherDesc() != null) {
                    protocol.setOtherDesc(new Text(applicationDetails.getApplicationProtocol().getOtherDesc()));
                }
                protocol.setRenouncement(applicationDetails.getApplicationProtocol().getRenouncement());
                if (applicationDetails.getApplicationProtocol().getNonCompetitiveOffer() != null) {
                    protocol.setNonCompetitiveOffer(new Text(applicationDetails.getApplicationProtocol().getNonCompetitiveOffer()));
                }
                if (applicationDetails.getApplicationProtocol().getReceivedOffers() != null) {
                    protocol.setReceivedOffers(new Text(applicationDetails.getApplicationProtocol().getReceivedOffers()));
                }
                if (applicationDetails.getApplicationProtocol().getJustificationChoosingOffer() != null) {
                    protocol.setJustificationChoosingOffer(new Text(applicationDetails.getApplicationProtocol().getJustificationChoosingOffer()));
                }
                //TODO Remove Contractor from Application Protocol. Changed to Contractor Description
                if (applicationDetails.getApplicationProtocol().getContractor().getId() != null) {
                    protocol.setContractor(applicationDetails.getApplicationProtocol().getContractor());
                }
                if (applicationDetails.getApplicationProtocol().getContractorDesc() != null) {
                    protocol.setContractorDesc(new Text(applicationDetails.getApplicationProtocol().getContractorDesc()));
                }
                protocol.setSendUser(applicationDetails.getApplicationProtocol().getSendUser());
                protocol.setAccountantAcceptUser(applicationDetails.getApplicationProtocol().getAccountantAcceptUser());
                protocol.setChiefAcceptUser(applicationDetails.getApplicationProtocol().getChiefAcceptUser());
                protocol.setPrices(applicationDetails.getApplicationProtocol().getPrices());
                protocol.setStatus(ApplicationProtocol.ProtocolStatus.ZP);
                application.setApplicationProtocol(protocol);
            }
        }
        return application;
    }


    private Set<AssortmentGroupSubsequentYear> generateAssortmentGroupSubsequentYearsValue(Set<ApplicationAssortmentGroupPlanPosition> assortmentGroupPlanPositions) {
        Set<AssortmentGroupSubsequentYear> subsequentYears = new HashSet<>();

        assortmentGroupPlanPositions.forEach(applicationAssortmentGroupPlanPosition -> {
            if (!applicationAssortmentGroupPlanPosition.getSubsequentYears().isEmpty()) {
                applicationAssortmentGroupPlanPosition.getSubsequentYears().forEach(planPositionYear -> {
                    if (subsequentYears.isEmpty()) {
                        AssortmentGroupSubsequentYear tmp = new AssortmentGroupSubsequentYear();
                        tmp.setYear(planPositionYear.getYear());
                        tmp.setYearExpenditureNet(planPositionYear.getYearExpenditureNet());
                        tmp.setYearExpenditureGross(planPositionYear.getYearExpenditureGross());
                        subsequentYears.add(tmp);
                    } else {
                        AssortmentGroupSubsequentYear tmp = subsequentYears.stream().filter(groupSubsequentYear -> groupSubsequentYear.getYear() == planPositionYear.getYear())
                                .findAny().orElse(null);
                        if (tmp == null) {
                            AssortmentGroupSubsequentYear newYear = new AssortmentGroupSubsequentYear();
                            newYear.setYear(planPositionYear.getYear());
                            newYear.setYearExpenditureNet(planPositionYear.getYearExpenditureNet());
                            newYear.setYearExpenditureGross(planPositionYear.getYearExpenditureGross());
                            subsequentYears.add(newYear);
                        } else {
                            tmp.setYearExpenditureNet(tmp.getYearExpenditureNet().add(planPositionYear.getYearExpenditureNet()));
                            tmp.setYearExpenditureGross(tmp.getYearExpenditureGross().add(planPositionYear.getYearExpenditureGross()));
                        }
                    }
                });
            }
        });
        return subsequentYears;
    }

}
