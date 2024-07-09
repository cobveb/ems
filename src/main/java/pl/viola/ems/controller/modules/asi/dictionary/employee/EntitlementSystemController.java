package pl.viola.ems.controller.modules.asi.dictionary.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystemPermission;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.asi.dictionary.employee.EntitlementSystemService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/asi/dict/employee/entitlementSystem")
public class EntitlementSystemController {
    @Autowired
    EntitlementSystemService entitlementSystemService;

    @GetMapping("/getEntitlementSystems")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1128')")
    public ApiResponse getEntitlementSystems() {
        return new ApiResponse(HttpStatus.FOUND, entitlementSystemService.getEntitlementSystems());
    }

    @GetMapping("/getActiveEntitlementSystems")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1128')")
    public ApiResponse getActiveEntitlementSystems() {
        return new ApiResponse(HttpStatus.FOUND, entitlementSystemService.getActiveEntitlementSystems());
    }

    @GetMapping("/getActiveUnassignedEntitlementSystems")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1128')")
    public ApiResponse getActiveUnassignedEntitlementSystems() {
        return new ApiResponse(HttpStatus.FOUND, entitlementSystemService.getActiveUnassignedEntitlementSystemsInRegister());
    }

    @PutMapping("/saveEntitlementSystem")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2128')")
    public ApiResponse saveEntitlementSystem(@RequestBody @Valid EntitlementSystem entitlementSystem) {
        return new ApiResponse(HttpStatus.CREATED, entitlementSystemService.saveEntitlementSystem(entitlementSystem));
    }

    @DeleteMapping("/{systemId}/deleteEntitlementSystem")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3128')")
    public ApiResponse deleteEntitlementSystem(@PathVariable Long systemId) {
        return new ApiResponse(HttpStatus.ACCEPTED, entitlementSystemService.deleteEntitlementSystem(systemId));
    }

    @GetMapping("/{systemId}/getEntitlementSystemPermissions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1128')")
    public ApiResponse getEntitlementSystemPermissions(@PathVariable Long systemId) {
        return new ApiResponse(HttpStatus.FOUND, entitlementSystemService.getEntitlementSystemPermissions(systemId));
    }

    @PutMapping("/{systemId}/saveEntitlementSystemPermission")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2128')")
    public ApiResponse saveEntitlementSystemPermission(@PathVariable Long systemId, @RequestBody @Valid EntitlementSystemPermission entitlementSystemPermission) {
        return new ApiResponse(HttpStatus.CREATED, entitlementSystemService.saveEntitlementSystemPermission(systemId, entitlementSystemPermission));
    }

    @DeleteMapping("/{systemId}/{permissionId}/deleteEntitlementSystemPermission")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3128')")
    public ApiResponse deleteEntitlementSystemPermission(@PathVariable Long systemId, @PathVariable Long permissionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, entitlementSystemService.deleteEntitlementSystemPermission(systemId, permissionId));
    }
}
