package pl.viola.ems.controller.modules.accountant.realization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;

@RestController
@RequestMapping("/api/accountant/realization/invoice/")
public class AccountantInvoiceController {
    @Autowired
    InvoiceService invoiceService;

    @GetMapping("/{year}/getInvoices")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1244')")
    public ApiResponse getInvoices(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, invoiceService.getInvoicesByYear(year));
    }
}
