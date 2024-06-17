package pl.viola.ems.model.modules.asi.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.viola.ems.model.modules.asi.employee.Entitlement;
import pl.viola.ems.model.modules.asi.employee.EntitlementPermission;

import java.util.Set;

public interface EntitlementPermissionRepository extends JpaRepository<EntitlementPermission, Long> {

    Set<EntitlementPermission> findByEntitlementOrderById(Entitlement entitlement);

    @Modifying
    @Query("delete from EntitlementPermission perm where perm.entitlement=:entitlement")
    void deletePermissionsByEmployment(@Param("entitlement") Entitlement entitlement);
}
