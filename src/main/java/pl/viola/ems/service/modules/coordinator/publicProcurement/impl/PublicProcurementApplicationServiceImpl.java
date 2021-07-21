package pl.viola.ems.service.modules.coordinator.publicProcurement.impl;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationAssortmentGroup;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationCriterion;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationPart;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.PublicProcurementApplicationAssortmentGroupRepository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.PublicProcurementApplicationRepository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.PublicProcurementCriterionRepository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.PublicProcurementPartRepository;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProcurementPlanPosition;
import pl.viola.ems.service.common.JasperPrintService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.*;

@Service
public class PublicProcurementApplicationServiceImpl implements PublicProcurementApplicationService {
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

    @Override
    public List<ApplicationProcurementPlanPosition> getPlanPositionByYear() {
        List<ApplicationProcurementPlanPosition> positions = new ArrayList<>();

        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        List<PublicProcurementPosition> planPositions = planService.getPublicProcurementPositionByYear();

        if (!planPositions.isEmpty()) {
            planPositions.forEach(publicProcurementPosition -> {
                ApplicationProcurementPlanPosition applicationProcurementPlanPosition = new ApplicationProcurementPlanPosition(
                        publicProcurementPosition.getId(),
                        publicProcurementPosition.getAssortmentGroup().getCode(),
                        publicProcurementPosition.getAssortmentGroup().getName(),
                        publicProcurementPosition.getEstimationType().name(),
                        publicProcurementPosition.getOrderType().name(),
                        publicProcurementPosition.getInitiationTerm(),
                        publicProcurementPosition.getAmountRequestedNet(),
                        publicProcurementPosition.getAmountRealizedNet(),
                        publicProcurementPosition.getAmountInferredNet(),
                        publicProcurementPosition.getVat()
                );
                positions.add(applicationProcurementPlanPosition);
            });
        }
        return positions;
    }

    @Override
    public List<Application> getApplicationsByCoordinator() {

        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        return new ArrayList<>(publicProcurementApplicationRepository.findByCoordinatorIn(coordinators));
    }

    @Transactional
    @Override
    public Application saveApplication(final Application application, final String action, final User principal) {
        if (action.equals("add")) {
            application.setCoordinator(principal.getOrganizationUnit());
            application.setCreateUser(principal);
            application.setCreateDate(new Date());

        }

        return publicProcurementApplicationRepository.save(application);
    }

