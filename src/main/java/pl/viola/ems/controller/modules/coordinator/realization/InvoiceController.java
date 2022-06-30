package pl.viola.ems.controller.modules.coordinator.realization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/coordinator/realization/invoice/")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @GetMapping("/getInvoices")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1142')")
    public ApiResponse getInvoices() {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoices());
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

    @GetMapping("/{invoiceId}/getInvoicePositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1142')")
    public ApiResponse getInvoicePositions(@PathVariable Long invoiceId) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoicePositions(invoiceId));
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
}
