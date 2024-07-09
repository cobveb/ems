package pl.viola.ems.controller.modules.asi.dictionary.register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.asi.dictionary.register.AsiDictionaryRegisterService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.Set;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/asi/dict/register")
public class AsiDictionaryRegisterController {
    @Autowired
    AsiDictionaryRegisterService asiDictionaryRegisterService;

    @PostMapping("/getRegisters")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1128')")
    public ApiResponse getAllDictionaryRegisters(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, asiDictionaryRegisterService.getAllDictionaryRegisters(conditions, false));
    }

    @GetMapping("/getActiveRegisters")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1128')")
    public ApiResponse getActiveDictionaryRegisters() {
        return new ApiResponse(HttpStatus.FOUND, asiDictionaryRegisterService.getActiveDictionaryRegisters());
    }

    @PutMapping("/saveRegister")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2128')")
    public ApiResponse saveRegister(@RequestBody @Valid DictionaryRegister dictionaryRegister) {
        return new ApiResponse(HttpStatus.CREATED, asiDictionaryRegisterService.saveDictionaryRegister(dictionaryRegister));
    }

    @DeleteMapping("/{registerId}/deleteRegister")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3128')")
    public ApiResponse deleteRegister(@PathVariable Long registerId) {
        return new ApiResponse(HttpStatus.ACCEPTED, asiDictionaryRegisterService.deleteRegister(registerId));
    }

    @GetMapping("/{registerId}/getRegisterEntitlementSystem")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1128')")
    public ApiResponse getRegisterEntitlementSystem(@PathVariable Long registerId) {
        return new ApiResponse(HttpStatus.FOUND, asiDictionaryRegisterService.getRegisterEntitlementSystem(registerId));
    }

    @PutMapping("/{registerId}/addRegisterEntitlementSystems")
    public ApiResponse addRegisterEntitlementSystems(@PathVariable Long registerId, @Valid @RequestBody Set<EntitlementSystem> entitlementSystems) {
        return new ApiResponse(HttpStatus.OK, asiDictionaryRegisterService.addRegisterEntitlementSystems(registerId, entitlementSystems));
    }

    @PostMapping("/{registerId}/{systemId}/removeRegisterEntitlementSystem")
    public ApiResponse removeRegisterEntitlementSystem(@PathVariable Long registerId, @PathVariable Long systemId) {
        return new ApiResponse(HttpStatus.OK, asiDictionaryRegisterService.removeRegisterEntitlementSystem(registerId, systemId));
    }

    @PutMapping("/export/{exportType}")
    public void exportRegistersToXlsx(@RequestBody ExportConditions exportConditions,
                                      @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {
        asiDictionaryRegisterService.exportRegistersToExcel(exportType, exportConditions, generateExportResponse(response, exportType));
    }
}
