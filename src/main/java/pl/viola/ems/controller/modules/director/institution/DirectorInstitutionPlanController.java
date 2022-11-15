package pl.viola.ems.controller.modules.director.institution;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.accountant.institution.InstitutionPlanService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/director/institution/plans")
public class DirectorInstitutionPlanController {

    @Autowired
    InstitutionPlanService institutionPlanService;

    @GetMapping("/getPlans")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1025')")
    public ApiResponse getInstitutionPlans() {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getPlans("director"));
    }

    @PutMapping("/approvePlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2025')")
    public ApiResponse approveDirectorPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, institutionPlanService.updatePlanStatus(planId, "approve", "director"));
    }

    @PutMapping("/approveEconomicPlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4025')")
    public ApiResponse approveEconomicDirectorPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, institutionPlanService.updatePlanStatus(planId, "approve", "economic"));
    }

    @PutMapping("/withdrawPlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3025')")
    public ApiResponse withdrawDirectorPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, institutionPlanService.updatePlanStatus(planId, "withdraw", "director"));
    }

    @GetMapping("/existsPlanToApprove/{planId}")
    public ApiResponse existsPlanToApprove(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.existsPlanToApprove(planId));
    }

    @PutMapping("/export/plans/{exportType}")
    public void exportPlansToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                  @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        institutionPlanService.exportPlansToExcel(exportType, "director", headRow, generateExportResponse(response, exportType));
    }


}
