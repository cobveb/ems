package pl.viola.ems.service.modules.asi.dictionary.employee.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystemPermission;
import pl.viola.ems.model.modules.asi.dictionary.employee.repository.EntitlementSystemPermissionRepository;
import pl.viola.ems.model.modules.asi.dictionary.employee.repository.EntitlementSystemRepository;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;
import pl.viola.ems.service.modules.asi.dictionary.employee.EntitlementSystemService;

import java.util.Locale;
import java.util.Set;

@Service
public class EntitlementSystemServiceImpl implements EntitlementSystemService {
    @Autowired
    EntitlementSystemRepository entitlementSystemRepository;

    @Autowired
    EntitlementSystemPermissionRepository entitlementSystemPermissionRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public Set<EntitlementSystem> getEntitlementSystems() {
        return entitlementSystemRepository.findAllByOrderByName();
    }

    @Override
    public Set<EntitlementSystem> getActiveEntitlementSystems() {
        return entitlementSystemRepository.findByIsActiveTrueOrderByName();
    }

    @Override
    public Set<EntitlementSystem> getActiveUnassignedEntitlementSystemsInRegister() {
        return entitlementSystemRepository.findByRegisterIsNullAndIsActiveTrueOrderByName();
    }

    @Override
    public Set<EntitlementSystem> getActiveEntitlementSystemsByRegister(final DictionaryRegister register) {
        return entitlementSystemRepository.findByRegisterAndIsActiveTrueOrderByName(register);
    }

    @Override
    @Transactional
    public EntitlementSystem saveEntitlementSystem(final EntitlementSystem entitlementSystem) {
        return entitlementSystemRepository.save(entitlementSystem);
    }

    @Override
    @Transactional
    public String deleteEntitlementSystem(final Long systemId) {
        EntitlementSystem entitlementSystem = entitlementSystemRepository.findById(systemId).orElseThrow(
                () -> new AppException("Asi.employee.entitlementSystemNotFound", HttpStatus.NOT_FOUND));

        Set<EntitlementSystemPermission> systemPermissions = entitlementSystemPermissionRepository.findByEntitlementSystemOrderById(entitlementSystem);

        if (!systemPermissions.isEmpty()) {
            entitlementSystemPermissionRepository.deleteAll(systemPermissions);
        }

        entitlementSystemRepository.deleteById(systemId);
        return messageSource.getMessage("Asi.employee.entitlementSystem.deleteMsg", null, Locale.getDefault());
    }

    @Override
    @Transactional
    public EntitlementSystemPermission saveEntitlementSystemPermission(final Long systemId, final EntitlementSystemPermission entitlementSystemPermission) {
        EntitlementSystem entitlementSystem = entitlementSystemRepository.findById(systemId).orElseThrow(
                () -> new AppException("Asi.employee.entitlementSystemNotFound", HttpStatus.NOT_FOUND));

        entitlementSystemPermission.setEntitlementSystem(entitlementSystem);

        return entitlementSystemPermissionRepository.save(entitlementSystemPermission);
    }

    @Override
    @Transactional
    public String deleteEntitlementSystemPermission(final Long systemId, final Long permissionId) {
        if (entitlementSystemRepository.existsById(systemId)) {
            if (entitlementSystemPermissionRepository.existsById(permissionId)) {
                entitlementSystemPermissionRepository.deleteById(permissionId);
                return messageSource.getMessage("Asi.employee.entitlementSystem.permissionDeleteMsg", null, Locale.getDefault());
            } else {
                throw new AppException("Asi.employee.entitlementSystem.permissionNotFound", HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new AppException("Asi.employee.entitlementSystemNotFound", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public Set<EntitlementSystemPermission> getEntitlementSystemPermissions(final Long entitlementSystemId) {
        EntitlementSystem entitlementSystem = entitlementSystemRepository.findById(entitlementSystemId).orElseThrow(
                () -> new AppException("Asi.employee.entitlementSystemNotFound", HttpStatus.NOT_FOUND));

        return entitlementSystemPermissionRepository.findByEntitlementSystemOrderById(entitlementSystem);
    }

}
