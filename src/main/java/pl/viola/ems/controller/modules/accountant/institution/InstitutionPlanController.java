package pl.viola.ems.controller.modules.accountant.institution;

import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.accountant.institution.InstitutionPlanService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static pl.viola.ems.utils.Utils.generateExportResponse;
import static pl.viola.ems.utils.Utils.generateJasperResponse;

@RestController
@RequestMapping("/api/accountant/institution/plans")
public class InstitutionPlanController {

    @Autowired
    InstitutionPlanService institutionPlanService;

    @GetMapping("/getPlans")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1034')")
    public ApiResponse getInstitutionPlans() {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getPlans("accountant"));
    }

    @GetMapping("/getPlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1034', '1025')")
    public ApiResponse getInstitutionPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getPlan(planId));
    }

    @GetMapping("/getCoordinatorPlanPosition/{positionId}")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1034', '1025')")
    public ApiResponse getCoordinatorPlanPosition(@PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getCoordinatorPlanPositions(positionId));
    }

    @PutMapping("/acceptPlanPositions/{planType}/{positionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2034')")
    public ApiResponse acceptPlanPositions(@RequestBody @Valid List<InstitutionCoordinatorPlanPosition> positions, @PathVariable String planType, @PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.CREATED, institutionPlanService.updatePlanPositions(positions, planType.equals("FIN") ? CoordinatorPlan.PlanType.FIN : CoordinatorPlan.PlanType.INW, positionId, "accept"));
    }

    @PutMapping("/correctPlanPositions/{planType}/{positionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2034')")
    public ApiResponse correctPlanPositions(@RequestBody @Valid List<InstitutionCoordinatorPlanPosition> positions, @PathVariable String planType, @PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.CREATED, institutionPlanService.updatePlanPositions(positions, planType.equals("FIN") ? CoordinatorPlan.PlanType.FIN : CoordinatorPlan.PlanType.INW, positionId, "correct"));
    }

    @PutMapping("/approvePlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3034')")
    public ApiResponse approveAccountantPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, institutionPlanService.updatePlanStatus(planId, "approve", "accountant"));
    }

    @PutMapping("/withdrawPlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4034')")
    public ApiResponse withdrawAccountantPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, institutionPlanService.updatePlanStatus(planId, "withdraw", "accountant"));
    }

    @GetMapping("/plan/print/{planId}")
    public void generateInstitutionPlan(@PathVariable Long planId, HttpServletResponse response) throws JRException, SQLException, IOException {
        institutionPlanService.exportPlanToJasper(planId, generateJasperResponse(response, JasperExportType.PDF));
    }

    @PutMapping("/export/plans/{exportType}")
    public void exportPlansToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                  @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        institutionPlanService.exportPlansToExcel(exportType, "director", headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/export/planPositions/{planType}/{planId}/{exportType}")
    public void exportPlanPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow, @PathVariable CoordinatorPlan.PlanType planType,
                                          @PathVariable ExportType exportType, @PathVariable Long planId, HttpServletResponse response) throws IOException {

        institutionPlanService.exportPlanPositionsToExcel(exportType, planType.name().equals("FIN") ? CoordinatorPlan.PlanType.FIN : CoordinatorPlan.PlanType.INW, planId, headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/export/planSubPositions/{positionType}/{positionId}/{exportType}")
    public void exportPlanSubPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow, @PathVariable String positionType,
                                             @PathVariable ExportType exportType, @PathVariable Long positionId, HttpServletResponse response) throws IOException {

        institutionPlanService.exportPlanSubPositionsToExcel(exportType, positionType.equals("InstitutionFinancialPlanPosition") ? CoordinatorPlan.PlanType.FIN : CoordinatorPlan.PlanType.INW, positionId, headRow, generateExportResponse(response, exportType));
    }
}
