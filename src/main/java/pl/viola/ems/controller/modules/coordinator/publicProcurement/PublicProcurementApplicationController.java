package pl.viola.ems.controller.modules.coordinator.publicProcurement;

import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationAssortmentGroup;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationCriterion;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationPart;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
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

    PublicProcurementApplicationService publicProcurementService;

    @GetMapping("/getPlanPositions")
    //TODO: Dodać właściwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1022')")
    public ApiResponse getPlanPositions() {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementService.getPlanPositionByYear());
    }

    @GetMapping("/getApplications")
    //TODO: Dodać właściwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1022')")
    public ApiResponse getApplications() {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementService.getApplicationsByCoordinator());
    }

    @PutMapping("/{action}/save")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse saveApplication(@RequestBody @Valid Application application, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementService.saveApplication(application, action, Utils.getCurrentUser()));
    }

    @PutMapping("/{applicationId}/{action}/saveAssortmentGroup")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse saveApplicationAssortmentGroup(@RequestBody @Valid ApplicationAssortmentGroup applicationAssortmentGroup, @PathVariable Long applicationId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementService.saveApplicationAssortmentGroup(applicationId, applicationAssortmentGroup, action));
    }

    @DeleteMapping("/deleteAssortmentGroup/{assortmentGroupId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deleteApplicationAssortmentGroup(@PathVariable Long assortmentGroupId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementService.deleteApplicationAssortmentGroup(assortmentGroupId));
    }

    @PutMapping("/{applicationId}/{action}/savePart")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse saveApplicationPart(@RequestBody @Valid ApplicationPart applicationPart, @PathVariable Long applicationId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementService.saveApplicationPart(applicationId, applicationPart, action));
    }

    @DeleteMapping("/deletePart/{partId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deleteApplicationPart(@PathVariable Long partId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementService.deleteApplicationPart(partId));
    }

    @PutMapping("/{applicationId}/{action}/saveCriterion")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse saveApplicationCriterion(@RequestBody @Valid ApplicationCriterion applicationCriterion, @PathVariable Long applicationId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, publicProcurementService.saveApplicationCriterion(applicationId, applicationCriterion, action));
    }

    @DeleteMapping("/deleteCriterion/{partId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deleteApplicationCriterion(@PathVariable Long partId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementService.deleteApplicationCriterion(partId));
    }

    @PutMapping("/send/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4022')")
    public ApiResponse sendPlan(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementService.updateApplicationStatus(applicationId, Application.ApplicationStatus.WY));
    }

    @PutMapping("/export/{exportType}")
    public void exportApplicationsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                         @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        publicProcurementService.exportApplicationsToExcel(exportType, headRow, generateExportResponse(response, exportType));
    }

    @GetMapping("/print/{applicationId}")
    public void generatePlan(@PathVariable Long applicationId, HttpServletResponse response) throws JRException, SQLException, IOException {
        publicProcurementService.exportApplicationToJasper(applicationId, generateJasperResponse(response, JasperExportType.PDF));
    }
}
