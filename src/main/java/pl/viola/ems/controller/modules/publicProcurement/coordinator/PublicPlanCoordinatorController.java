package pl.viola.ems.controller.modules.publicProcurement.coordinator;

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
@RequestMapping("/api/public/coordinator")
public class PublicPlanCoordinatorController {
    @Autowired
    PlanService planService;

    @GetMapping("/plans/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getPlansByCoordinator() {
        return new ApiResponse(HttpStatus.FOUND, planService.getPlansByCoordinatorInPublicProcurement());
    }

    @GetMapping("/plans/getCoordinatorsPlanUpdates")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getCoordinatorsPlanUpdates() {
        return new ApiResponse(HttpStatus.FOUND, planService.getCoordinatorsPlanUpdates("public", CoordinatorPlan.PlanType.PZP));
    }

    @PutMapping("/plan/{planId}/publicApprove")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2013')")
    public ApiResponse publicApprove(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.OK, planService.approvePlan(planId, ApprovePlanType.PUBLIC_PROCUREMENT));
    }

    @PutMapping("/plan/{planId}/returnPlan")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('3013', '4024', '6015')")
    public ApiResponse returnPlanToCoordinator(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.OK, planService.returnCoordinatorPlan(planId));
    }

    @GetMapping("/plan/{planId}/getPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getPositionsByPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, planService.findPositionsByPlan(planId));
    }

    @PutMapping("/export/plans/{exportType}")
    public void exportPlansToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                  @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        planService.exportPlansToExcel(exportType, "publicProcurement", headRow, generateExportResponse(response, exportType));
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
}