    @Transactional
    @Override
    public Application saveApplicationAssortmentGroup(final Long applicationId, final ApplicationAssortmentGroup applicationAssortmentGroup, final String action) {

        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

        applicationAssortmentGroup.setApplication(application);
        applicationAssortmentGroup.setPlanPosition(
                planService.getPublicProcurementPositionById(applicationAssortmentGroup.getApplicationProcurementPlanPosition().getId())
                        .orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))
        );
        ApplicationAssortmentGroup applicationAssortmentGroup1 = publicProcurementApplicationAssortmentGroupRepository.save(applicationAssortmentGroup);
        application.setEstimationType(applicationAssortmentGroup.getPlanPosition().getEstimationType());
        if (action.equals("add")) {
            if (application.getAssortmentGroups().isEmpty()) {
                application.setOrderValueNet(applicationAssortmentGroup.getOrderGroupValueNet());
                application.setOrderValueGross(applicationAssortmentGroup.getOrderGroupValueGross());
            } else {
                application.setOrderValueNet(application.getOrderValueNet().add(applicationAssortmentGroup.getOrderGroupValueNet()));
                application.setOrderValueGross(application.getOrderValueGross().add(applicationAssortmentGroup.getOrderGroupValueGross()));
            }
            application.getAssortmentGroups().add(applicationAssortmentGroup1);
            if (application.getAssortmentGroups().size() > 1) {
                application.setEstimationType(null);
            }

        } else {
            application.setOrderValueNet(application.getAssortmentGroups().stream().map(ApplicationAssortmentGroup::getOrderGroupValueNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            application.setOrderValueGross(application.getAssortmentGroups().stream().map(ApplicationAssortmentGroup::getOrderGroupValueGross).reduce(BigDecimal.ZERO, BigDecimal::add));
        }


        return publicProcurementApplicationRepository.save(application);
    }

    @Transactional
    @Override
    public Application deleteApplicationAssortmentGroup(Long applicationAssortmentGroupId) {
        Optional<ApplicationAssortmentGroup> applicationAssortmentGroup = Optional.ofNullable(publicProcurementApplicationAssortmentGroupRepository.findById(applicationAssortmentGroupId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.assortmentGroupNotFound", HttpStatus.NOT_FOUND)));

        Application application = applicationAssortmentGroup.get().getApplication();
        publicProcurementApplicationAssortmentGroupRepository.deleteById(applicationAssortmentGroupId);
        if (application.getAssortmentGroups().size() == 1) {
            application.setEstimationType(application.getAssortmentGroups().stream().findFirst().get().getPlanPosition().getEstimationType());
        } else {
            application.setEstimationType(null);
        }
        application.setOrderValueNet(application.getAssortmentGroups().stream().map(ApplicationAssortmentGroup::getOrderGroupValueNet).reduce(BigDecimal.ZERO, BigDecimal::add));
        return publicProcurementApplicationRepository.save(application);

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

        return publicProcurementPartRepository.save(applicationPart);
    }

    @Transactional
    @Override
    public String deleteApplicationPart(Long applicationPartId) {
        if (publicProcurementPartRepository.existsById(applicationPartId)) {
            publicProcurementPartRepository.deleteById(applicationPartId);

            return messageSource.getMessage("Coordinator.publicProcurement.application.deletePartMsg", null, Locale.getDefault());
        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "Coordinator.publicProcurement.application.partNotFound");
        }
    }

    @Transactional
    @Override
    public ApplicationCriterion saveApplicationCriterion(Long applicationId, ApplicationCriterion applicationCriterion, String action) {
        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));

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
    public Application updateApplicationStatus(Long applicationId, Application.ApplicationStatus newStatus) {
        User user = Utils.getCurrentUser();

        Application application = publicProcurementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND));
        if (newStatus.equals(Application.ApplicationStatus.WY)) {
            application.setNumber(publicProcurementApplicationRepository.generateApplicationNumber(application.getCoordinator().getCode(), application.getMode().name()));
            application.setSendDate(new Date());
            application.setSendUser(user);
            application.getAssortmentGroups().forEach(position -> {
                ApplicationProcurementPlanPosition planPosition = position.getApplicationProcurementPlanPosition();
                planPosition.setAmountInferredNet(position.getApplicationProcurementPlanPosition().getAmountInferredNet() == null ?
                        position.getOrderGroupValueNet() :
                        position.getApplicationProcurementPlanPosition().getAmountInferredNet().add(position.getOrderGroupValueNet()));
                planService.updateInferredPositionValue(planPosition);
            });
        } else if (application.getStatus().equals(Application.ApplicationStatus.WY) & newStatus.equals(Application.ApplicationStatus.ZP)) {
            application.setSendDate(null);
            application.setSendUser(null);
            application.getAssortmentGroups().forEach(position -> {
                ApplicationProcurementPlanPosition planPosition = position.getApplicationProcurementPlanPosition();
                planPosition.setAmountInferredNet(position.getApplicationProcurementPlanPosition().getAmountInferredNet().subtract(position.getOrderGroupValueNet()));

                planService.updateInferredPositionValue(planPosition);
                position.setApplicationProcurementPlanPosition(planPosition);
            });
        }
        application.setStatus(newStatus);
        return publicProcurementApplicationRepository.save(application);
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

        List<Application> applications = getApplicationsByCoordinator();

        applications.forEach(application -> {
            Map<String, Object> row = new HashMap<>();
            row.put("number", application.getNumber());
            row.put("orderedObject", application.getOrderedObject());
            row.put("estimationType.name", application.getEstimationType());
            row.put("mode.name", application.getMode().name());
            row.put("orderValue", application.getOrderValueBased());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, headRow, rows, response);

    }

    @Override
    public void exportApplicationToJasper(Long applicationId, HttpServletResponse response) throws IOException, JRException, SQLException {
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(applicationId, "/jasper/prints/modules/coordinator/publicProcurement/application.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }


}
