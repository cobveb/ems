package pl.viola.ems.controller.modules.accountant.dictionary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.accountant.dictionary.ContractorService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/accountant/dictionary/contractors/")
public class ContractorController {

    @Autowired
    ContractorService contractorService;

    @GetMapping("/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1014')")
    public ApiResponse getContractors() {
        return new ApiResponse(HttpStatus.FOUND, contractorService.getContractors());
    }

    @GetMapping("/getActive")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1014')")
    public ApiResponse getActiveContractor() {
        return new ApiResponse(HttpStatus.FOUND, contractorService.getActiveContractor());
    }

    @PutMapping("/saveContractor")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2014')")
    public ApiResponse saveContractor(@RequestBody @Valid Contractor contractor) {
        return new ApiResponse(HttpStatus.CREATED, contractorService.saveContractor(contractor));
    }

    @DeleteMapping("/deleteContractor/{id}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3014')")
    public ApiResponse deleteContractor(@PathVariable Long id) {
        return new ApiResponse(HttpStatus.ACCEPTED, contractorService.deleteContractor(id));
    }

}
