package pl.viola.ems.controller.modules.publicProcurement.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationPart;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.Set;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping({"/api/public/coordinator/applications"})
public class PublicApplicationCoordinatorController {
    @Autowired
    PublicProcurementApplicationService publicProcurementApplicationService;

    @PostMapping("/getApplicationsPageable")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1113')")
    public ApiResponse getApplicationsPageable(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplicationsPageableByAccessLevel(conditions, "public", false));
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

    @PutMapping({"/{applicationId}/setPublicRealization"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2113')")
    public ApiResponse setPublicRealization(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.publicProcurementApplicationService.setPublicRealization(applicationId));
    }

    @PutMapping("/export/{exportType}")
    public void exportApplicationsToXlsx(@RequestBody ExportConditions exportConditions,
                                         @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        publicProcurementApplicationService.exportApplicationsToExcel(exportType, 0, exportConditions, generateExportResponse(response, exportType), "public");
    }
}
