package pl.viola.ems.controller.modules.publicProcurement.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationPart;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;

import java.util.Set;

@RestController
@RequestMapping({"/api/public/coordinator/applications"})
public class PublicApplicationCoordinatorController {
    @Autowired
    PublicProcurementApplicationService publicProcurementApplicationService;

    public PublicApplicationCoordinatorController() {
    }

    @GetMapping({"/getAllApplications"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1113')")
    public ApiResponse getApplications() {
        return new ApiResponse(HttpStatus.FOUND, this.publicProcurementApplicationService.getApplicationsByAccessLevel("public"));
    }

    @PutMapping({"/approve/{applicationId}"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2113')")
    public ApiResponse approveApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.AZ));
    }

    @PutMapping({"/sendBack/{applicationId}"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3113')")
    public ApiResponse sendBackApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.publicProcurementApplicationService.updateApplicationStatus(applicationId, Application.ApplicationStatus.ZP));
    }

    @PutMapping({"/confirmRealization/{applicationId}"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4113')")
    public ApiResponse confirmRealization(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.publicProcurementApplicationService.confirmRealization(applicationId));
    }

    @PutMapping({"/rollbackPartRealization/{applicationId}"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5113')")
    public ApiResponse rollbackPartRealization(@PathVariable Long applicationId, @RequestBody Set<ApplicationPart> parts) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.publicProcurementApplicationService.rollbackPartRealization(applicationId, parts));
    }

    @PutMapping({"/rollbackRealization/{applicationId}"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5113')")
    public ApiResponse rollbackRealization(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.publicProcurementApplicationService.rollbackRealization(applicationId));
    }
}
