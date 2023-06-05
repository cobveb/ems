package pl.viola.ems.controller.modules.accountant.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.coordinator.publicProcurement.PublicProcurementApplicationService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/accountant/coordinator/publicProcurement/applications")
public class AccountantPublicApplicationCoordinatorController {

    @Autowired
    PublicProcurementApplicationService publicProcurementApplicationService;

    @GetMapping("{year}/getAllApplications")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1124')")
    public ApiResponse getApplications(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, publicProcurementApplicationService.getApplicationsByAccessLevel(year, "accountant"));
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

    @PutMapping("/export/{exportType}")
    public void exportApplicationsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                         @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        publicProcurementApplicationService.exportApplicationsToExcel(exportType, headRow, generateExportResponse(response, exportType), "accountant");
    }
}
