package pl.viola.ems.controller.modules.accountant.realization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.realization.ContractService;

@RestController
@RequestMapping("/api/accountant/realization/contract/")
public class AccountantContractController {
    @Autowired
    ContractService contractService;

    @GetMapping("/getAllContracts")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1242')")
    public ApiResponse getAllContracts() {
        return new ApiResponse(HttpStatus.FOUND, contractService.getAllContracts());
    }

    @GetMapping("/{year}/getContracts")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1242')")
    public ApiResponse getContracts(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, contractService.getContractsByYear(year));
    }
}
