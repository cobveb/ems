package pl.viola.ems.payload.modules.asi.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.viola.ems.model.modules.asi.employee.EntitlementPermission;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntitlementPermissionResponse {

    private String updatedByStr;

    private String updatedAtStr;

    private EntitlementPermission entitlementPermission;
}
