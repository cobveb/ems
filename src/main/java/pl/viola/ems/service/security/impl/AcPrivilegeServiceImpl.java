package pl.viola.ems.service.security.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.viola.ems.model.security.AcPrivilege;
import pl.viola.ems.model.security.repository.AcPrivilegeRepository;
import pl.viola.ems.service.security.AcPrivilegeService;

@Service
public class AcPrivilegeServiceImpl implements AcPrivilegeService {

    @Autowired
    AcPrivilegeRepository acPrivilegeRepository;

    @Override
    public AcPrivilege findByCode(final String code) {

        return acPrivilegeRepository.findByCode(code);
    }
}
