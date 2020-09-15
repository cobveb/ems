package pl.viola.ems.service.security;

import pl.viola.ems.model.security.AcPrivilege;

public interface AcPrivilegeService {
    AcPrivilege findByCode(String code);
}
