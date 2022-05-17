package pl.viola.ems.service.modules.publicProcurement.plans.institution.impl;

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
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionCoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionPlanRepository;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanSubPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanRepository;
import pl.viola.ems.model.modules.publicProcurement.institution.plans.InstitutionPublicProcurementPlanPosition;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanPositionRequest;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanPositionResponse;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanResponse;
import pl.viola.ems.service.common.JasperPrintService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.publicProcurement.plans.institution.PublicInstitutionPlanService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.*;

@Service
public class PublicInstitutionPlanServiceImpl implements PublicInstitutionPlanService {
    @Autowired
    InstitutionPlanRepository institutionPlanRepository;

    @Autowired
    CoordinatorPlanPositionRepository<PublicProcurementPosition> publicProcurementPositionRepository;

    @Autowired
    InstitutionPlanPositionRepository institutionPlanPositionRepository;

    @Autowired
    JasperPrintService jasperPrintService;

    @Autowired
    MessageSource messageSource;

    @Autowired
    CoordinatorPlanRepository coordinatorPlanRepository;

    @Autowired
    PlanService coordinatorPlanServices;

    @Autowired
    InstitutionCoordinatorPlanPositionRepository institutionCoordinatorPlanPositionRepository;

    @Override
    public List<PublicInstitutionPlanResponse> getPlans(String levelAccess) {
        List<PublicInstitutionPlanResponse> publicInstitutionPlans = new ArrayList<>();
        List<InstitutionPlan> institutionPlans = institutionPlanRepository.findByType(CoordinatorPlan.PlanType.PZP);

        if (!institutionPlans.isEmpty()) {
            institutionPlans.forEach(institutionPlan -> publicInstitutionPlans.add(setPlanAmountValues(institutionPlan)));
        }

        return publicInstitutionPlans;
    }

    @Override
    public Set<InstitutionPlanPosition> getPlanPositions(final Long planId) {

        InstitutionPlan institutionPlan = institutionPlanRepository.findById(planId).orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        return institutionPlan.getPlanPositions();
    }

