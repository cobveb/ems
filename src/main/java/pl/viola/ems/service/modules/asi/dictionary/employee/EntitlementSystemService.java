package pl.viola.ems.service.modules.asi.dictionary.employee;

import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystemPermission;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;

import java.util.Set;

public interface EntitlementSystemService {
    Set<EntitlementSystem> getEntitlementSystems();

    Set<EntitlementSystem> getActiveEntitlementSystems();

    Set<EntitlementSystem> getActiveUnassignedEntitlementSystemsInRegister();

    Set<EntitlementSystem> getActiveEntitlementSystemsByRegister(DictionaryRegister dictionaryRegister);

    EntitlementSystem saveEntitlementSystem(EntitlementSystem entitlementSystem);

    String deleteEntitlementSystem(Long systemId);

    EntitlementSystemPermission saveEntitlementSystemPermission(Long systemId, EntitlementSystemPermission entitlementSystemPermission);

    String deleteEntitlementSystemPermission(Long systemId, Long permissionId);

    Set<EntitlementSystemPermission> getEntitlementSystemPermissions(Long entitlementSystemId);


}
