package pl.viola.ems.service.modules.asi.employee.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.model.modules.asi.employee.Entitlement;
import pl.viola.ems.model.modules.asi.employee.EntitlementPermission;
import pl.viola.ems.model.modules.asi.employee.repository.EntitlementPermissionRepository;
import pl.viola.ems.model.modules.asi.employee.repository.EntitlementRepository;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.model.modules.hr.employees.EmploymentWorkplace;
import pl.viola.ems.model.modules.hr.employees.repository.EmployeeRepository;
import pl.viola.ems.model.modules.hr.employees.repository.EmploymentWorkplaceRepository;
import pl.viola.ems.payload.modules.asi.employee.EntitlementDetailsResponse;
import pl.viola.ems.payload.modules.asi.employee.EntitlementEmploymentResponse;
import pl.viola.ems.service.modules.asi.employee.EntitlementService;
import pl.viola.ems.utils.Utils;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Set;

@Service
public class EntitlementServiceImpl implements EntitlementService {

    @Autowired
    EntitlementRepository entitlementRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EntitlementPermissionRepository entitlementPermissionRepository;

    @Autowired
    EmploymentWorkplaceRepository employmentWorkplaceRepository;

    @Autowired
    MessageSource messageSource;

    private static final String PATTERN_FORMAT = "dd-MM-yyyy, HH:mm:ss";

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(PATTERN_FORMAT).withZone(ZoneId.systemDefault());

    @Override
    public Set<Entitlement> getEntitlements(final Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND));
        return entitlementRepository.findByEmployeeOrderById(employee);

    }

    @Override
    @Transactional
    public EntitlementDetailsResponse saveEntitlement(final Long employeeId, final Entitlement entitlement) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND));

        entitlement.setEmployee(employee);

        entitlement.setEmployee(employee);

        Entitlement updatedEntitlement = entitlementRepository.saveAndFlush(entitlement);

        return this.getEntitlementDetails(updatedEntitlement.getEmployee().getId(), updatedEntitlement.getId());
    }

    @Override
    @Transactional
    public String deleteEntitlement(final Long employeeId, final Long entitlementId) {
        Entitlement entitlement = entitlementRepository.findByIdAndEmployee(entitlementId,
                employeeRepository.findById(employeeId).orElseThrow(
                        () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND))
        ).orElseThrow(
                () -> new AppException("Asi.employee.entitlementNotFound", HttpStatus.NOT_FOUND));

        entitlementPermissionRepository.deletePermissionsByEmployment(entitlement);
        entitlementRepository.delete(entitlement);

        return messageSource.getMessage("Asi.employee.entitlement.deleteMsg", null, Locale.getDefault());
    }

    @Override
    public EntitlementDetailsResponse getEntitlementDetails(final Long employeeId, final Long entitlementId) {

        Entitlement entitlement = entitlementRepository.findByIdAndEmployee(entitlementId,
                employeeRepository.findById(employeeId).orElseThrow(
                        () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND))
        ).orElseThrow(
                () -> new AppException("Asi.employee.entitlementNotFound", HttpStatus.NOT_FOUND));

        Set<EntitlementPermission> permissions = entitlementPermissionRepository.findByEntitlementOrderById(entitlement);

        User createUser = userRepository.findById(entitlement.getCreatedBy()).orElse(null);
        User updateUser = userRepository.findById(entitlement.getUpdatedBy()).orElse(null);

        Set<EmploymentWorkplace> workplaces = employmentWorkplaceRepository.findByEmploymentOrderById(entitlement.getEmployment());

        String workplaceList = Utils.generateEmployeeEmploymentWorkplaceList(entitlement.getEmployment(), workplaces);

        return new EntitlementDetailsResponse(
                entitlement.getId(),
                entitlement.getUsername(),
                entitlement.getDateFrom(),
                entitlement.getDateTo(),
                entitlement.getDateWithdrawal(),
                entitlement.getComments(),
                new EntitlementEmploymentResponse(
                        entitlement.getEmployment().getId(),
                        entitlement.getEmployment().getNumber(),
                        entitlement.getEmployment().getNumber(),
                        workplaceList,
                        workplaceList,
                        entitlement.getEmployment().getDateFrom(),
                        entitlement.getEmployment().getDateTo()
                ),
                entitlement.getEntitlementSystem(),
                (createUser != null ? createUser.getName() + ' ' + createUser.getSurname() : null),
                entitlement.getCreatedBy(),
                formatter.format(entitlement.getCreatedAt()),
                entitlement.getCreatedAt(),
                (updateUser != null ? updateUser.getName() + ' ' + updateUser.getSurname() : null),
                formatter.format(entitlement.getUpdatedAt()),
                permissions
        );
    }

    @Override
    public EntitlementDetailsResponse saveEntitlementPermissions(final Long employeeId, final Long entitlementId, final EntitlementPermission entitlementPermission) {
        Entitlement entitlement = entitlementRepository.findByIdAndEmployee(entitlementId,
                employeeRepository.findById(employeeId).orElseThrow(
                        () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND))
        ).orElseThrow(
                () -> new AppException("Asi.employee.entitlementNotFound", HttpStatus.NOT_FOUND));

        User updateUser = Utils.getCurrentUser();
        entitlementPermission.setEntitlement(entitlement);
        entitlement.setUpdatedAt(Instant.now());
        entitlement.setUpdatedBy(updateUser.getId());
        entitlementPermissionRepository.save(entitlementPermission);

        return this.getEntitlementDetails(entitlement.getEmployee().getId(), entitlement.getId());
    }

    @Override
    @Transactional
    public EntitlementDetailsResponse deleteEntitlementPermission(final Long employeeId, final Long entitlementId, final Long permissionId) {

        Entitlement entitlement = entitlementRepository.findByIdAndEmployee(entitlementId,
                employeeRepository.findById(employeeId).orElseThrow(
                        () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND))
        ).orElseThrow(
                () -> new AppException("Asi.employee.entitlementNotFound", HttpStatus.NOT_FOUND));

        if (entitlementPermissionRepository.findByEntitlementOrderById(entitlement)
                .stream().anyMatch(entitlementPermission -> entitlementPermission.getId().equals(permissionId))) {
            User updateUser = Utils.getCurrentUser();
            entitlementPermissionRepository.deleteById(permissionId);
            entitlement.setUpdatedAt(Instant.now());
            entitlement.setUpdatedBy(updateUser.getId());

            return this.getEntitlementDetails(entitlement.getEmployee().getId(), entitlement.getId());

        } else {
            throw new AppException("Asi.employee.entitlement.permissionNotFound", HttpStatus.NOT_FOUND);
        }
    }
}
