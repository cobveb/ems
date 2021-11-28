package pl.viola.ems.service.modules.publicProcurement.plans.institution.impl;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionCoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionPlanRepository;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanSubPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanPositionRepository;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanPositionResponse;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanResponse;
import pl.viola.ems.service.common.JasperPrintService;
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
    InstitutionCoordinatorPlanPositionRepository institutionCoordinatorPlanPositionRepository;

    @Autowired
    CoordinatorPlanPositionRepository<PublicProcurementPosition> publicProcurementPositionRepository;

    @Autowired
    JasperPrintService jasperPrintService;

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
    public List<PublicInstitutionPlanPositionResponse> getPlanPositions(final Long planId) {
        List<PublicInstitutionPlanPositionResponse> publicInstitutionPlanPositions = new ArrayList<>();

        InstitutionPlan institutionPlan = institutionPlanRepository.findById(planId).orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions;

        institutionCoordinatorPlanPositions = institutionCoordinatorPlanPositionRepository.findByInstitutionPlanPositionIn(institutionPlan.getPlanPositions());

        if (!institutionCoordinatorPlanPositions.isEmpty()) {

            institutionCoordinatorPlanPositions.forEach(institutionPlanPosition -> {
                PublicInstitutionPlanPositionResponse publicInstitutionPlanPosition = new PublicInstitutionPlanPositionResponse(
                        institutionPlanPosition.getCoordinatorPlanPosition().getId(),
                        institutionPlanPosition.getCoordinatorPlanPosition().getAssortmentGroup(),
                        institutionPlanPosition.getCoordinatorPlanPosition().getOrderType(),
                        institutionPlanPosition.getCoordinatorPlanPosition().getEstimationType(),
                        institutionPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator(),
                        institutionPlanPosition.getCoordinatorPlanPosition().getAmountRequestedNet(),
                        institutionPlanPosition.getCoordinatorPlanPosition().getStatus()
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
    public void exportPlanToJasper(Long planId, String type, HttpServletResponse response) throws IOException, JRException, SQLException {
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(planId, type.equals("details") ?
                "/jasper/prints/modules/publicProcurement/plans/institutionPlanDetails.jrxml" :
                "/jasper/prints/modules/publicProcurement/plans/institutionPlan.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }

    @Override
    public void exportPlanPositionsToExcel(ExportType exportType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException {
        InstitutionPlan plan = institutionPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        ArrayList<Map<String, Object>> rows = new ArrayList<>();
        List<PublicInstitutionPlanPositionResponse> planPositions = this.getPlanPositions(plan.getId());
        planPositions.forEach(position -> {
            Map<String, Object> row = new HashMap<>();
            row.put("coordinator.name", position.getCoordinator().getName());
            row.put("assortmentGroup.name", position.getAssortmentGroup().getName());
            row.put("orderType.name", position.getOrderType().name());
            row.put("estimationType.name", position.getEstimationType().name());
            row.put("amountRequestedNet", position.getAmountRequestedNet());
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
}
