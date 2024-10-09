package pl.viola.ems.controller.modules.coordinator.realization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.coordinator.realization.ContractService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/coordinator/realization/contract/")
public class ContractController {

    @Autowired
    ContractService contractService;

    @PostMapping("/getContracts")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1242')")
    public ApiResponse getContracts(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, contractService.getContracts(conditions, false, "coordinator"));
    }

    @GetMapping("/{contractId}/getContractDetails")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1242')")
    public ApiResponse getContractDetails(@PathVariable Long contractId) {
        return new ApiResponse(HttpStatus.FOUND, contractService.getContractDetails(contractId));
    }

    @PostMapping("/getContractsDictionary")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1242')")
    public ApiResponse getContractsAsDictionary(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, contractService.getContractsAsDictionary(conditions, false));
    }

    @PutMapping("/{action}/saveContract")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2242')")
    public ApiResponse saveContract(@RequestBody @Valid Contract contract, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, contractService.saveContract(contract, action));
    }

    @DeleteMapping("/deleteContract/{contractId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3242')")
    public ApiResponse deleteContract(@PathVariable Long contractId) {
        return new ApiResponse(HttpStatus.ACCEPTED, contractService.deleteContract(contractId));
    }

    @GetMapping("/{contractId}/getInvoices")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1242')")
    public ApiResponse getInvoices(@PathVariable Long contractId) {
        return new ApiResponse(HttpStatus.FOUND, contractService.getInvoices(contractId));
    }

    @PutMapping("/export/{exportType}")
    public void exportInvoicesToXlsx(@RequestBody ExportConditions exportConditions,
                                     @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {
        contractService.exportContractsToExcel(exportType, exportConditions, generateExportResponse(response, exportType), "coordinator");
    }
}