    @Override
    public List<PublicInstitutionPlanPositionResponse> getPlanPublicPositions(final Long positionId) {
        List<PublicInstitutionPlanPositionResponse> publicInstitutionPlanPositions = new ArrayList<>();

        InstitutionPlanPosition institutionPlanPosition = institutionPlanPositionRepository.findById(positionId)
                .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));

        if (!institutionPlanPosition.getInstitutionCoordinatorPlanPositions().isEmpty()) {

            institutionPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(institutionCoordinatorPlanPosition -> {
                PublicInstitutionPlanPositionResponse publicInstitutionPlanPosition = new PublicInstitutionPlanPositionResponse(
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getId(),
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAssortmentGroup(),
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getOrderType(),
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getEstimationType(),
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator(),
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAmountRequestedNet(),
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getStatus()
                );

                publicInstitutionPlanPositions.add(publicInstitutionPlanPosition);
            });
        }

        return publicInstitutionPlanPositions;
    }

    @Override
    public List<CoordinatorPlanSubPosition> getPlanSubPositions(final Long positionId) {
        List<CoordinatorPlanSubPosition> planSubPositions = new ArrayList<>();

        PublicProcurementPosition publicProcurementPosition = publicProcurementPositionRepository.findById(positionId).orElse(null);

        if (publicProcurementPosition != null && !publicProcurementPosition.getSubPositions().isEmpty()) {
            planSubPositions.addAll(publicProcurementPosition.getSubPositions());
        }

        return planSubPositions;
    }

    @Override
    @Transactional
    public String correctPlanSubPositions(final PublicInstitutionPlanPositionRequest institutionPlanPositionRequest) {

        List<PublicProcurementPosition> procurementPositions = new ArrayList<>();
        InstitutionPublicProcurementPlanPosition institutionPlanPosition = (InstitutionPublicProcurementPlanPosition) institutionPlanPositionRepository.findById(institutionPlanPositionRequest.getId())
                .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));
        if (!institutionPlanPosition.getEstimationType().equals(institutionPlanPositionRequest.getEstimationType())) {
            institutionPlanPosition.setEstimationType(institutionPlanPositionRequest.getEstimationType());
        }

        if (!institutionPlanPosition.getOrderType().equals(institutionPlanPositionRequest.getOrderType())) {
            institutionPlanPosition.setOrderType(institutionPlanPositionRequest.getOrderType());
        }
        if (!institutionPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) {
            institutionPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
        }

        institutionPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(institutionCoordinatorPlanPosition -> procurementPositions.add((PublicProcurementPosition) institutionCoordinatorPlanPosition.getCoordinatorPlanPosition()));

        procurementPositions.forEach(publicProcurementPosition -> {
            if (!publicProcurementPosition.getEstimationType().equals(institutionPlanPositionRequest.getEstimationType())) {
                publicProcurementPosition.setEstimationType(institutionPlanPositionRequest.getEstimationType());
                publicProcurementPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
            }
            if (!publicProcurementPosition.getOrderType().equals(institutionPlanPositionRequest.getOrderType())) {
                publicProcurementPosition.setOrderType(institutionPlanPositionRequest.getOrderType());
                if (!publicProcurementPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) {
                    publicProcurementPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
                }
            }
        });

        institutionPlanPositionRepository.save(institutionPlanPosition);

        return messageSource.getMessage("Public.institutionPlanPosition.correctMsg", null, Locale.getDefault());
    }

    @Override
    @Transactional
    public String approvePlanPosition(Long positionId) {
        InstitutionPlanPosition institutionPlanPosition = institutionPlanPositionRepository.findById(positionId)
                .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));

        institutionPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZA);

        institutionPlanPositionRepository.save(institutionPlanPosition);

        return messageSource.getMessage("Public.institutionPlanPosition.approveMsg", null, Locale.getDefault());
    }

    @Override
    @Transactional
    public InstitutionPlan.InstitutionPlanStatus updatePlanStatus(Long planId, String action) {
        InstitutionPlan plan = institutionPlanRepository.findById(planId).orElseThrow(() -> new AppException("Accountant.institution.planNotFound", HttpStatus.NOT_FOUND));

        User user = Utils.getCurrentUser();

        if (!plan.getIsCorrected()) {
            List<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByStatusAndTypeAndYear(action.equals("approve") ?
                    CoordinatorPlan.PlanStatus.WY : CoordinatorPlan.PlanStatus.AZ, plan.getType(), plan.getYear());

            coordinatorPlans.forEach(coordinatorPlan -> {
                if (action.equals("approve")) {
                    coordinatorPlan.setStatus(CoordinatorPlan.PlanStatus.AZ);
                    coordinatorPlan.setPublicAcceptUser(user);
                } else if (action.equals("withdraw")) {
                    coordinatorPlan.setStatus(CoordinatorPlan.PlanStatus.WY);
                    coordinatorPlan.setPublicAcceptUser(null);
                    coordinatorPlan.setChiefAcceptUser(null);
                    coordinatorPlan.setEconomicAcceptUser(null);
                    coordinatorPlan.setDirectorAcceptUser(null);
                    coordinatorPlan.setPlanAcceptUser(null);
                }
            });
            coordinatorPlanRepository.saveAll(coordinatorPlans);

            plan.setApproveUser(action.equals("approve") ? user : null);
            plan.setStatus(action.equals("approve") ? InstitutionPlan.InstitutionPlanStatus.AZ : InstitutionPlan.InstitutionPlanStatus.UT);

        } else {
            List<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByStatusAndTypeAndYear(CoordinatorPlan.PlanStatus.AN, plan.getType(), plan.getYear());

            coordinatorPlans.forEach(coordinatorPlan -> {
                coordinatorPlan.setStatus(CoordinatorPlan.PlanStatus.ZA);
            });

            coordinatorPlanRepository.saveAll(coordinatorPlans);
            plan.setStatus(InstitutionPlan.InstitutionPlanStatus.AD);
        }
        return institutionPlanRepository.save(plan).getStatus();
    }

    @Override
    @Transactional
    public void updateInstitutionPublicProcurementPlan(CoordinatorPlan coordinatorPlan) {
        InstitutionPlan institutionPlan = institutionPlanRepository.findByYearAndTypeAndStatus(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.PZP, InstitutionPlan.InstitutionPlanStatus.UT);

        //Institution plan not exist
        if (institutionPlan == null) {
            /*
                Create copy Institution plan on approve chief Public Procurement first coordinator plan update
            */

            InstitutionPlan oldInstitutionPlan = institutionPlanRepository.findByYearAndTypeAndStatus(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.PZP, InstitutionPlan.InstitutionPlanStatus.AD);
            oldInstitutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AA);
            oldInstitutionPlan.getPlanPositions().forEach(planPositions -> planPositions.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA));
            institutionPlanRepository.save(oldInstitutionPlan);

            institutionPlan = new InstitutionPlan(coordinatorPlan.getYear(), InstitutionPlan.InstitutionPlanStatus.UT, coordinatorPlan.getType());
            institutionPlan.setCorrectionPlan(oldInstitutionPlan);
            institutionPlan.setUpdateNumber(oldInstitutionPlan.getUpdateNumber() != null ? oldInstitutionPlan.getUpdateNumber() + 1 : 1);
            List<InstitutionPublicProcurementPlanPosition> institutionPublicProcurementPlanPositions = new ArrayList<>();

            InstitutionPlan finalInstitutionPlan = institutionPlan;
            institutionPlan.setUpdateNumber(oldInstitutionPlan.getUpdateNumber() == null ? 1 : oldInstitutionPlan.getUpdateNumber() + 1);
            oldInstitutionPlan.getPlanPositions().forEach(oldPlanPosition -> {
                InstitutionPublicProcurementPlanPosition institutionPublicProcurementPlanPosition = new InstitutionPublicProcurementPlanPosition(
                        CoordinatorPlanPosition.PlanPositionStatus.ZA,
                        oldPlanPosition.getAmountRequestedNet(),
                        oldPlanPosition.getAmountRequestedGross(),
                        finalInstitutionPlan,
                        oldPlanPosition.getEstimationType(),
                        oldPlanPosition.getOrderType(),
                        oldPlanPosition.getAssortmentGroup()
                );
                institutionPublicProcurementPlanPosition.setAmountAwardedNet(oldPlanPosition.getAmountAwardedNet());
                institutionPublicProcurementPlanPosition.setAmountAwardedGross(oldPlanPosition.getAmountAwardedGross());
                institutionPublicProcurementPlanPosition.setAmountRealizedNet(oldPlanPosition.getAmountRealizedNet());
                institutionPublicProcurementPlanPosition.setAmountRealizedGross(oldPlanPosition.getAmountRealizedGross());
                institutionPublicProcurementPlanPosition.setAmountInferredNet(oldPlanPosition.getAmountInferredNet());
                institutionPublicProcurementPlanPosition.setAmountInferredGross(oldPlanPosition.getAmountInferredGross());
                institutionPublicProcurementPlanPosition.setAmountArt30Net(oldPlanPosition.getAmountArt30Net());
                institutionPublicProcurementPlanPosition.setAmountArt30Gross(oldPlanPosition.getAmountArt30Gross());
                institutionPublicProcurementPlanPosition.setCorrectionPlanPosition(oldPlanPosition);
                institutionPublicProcurementPlanPositions.add(institutionPublicProcurementPlanPosition);
                List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();
                oldPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(oldInstitutionCoordinatorPlanPosition -> {
                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(
                            oldInstitutionCoordinatorPlanPosition.getCoordinatorPlanPosition(), institutionPublicProcurementPlanPosition);

                    institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                });
                institutionPublicProcurementPlanPosition.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));

            });
            institutionPlan.setPlanPositions(new HashSet<>(institutionPublicProcurementPlanPositions));


            /*List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();
            List<PublicProcurementPosition> publicProcurementPositions = coordinatorPlanServices.findPositionsByPlan(coordinatorPlan.getId());
            InstitutionPlan institutionPublicProcurementPlan = institutionPlan;
            publicProcurementPositions.forEach(publicProcurementPosition -> {
                InstitutionPublicProcurementPlanPosition institutionPublicProcurementPlanPosition = new InstitutionPublicProcurementPlanPosition(
                    publicProcurementPosition.getStatus(),
                    publicProcurementPosition.getAmountRequestedNet(),
                    publicProcurementPosition.getAmountRequestedGross(),
                    institutionPublicProcurementPlan,
                    publicProcurementPosition.getEstimationType(),
                    publicProcurementPosition.getOrderType(),
                    publicProcurementPosition.getAssortmentGroup()
                );
//                institutionPublicProcurementPlanPositions.add(institutionPublicProcurementPlanPosition);
                InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(publicProcurementPosition, institutionPublicProcurementPlanPosition);
                institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                institutionPublicProcurementPlanPosition.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));
            });
            institutionPlan.setPlanPositions(new HashSet<>(institutionPublicProcurementPlanPositions));*/
        }
