package pl.viola.ems.controller.modules.coordinator.realization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/coordinator/realization/invoice/")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @PostMapping("/getInvoicesPageable")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1142')")
    public ApiResponse getInvoicesPageable(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoicesPageable(conditions, false, "coordinator"));
    }

    @GetMapping("/{invoiceId}/getInvoiceDetails")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1244', '1142')")
    public ApiResponse getInvoiceDetails(@PathVariable Long invoiceId) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoiceDetails(invoiceId));
    }

    @PutMapping("/{action}/saveInvoice")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2142')")
    public ApiResponse saveInvoice(@RequestBody @Valid Invoice invoice, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, invoiceService.saveInvoice(invoice, action));
    }

    @DeleteMapping("/deleteInvoice/{invoiceId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3142')")
    public ApiResponse deleteInvoice(@PathVariable Long invoiceId) {
        return new ApiResponse(HttpStatus.ACCEPTED, invoiceService.deleteInvoice(invoiceId));
    }

    @GetMapping("/planPosition/{planType}/{planPositionId}/getInvoicePositions")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1244', '1142')")
    public ApiResponse getInvoicesPositionsByCoordinatorPlanPosition(@PathVariable CoordinatorPlan.PlanType planType, @PathVariable Long planPositionId) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoicesPositionsByCoordinatorPlanPosition(planType, planPositionId));
    }

    @PutMapping("/{invoiceId}/{action}/saveInvoicePosition")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2142')")
    public ApiResponse saveInvoicePosition(@RequestBody @Valid InvoicePosition invoicePosition, @PathVariable Long invoiceId, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, invoiceService.saveInvoicePosition(invoicePosition, invoiceId, action));
    }

    @DeleteMapping("/deleteInvoicePosition/{invoicePositionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3142')")
    public ApiResponse deleteInvoicePosition(@PathVariable Long invoicePositionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, invoiceService.deleteInvoicePosition(invoicePositionId));
    }

    @GetMapping("/{year}/{planType}/getPlanPositions")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1244', '1142')")
    public ApiResponse getPlanPositions(@PathVariable Integer year, @PathVariable CoordinatorPlan.PlanType planType) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getPlanPositionByYearAndPlanType(year, planType));
    }

    @PutMapping("/export/{exportType}")
    public void exportInvoicesToXlsx(@RequestBody ExportConditions exportConditions,
                                     @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        invoiceService.exportInvoicesToExcel(exportType, exportConditions, generateExportResponse(response, exportType), "coordinator");
    }
}
