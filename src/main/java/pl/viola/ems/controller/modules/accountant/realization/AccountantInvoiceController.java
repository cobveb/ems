package pl.viola.ems.controller.modules.accountant.realization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/accountant/realization/invoice/")
public class AccountantInvoiceController {
    @Autowired
    InvoiceService invoiceService;

    @PostMapping("/getInvoicesPageable")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1244')")
    public ApiResponse getInvoicesPageable(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoicesPageable(conditions, false, "accountant"));
    }

    @GetMapping("/planPosition/{planPositionId}/getInvoicePositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1244')")
    public ApiResponse getInvoicesPositionsByInstitutionPlanPosition(@PathVariable Long planPositionId) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoicesByInstitutionPlanPositions(planPositionId));
    }

    @PutMapping("/export/{exportType}")
    public void exportInvoicesToXlsx(@RequestBody ExportConditions exportConditions,
                                     @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {
        invoiceService.exportInvoicesToExcel(exportType, exportConditions, generateExportResponse(response, exportType), "accountant");
    }
}
