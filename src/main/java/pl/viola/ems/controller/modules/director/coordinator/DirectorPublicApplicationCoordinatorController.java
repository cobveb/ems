package pl.viola.ems.controller.modules.director.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;

@RestController
@RequestMapping("/api/director/coordinator/publicProcurement/applications")
public class DirectorPublicApplicationCoordinatorController {

    @Autowired
    PublicProcurementApplicationService publicProcurementApplicationService;

    @GetMapping("{year}/getAllApplications")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1115')")
    public ApiResponse getApplications(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplicationsByAccessLevel(year, "director"));
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
}
