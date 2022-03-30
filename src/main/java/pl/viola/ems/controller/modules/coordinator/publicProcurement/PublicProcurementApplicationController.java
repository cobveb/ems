package pl.viola.ems.controller.modules.coordinator.publicProcurement;

import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.publicProcurement.*;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationDetailsPayload;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;
import static pl.viola.ems.utils.Utils.generateJasperResponse;

@RestController
@RequestMapping("/api/coordinator/publicProcurement/application")
public class PublicProcurementApplicationController {

    @Autowired
    PublicProcurementApplicationService publicProcurementApplicationService;

    @GetMapping("/getApplicationProcurementPlanPosition")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1032')")
    public ApiResponse getApplicationProcurementPlanPosition() {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplicationProcurementPlanPosition());
    }

    @GetMapping("/{planType}/getPlanPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1032')")
    public ApiResponse getPlanPositions(@PathVariable CoordinatorPlan.PlanType planType) {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getPlanPositionByYearAndPlanType(planType));
    }

    @GetMapping("/getApplications")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1032')")
    public ApiResponse getApplications() {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplicationsByCoordinator());
    }

    @GetMapping("/getApplication/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1032')")
    public ApiResponse getApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplication(applicationId));
    }

    @PutMapping("/{action}/save")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse saveApplication(@RequestBody @Valid ApplicationDetailsPayload application, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementApplicationService.saveApplication(application, action, Utils.getCurrentUser()));
    }

    @PutMapping("/{applicationId}/{action}/saveAssortmentGroup")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse saveApplicationAssortmentGroup(@RequestBody @Valid ApplicationAssortmentGroup applicationAssortmentGroup, @PathVariable Long applicationId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementApplicationService.saveApplicationAssortmentGroup(applicationId, applicationAssortmentGroup, action));
    }

    @PutMapping("/{assortmentGroupPlanPositionId}/{action}/saveAssortmentGroupSubsequentYear")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse saveApplicationAssortmentGroupSubsequentYear(@RequestBody @Valid AssortmentGroupSubsequentYear assortmentGroupSubsequentYear, @PathVariable Long assortmentGroupPlanPositionId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementApplicationService.saveAssortmentGroupSubsequentYear(assortmentGroupPlanPositionId, assortmentGroupSubsequentYear, action));
    }

    @DeleteMapping("/{assortmentGroupPlanPositionId}/deleteAssortmentGroupSubsequentYear/{subsequentYearId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse deleteApplicationAssortmentGroupSubsequentYear(@PathVariable Long assortmentGroupPlanPositionId, @PathVariable Long subsequentYearId) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementApplicationService.deleteAssortmentGroupSubsequentYear(assortmentGroupPlanPositionId, subsequentYearId));
    }

    @DeleteMapping("/deleteAssortmentGroup/{assortmentGroupId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3032')")
    public ApiResponse deleteApplicationAssortmentGroup(@PathVariable Long assortmentGroupId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.deleteApplicationAssortmentGroup(assortmentGroupId));
    }

    @DeleteMapping("/deleteApplicationAssortmentGroupPlanPosition/{planPositionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3032')")
    public ApiResponse deleteApplicationAssortmentGroupPlanPosition(@PathVariable Long planPositionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.deleteApplicationAssortmentGroupPlanPosition(planPositionId));
    }

    @PutMapping("/{applicationId}/{action}/savePart")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse saveApplicationPart(@RequestBody @Valid ApplicationPart applicationPart, @PathVariable Long applicationId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementApplicationService.saveApplicationPart(applicationId, applicationPart, action));
    }

    @DeleteMapping("/deletePart/{partId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3032')")
    public ApiResponse deleteApplicationPart(@PathVariable Long partId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.deleteApplicationPart(partId));
    }

    @PutMapping("/{applicationId}/{action}/saveCriterion")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse saveApplicationCriterion(@RequestBody @Valid ApplicationCriterion applicationCriterion, @PathVariable Long applicationId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementApplicationService.saveApplicationCriterion(applicationId, applicationCriterion, action));
    }

    @DeleteMapping("/deleteCriterion/{partId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse deleteApplicationCriterion(@PathVariable Long partId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.deleteApplicationCriterion(partId));
    }

    @PutMapping("/send/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3032')")
    public ApiResponse sendApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.WY));
    }

    @PutMapping("/withdraw/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4032')")
    public ApiResponse withdrawApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.ZP));
    }

    @DeleteMapping("/delete/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5032')")
    public ApiResponse deleteApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.deleteApplication(applicationId));
    }

    @PutMapping("/export/{exportType}")
    public void exportApplicationsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                         @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        publicProcurementApplicationService.exportApplicationsToExcel(exportType, headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/{applicationId}/export/parts/{exportType}")
    public void exportApplicationsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow, @PathVariable Long applicationId,
                                         @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        publicProcurementApplicationService.exportApplicationsPartsToExcel(exportType, applicationId, headRow, generateExportResponse(response, exportType));
    }

    @GetMapping("/print/{applicationId}")
    public void generatePlan(@PathVariable Long applicationId, HttpServletResponse response) throws JRException, SQLException, IOException {
        publicProcurementApplicationService.exportApplicationToJasper(applicationId, generateJasperResponse(response, JasperExportType.PDF));
    }

}
