package pl.viola.ems.controller.modules.accountant.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;

@RestController
@RequestMapping("/api/accountant/coordinator/publicProcurement/applications")
public class AccountantPublicApplicationCoordinatorController {

    @Autowired
    PublicProcurementApplicationService publicProcurementApplicationService;

    @GetMapping("/getAllApplications")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1124')")
    public ApiResponse getApplications() {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplicationsByAccessLevel("accountant"));
    }

    @PutMapping("/application/approve/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2124')")
    public ApiResponse directorApproveApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.AK));
    }

    @PutMapping("/application/sendBack/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3124')")
    public ApiResponse sendBackApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.ZP));
    }
}