//        else {
            /*
                Update Institution plan on approve by chief Public Procurement coordinator plan update
            */
//            InstitutionPlan institutionPlanUpd = institutionPlan;
//            if (!institutionPlan.getPlanPositions().isEmpty()) {
//                coordinatorPlan.getPositions().forEach(coordinatorPlanPosition -> {
//                    if (institutionPlanUpd.getPlanPositions().stream().anyMatch(institutionPlanUpdPosition -> institutionPlanUpdPosition.getAssortmentGroup().equals(coordinatorPlanPosition.getAssortmentGroup()))) {
//                        InstitutionPlanPosition institutionPlanPosition = institutionPlanUpd.getPlanPositions().stream().filter(institutionPlanUpdPosition -> institutionPlanUpdPosition.getAssortmentGroup().equals(coordinatorPlanPosition.getAssortmentGroup())).findFirst().orElse(null);
//                        institutionPlanPosition.getInstitutionCoordinatorPlanPositions().add(new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition));
//                        institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
//                        institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
//                    } else {
//                        Set<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new HashSet<>();
//                        InstitutionPublicProcurementPlanPosition institutionPlanPosition = new InstitutionPublicProcurementPlanPosition(
//                            coordinatorPlanPosition.getStatus(),
//                            coordinatorPlanPosition.getAmountRequestedNet(),
//                            coordinatorPlanPosition.getAmountRequestedGross(),
//                            institutionPlanUpd,
//                            coordinatorPlanPosition.getEstimationType(),
//                            coordinatorPlanPosition.getOrderType(),
//                            coordinatorPlanPosition.getAssortmentGroup()
//                        );
//
//                        InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition);
//                        institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
//                        institutionPlanPosition.setInstitutionCoordinatorPlanPositions(institutionCoordinatorPlanPositions);
//                        institutionPlanUpd.getPlanPositions().add(institutionPlanPosition);
//                    }
//                });
//            } else {
//                List<InstitutionPublicProcurementPlanPosition> institutionPublicProcurementPlanPositions = new ArrayList<>();
//                List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();
//
//                coordinatorPlan.getPositions().forEach(financialPosition -> {
//                    InstitutionPublicProcurementPlanPosition institutionPlanPosition = new InstitutionPublicProcurementPlanPosition(
//                            financialPosition.getStatus(),
//                            financialPosition.getAmountRequestedNet(),
//                            financialPosition.getAmountRequestedGross(),
//                            institutionPlanUpd,
//                            financialPosition.getEstimationType(),
//                            financialPosition.getOrderType(),
//                            financialPosition.getAssortmentGroup()
//                    );
//                    institutionPublicProcurementPlanPositions.add(institutionPlanPosition);
//
//                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(financialPosition, institutionPlanPosition);
//
//                    institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
//                    institutionPlanPosition.setInstitutionCoordinatorPlanPositions(institutionCoordinatorPlanPositions.stream().collect(Collectors.toSet()));
//
//                });
//                institutionPlan.setPlanPositions(institutionPublicProcurementPlanPositions.stream().collect(Collectors.toSet()));
//            }
//        }
//        updatePlanPositions(coordinatorPlan, institutionPlan);
        institutionPlanRepository.save(updatePlanPositions(coordinatorPlan, institutionPlan));
    }

    @Override
    public void exportPlanToJasper(Long planId, String type, HttpServletResponse response) throws IOException, JRException, SQLException {
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(planId, type.equals("details") ?
                "/jasper/prints/modules/publicProcurement/plans/institutionPlanDetails.jrxml" :
                type.equals("double") ?
                        "/jasper/prints/modules/publicProcurement/plans/duplicateGroups.jrxml" :
                        type.equals("update") ?
                                "/jasper/prints/modules/publicProcurement/plans/institutionPlanUpdate.jrxml" :
                                "/jasper/prints/modules/publicProcurement/plans/institutionPlan.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }

    @Override
    public void exportPlanPositionsToExcel(ExportType exportType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException {
        InstitutionPlan plan = institutionPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        ArrayList<Map<String, Object>> rows = new ArrayList<>();
        plan.getPlanPositions().forEach(position -> {
            Map<String, Object> row = new HashMap<>();
            row.put("assortmentGroup.name", position.getAssortmentGroup().getName());
            row.put("estimationType.name", position.getEstimationType().name());
            row.put("amountRequestedNet", position.getAmountRequestedNet());
            row.put("status.name", position.getStatus().name());
            rows.add(row);
        });
        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    private PublicInstitutionPlanResponse setPlanAmountValues(InstitutionPlan plan) {
        PublicInstitutionPlanResponse institutionPlan = new PublicInstitutionPlanResponse();
        institutionPlan.setId(plan.getId());
        institutionPlan.setYear(plan.getYear());
        institutionPlan.setStatus(plan.getStatus());
        institutionPlan.setType(plan.getType());
        institutionPlan.setCorrectionPlan(plan.getCorrectionPlan());
        institutionPlan.setApproveUser(plan.getApproveUser());
        institutionPlan.setChiefAcceptUser(plan.getChiefAcceptUser());
        institutionPlan.setIsCorrected(plan.getIsCorrected());
        if (!plan.getPlanPositions().isEmpty()) {
            institutionPlan.setAmountRequestedNet(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            institutionPlan.setAmountRealizedNet(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRealizedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return institutionPlan;
    }

    private InstitutionPlan updatePlanPositions(CoordinatorPlan coordinatorPlan, InstitutionPlan institutionPlanUpd) {

        coordinatorPlan.getPositions().forEach(coordinatorPlanPosition -> {
            if (institutionPlanUpd.getPlanPositions().stream().anyMatch(institutionPlanUpdPosition -> institutionPlanUpdPosition.getAssortmentGroup().equals(coordinatorPlanPosition.getAssortmentGroup()))) {
                InstitutionPlanPosition institutionPlanPosition = institutionPlanUpd.getPlanPositions().stream().filter(institutionPlanUpdPosition -> institutionPlanUpdPosition.getAssortmentGroup().equals(coordinatorPlanPosition.getAssortmentGroup())).findFirst().orElse(null);
                InstitutionCoordinatorPlanPosition oldInstitutionCoordinatorPlanPosition = institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getId().equals(coordinatorPlanPosition.getCorrectionPlanPosition().getId())).findFirst().orElse(null);
                InstitutionCoordinatorPlanPosition correctedInstitutionCoordinatorPlanPosition = institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getId().equals(coordinatorPlanPosition.getCorrectionPlanPosition().getId()) && coordinatorPlanPosition.getAmountRequestedNet().compareTo(coordinatorPlanPosition.getCorrectionPlanPosition().getAmountRequestedNet()) != 0).findFirst().orElse(null);
                institutionPlanPosition.getInstitutionCoordinatorPlanPositions().add(new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition));
                if (correctedInstitutionCoordinatorPlanPosition != null) {
                    institutionPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.WY);
                }
                institutionPlanPosition.getInstitutionCoordinatorPlanPositions().remove(oldInstitutionCoordinatorPlanPosition);
                institutionCoordinatorPlanPositionRepository.delete(oldInstitutionCoordinatorPlanPosition);
                institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
            } else {
                Set<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new HashSet<>();
                InstitutionPublicProcurementPlanPosition institutionPlanPosition = new InstitutionPublicProcurementPlanPosition(
                        coordinatorPlanPosition.getStatus(),
                        coordinatorPlanPosition.getAmountRequestedNet(),
                        coordinatorPlanPosition.getAmountRequestedGross(),
                        institutionPlanUpd,
                        coordinatorPlanPosition.getEstimationType(),
                        coordinatorPlanPosition.getOrderType(),
                        coordinatorPlanPosition.getAssortmentGroup()
                );
                institutionPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.WY);
                InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition);
                institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                institutionPlanPosition.setInstitutionCoordinatorPlanPositions(institutionCoordinatorPlanPositions);
                institutionPlanUpd.getPlanPositions().add(institutionPlanPosition);
            }
        });
        return institutionPlanUpd;
    }
}
