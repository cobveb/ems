package pl.viola.ems.service.security;

import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.payload.security.AcPermissionDetails;

import java.util.List;

public interface AcPermissionService {

    List<AcPermissionDetails> findByUserAndAcObject(String username, Long acObject);

    List<AcPermissionDetails> findByGroupAndAcObject(String groupCode, Long acObject);

    void saveObjectPermission(List<AcPrivilege> privileges, Object domainObject, Long acObject);
}
