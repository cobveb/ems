package pl.viola.ems.controller.modules.publicProcurement.institution;

import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanPositionRequest;
import pl.viola.ems.service.modules.publicProcurement.plans.institution.PublicInstitutionPlanService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;
import static pl.viola.ems.utils.Utils.generateJasperResponse;

@RestController
@RequestMapping("/api/public/institution/plans")
public class PublicInstitutionPlanController {
    @Autowired
    PublicInstitutionPlanService publicInstitutionPlanService;

    @GetMapping("{year}/getPlans")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1023')")
    public ApiResponse getInstitutionPlans(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, publicInstitutionPlanService.getPlans(year, "publicProcurement"));
    }

    @GetMapping("/{planId}/getPlanPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1023')")
    public ApiResponse getInstitutionPlansPositions(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, publicInstitutionPlanService.getPlanPositions(planId));
    }

    @GetMapping("/plan/{positionId}/getPositionDetails")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1023')")
    public ApiResponse getInstitutionPositionDetails(@PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.FOUND, publicInstitutionPlanService.getPlanPublicPositions(positionId));
    }

    @GetMapping("/plan/{positionId}/getSubPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1023')")
    public ApiResponse getInstitutionPlanSubPositions(@PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.FOUND, publicInstitutionPlanService.getPlanSubPositions(positionId));
    }

    @PutMapping("/plan/correctPlanPosition")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2023')")
    public ApiResponse correctPlanPositions(@RequestBody @Valid PublicInstitutionPlanPositionRequest institutionPlanPosition) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicInstitutionPlanService.correctPlanSubPositions(institutionPlanPosition));
    }

    @PutMapping("/plan/approvePlanPosition/{positionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2023')")
    public ApiResponse approvePlanPositions(@PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicInstitutionPlanService.approvePlanPosition(positionId));
    }

    @PutMapping("/plan/{planId}/approvePlan")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3023')")
    public ApiResponse approvePlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicInstitutionPlanService.updatePlanStatus(planId, "approve"));
    }

    @PutMapping("/plan/{planId}/withdrawPlan")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4023')")
    public ApiResponse withdrawPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicInstitutionPlanService.updatePlanStatus(planId, "withdraw"));
    }

    @GetMapping("/plan/print/{planId}/{type}")
    public void printInstitutionPlan(@PathVariable Long planId, @PathVariable String type, HttpServletResponse response) throws JRException, SQLException, IOException {
        publicInstitutionPlanService.exportPlanToJasper(planId, type, generateJasperResponse(response, JasperExportType.PDF));
    }

    @PutMapping("/export/planPositions/{planId}/{exportType}")
    public void exportPlanPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                          @PathVariable ExportType exportType, @PathVariable Long planId, HttpServletResponse response) throws IOException {

        publicInstitutionPlanService.exportPlanPositionsToExcel(exportType, planId, headRow, generateExportResponse(response, exportType));
    }
}
