package pl.viola.ems.model.modules.asi.dictionary.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystemPermission;

import java.util.Set;

@Repository
public interface EntitlementSystemPermissionRepository extends JpaRepository<EntitlementSystemPermission, Long> {
    Set<EntitlementSystemPermission> findByEntitlementSystemOrderById(EntitlementSystem entitlementSystem);


}
