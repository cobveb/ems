package pl.viola.ems.controller.modules.accountant.realization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.coordinator.realization.ContractService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/accountant/realization/contract/")
public class AccountantContractController {
    @Autowired
    ContractService contractService;

    @GetMapping("/{year}/getContracts")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1144')")
    public ApiResponse getContracts(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, contractService.getContractsByYear(year));
    }

    @PostMapping("/getContracts")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1242')")
    public ApiResponse getContracts(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, contractService.getContracts(conditions, false, "accountant"));
    }

    @PutMapping("/export/{exportType}")
    public void exportInvoicesToXlsx(@RequestBody ExportConditions exportConditions,
                                     @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {
        contractService.exportContractsToExcel(exportType, exportConditions, generateExportResponse(response, exportType), "accountant");
    }
}
