package pl.viola.ems.controller.modules.director.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/director/coordinator/publicProcurement/applications")
public class DirectorPublicApplicationCoordinatorController {

    @Autowired
    PublicProcurementApplicationService publicProcurementApplicationService;

    @PostMapping("/getApplicationsPageable")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1115')")
    public ApiResponse getApplicationsPageable(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplicationsPageableByAccessLevel(conditions, "director", false));
    }

    @PutMapping("/application/directorApprove/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2115')")
    public ApiResponse directorApproveApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.AD));
    }

    @PutMapping("/application/medicalApprove/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3115')")
    public ApiResponse medicalApproveApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.AM));
    }

    @PutMapping("/application/chiefApprove/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4115')")
    public ApiResponse chiefApproveApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.ZR));
    }

    @PutMapping("/application/sendBack/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5115')")
    public ApiResponse sendBackApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.ZP));
    }

    @PutMapping("/export/{exportType}")
    public void exportApplicationsToXlsx(@RequestBody ExportConditions exportConditions,
                                         @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        publicProcurementApplicationService.exportApplicationsToExcel(exportType, 0, exportConditions, generateExportResponse(response, exportType), "accountant");
    }
}
