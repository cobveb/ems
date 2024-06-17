package pl.viola.ems.controller.modules.coordinator.plans;

import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanSubPosition;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;
import static pl.viola.ems.utils.Utils.generateJasperResponse;

@RestController
@RequestMapping("/api/coordinator")
public class PlanController {
    @Autowired
    PlanService planService;

    @Autowired
    InvoiceService invoiceService;

    @GetMapping("/plans/{year}/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1022')")
    public ApiResponse getPlansByCoordinator(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, planService.findByCoordinator(year));
    }

    @GetMapping("/plan/{planId}/getPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1022')")
    public ApiResponse getPositionsByPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, planService.findPositionsByPlan(planId));
    }

    @PutMapping("/plan/{action}/savePlan")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse savePlan(@RequestBody @Valid CoordinatorPlan plan, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, planService.savePlan(plan, action, Utils.getCurrentUser()));
    }

    @PutMapping("/plan/send/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4022')")
    public ApiResponse sendPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.updatePlanStatus(planId, CoordinatorPlan.PlanStatus.WY));
    }

    @PutMapping("/plan/withdraw/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5022')")
    public ApiResponse withdrawPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.updatePlanStatus(planId, CoordinatorPlan.PlanStatus.ZP));
    }

    @DeleteMapping("/plan/deletePlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deletePlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.deletePlan(planId));
    }

    @PutMapping("/plan/{planId}/{action}/savePlanPosition")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse savePlanPosition(@RequestBody @Valid CoordinatorPlanPosition position, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, planService.savePlanPosition(position, action));
    }

    @DeleteMapping("/plan/position/{positionId}/deleteSubPosition")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deleteSubPosition(@RequestBody @Valid CoordinatorPlanSubPosition subPosition, @PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.deleteSubPosition(subPosition, positionId));
    }

    @DeleteMapping("/plan/{planId}/deletePlanPosition/{planPositionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deletePlanPosition(@PathVariable Long planId, @PathVariable Long planPositionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.deletePlanPosition(planId, planPositionId));
    }

    @PutMapping("/export/plans/{exportType}")
    public void exportPlansToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                  @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        planService.exportPlansToExcel(exportType, "coordinator", headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/export/planPositions/{planType}/{planId}/{exportType}")
    public void exportPlanPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow, @PathVariable CoordinatorPlan.PlanType planType,
                                          @PathVariable ExportType exportType, @PathVariable Long planId, HttpServletResponse response) throws IOException {

        planService.exportPlanPositionsToExcel(exportType, planType, planId, headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/export/planPositionSubPositions/{planType}/{positionId}/{exportType}")
    public void exportSubPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow, @PathVariable CoordinatorPlan.PlanType planType,
                                         @PathVariable ExportType exportType, @PathVariable Long positionId, HttpServletResponse response) throws IOException {

        planService.exportSubPositionsToExcel(exportType, planType, positionId, headRow, generateExportResponse(response, exportType));
    }

    @GetMapping("/plan/print/{planId}")
    public void generatePlan(@PathVariable Long planId, HttpServletResponse response) throws JRException, SQLException, IOException {
        planService.exportPlanToJasper(planId, generateJasperResponse(response, JasperExportType.PDF));
    }

    @PutMapping("/plan/update/{planId}")
    public ApiResponse updatePlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.CREATED, planService.updatePlan(planId));
    }

    @DeleteMapping("/plan/position/deleteTargetUnit/{unitId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deleteTargetUnit(@PathVariable Long unitId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.deleteTargetUnit(unitId));
    }

    @DeleteMapping("/plan/position/{positionId}/deleteSource/{sourceId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deleteInvestmentSource(@PathVariable Long positionId, @PathVariable Long sourceId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.deleteInvestmentSource(positionId, sourceId));
    }

    @PutMapping("/export/planPositionInvoicesPositions/{positionId}/{exportType}")
    public void exportPlanPositionInvoicesPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                                          @PathVariable ExportType exportType, @PathVariable Long positionId, HttpServletResponse response) throws IOException {

        invoiceService.exportPlanPositionInvoicesPositionsToXlsx(exportType, positionId, headRow, generateExportResponse(response, exportType), null);
    }

    @PutMapping("/export/planPositionInvoicesPositions/{planType}/{positionId}/{exportType}")
    public void exportPlanPositionInvoicesPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                                          @PathVariable CoordinatorPlan.PlanType planType, @PathVariable ExportType exportType, @PathVariable Long positionId, HttpServletResponse response) throws IOException {

        invoiceService.exportPlanPositionInvoicesPositionsToXlsx(exportType, positionId, headRow, generateExportResponse(response, exportType), planType);
    }
}
