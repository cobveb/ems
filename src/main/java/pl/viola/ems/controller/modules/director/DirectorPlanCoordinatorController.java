package pl.viola.ems.controller.modules.director;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.coordinatorPlan.ApprovePlanType;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/director/coordinator")
public class DirectorPlanCoordinatorController {

    @Autowired
    PlanService planService;

    @GetMapping("/plans/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1015')")
    public ApiResponse getPlansByDirector() {
        return new ApiResponse(HttpStatus.FOUND, planService.getPlansCoordinatorInDirector());
    }

    @PutMapping("/plan/{planId}/directorApprove")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2015')")
    public ApiResponse directorApprove(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.OK, planService.approvePlan(planId, ApprovePlanType.DIRECTOR));
    }

    @PutMapping("/plan/{planId}/chiefApprove")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3015')")
    public ApiResponse chiefApprove(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.OK, planService.approvePlan(planId, ApprovePlanType.CHIEF));
    }

    @GetMapping("/plan/{planId}/getPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1015')")
    public ApiResponse getPositionsByPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, planService.findPositionsByPlan(planId));
    }

    @PutMapping("/export/plans/{exportType}")
    public void exportPlansToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                  @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        planService.exportPlansToExcel(exportType, "director", headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/export/planPositions/{planType}/{planId}/{exportType}")
    public void exportPlanPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow, @PathVariable CoordinatorPlan.PlanType planType,
                                          @PathVariable ExportType exportType, @PathVariable Long planId, HttpServletResponse response) throws IOException {

        planService.exportPlanPositionsToExcel(exportType, planType, planId, headRow, generateExportResponse(response, exportType));
    }
}