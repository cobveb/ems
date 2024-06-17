package pl.viola.ems.controller.modules.asi.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.asi.employee.Entitlement;
import pl.viola.ems.model.modules.asi.employee.EntitlementPermission;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.asi.employee.EntitlementService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/asi/employee/{employeeId}/entitlement")
public class EntitlementController {

    @Autowired
    EntitlementService entitlementService;

    @GetMapping("/getEntitlements")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1118')")
    public ApiResponse getEntitlements(@PathVariable Long employeeId) {
        return new ApiResponse(HttpStatus.FOUND, entitlementService.getEntitlements(employeeId));
    }

    @PutMapping("/saveEntitlement")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2118')")
    public ApiResponse saveEntitlement(@PathVariable Long employeeId, @RequestBody @Valid Entitlement entitlement) {
        return new ApiResponse(HttpStatus.CREATED, entitlementService.saveEntitlement(employeeId, entitlement));
    }

    @DeleteMapping("/{entitlementId}/deleteEntitlement")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3118')")
    public ApiResponse deleteEntitlement(@PathVariable Long employeeId, @PathVariable Long entitlementId) {
        return new ApiResponse(HttpStatus.ACCEPTED, entitlementService.deleteEntitlement(employeeId, entitlementId));
    }

    @GetMapping("/{entitlementId}/getEntitlementDetails")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1118')")
    public ApiResponse getEntitlementDetails(@PathVariable Long employeeId, @PathVariable Long entitlementId) {
        return new ApiResponse(HttpStatus.FOUND, entitlementService.getEntitlementDetails(employeeId, entitlementId));
    }

    @PutMapping("/{entitlementId}/saveEntitlementPermission")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2118')")
    public ApiResponse saveEntitlementPermission(@PathVariable Long employeeId, @PathVariable Long entitlementId, @RequestBody @Valid EntitlementPermission permission) {
        return new ApiResponse(HttpStatus.CREATED, entitlementService.saveEntitlementPermissions(employeeId, entitlementId, permission));
    }

    @DeleteMapping("/{entitlementId}/{permissionId}/deleteEntitlementPermission")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3118')")
    public ApiResponse deleteEntitlementPermission(@PathVariable Long employeeId, @PathVariable Long entitlementId, @PathVariable Long permissionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, entitlementService.deleteEntitlementPermission(employeeId, entitlementId, permissionId));
    }
}
