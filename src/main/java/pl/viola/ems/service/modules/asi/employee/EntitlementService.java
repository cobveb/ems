package pl.viola.ems.service.modules.asi.employee;

import pl.viola.ems.model.modules.asi.employee.Entitlement;
import pl.viola.ems.model.modules.asi.employee.EntitlementPermission;
import pl.viola.ems.payload.modules.asi.employee.EntitlementDetailsResponse;

import java.util.Set;

public interface EntitlementService {
    Set<Entitlement> getEntitlements(Long employeeId);

    EntitlementDetailsResponse saveEntitlement(Long employeeId, Entitlement entitlement);

    String deleteEntitlement(Long employeeId, Long entitlementId);

    EntitlementDetailsResponse getEntitlementDetails(Long employeeId, Long entitlementId);

    EntitlementDetailsResponse saveEntitlementPermissions(Long employeeId, Long entitlementId, EntitlementPermission entitlementPermission);

    EntitlementDetailsResponse deleteEntitlementPermission(Long employeeId, Long entitlementId, Long permissionId);
}
