package pl.viola.ems.controller.modules.accountant.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.coordinatorPlan.ApprovePlanType;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.FinancialPosition;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/accountant/coordinator")
public class AccountantPlanCoordinatorController {
    @Autowired
    PlanService planService;

    @GetMapping("/plans/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1024')")
    public ApiResponse getPlansByCoordinator() {
        return new ApiResponse(HttpStatus.FOUND, planService.getPlansByCoordinatorInAccountant());
    }

    @PutMapping("/plan/{planId}/accountantApprove")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3024')")
    public ApiResponse accountantApprove(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.OK, planService.approvePlan(planId, ApprovePlanType.ACCOUNTANT));
    }

    @PutMapping("/plan/withdraw/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4024')")
    public ApiResponse withdrawAccountantApprove(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.updatePlanStatus(planId, CoordinatorPlan.PlanStatus.RO));
    }

    @GetMapping("/plan/{planId}/getPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1024')")
    public ApiResponse getPositionsByPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, planService.findPositionsByPlan(planId));
    }

    @PutMapping("/plan/{planId}/updatePlanPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2024')")
    public ApiResponse savePlanPositions(@RequestBody @Valid List<FinancialPosition> positions, @PathVariable Long planId) {
        return new ApiResponse(HttpStatus.CREATED, planService.updatePlanPositionsByAccountant(positions, planId));
    }

    @PutMapping("/export/plans/{exportType}")
    public void exportPlansToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                  @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        planService.exportPlansToExcel(exportType, "accountant", headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/export/planPositions/{planId}/{exportType}")
    public void exportPlanPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                          @PathVariable ExportType exportType, @PathVariable Long planId, HttpServletResponse response) throws IOException {

        planService.exportPlanPositionsToExcel(exportType, CoordinatorPlan.PlanType.FIN, planId, headRow, generateExportResponse(response, exportType));
    }


}
