package pl.viola.ems.service.modules.hr.employees.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.hr.employees.*;
import pl.viola.ems.model.modules.hr.employees.repository.*;
import pl.viola.ems.service.modules.hr.employees.EmploymentService;

import java.util.Locale;
import java.util.Set;

@Service
public class EmploymentServiceImpl implements EmploymentService {
    @Autowired
    EmploymentRepository employmentRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    EmploymentStatementRepository employmentStatementRepository;

    @Autowired
    EmploymentAuthorizationRepository employmentAuthorizationRepository;

    @Autowired
    EmploymentWorkplaceRepository employmentWorkplaceRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public Set<Employment> getEmploymentsByEmployee(final Long employeeId) {

        return employmentRepository.findByEmployeeOrderById(employeeRepository.findById(employeeId).orElseThrow(
                () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND)));
    }

    @Override
    @Transactional
    public Employment saveEmployment(final Long employeeId, final Employment employment) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND));
        employment.setEmployee(employee);

        return employmentRepository.save(employment);
    }

    @Override
    @Transactional
    public String deleteEmployment(final Long employeeId, final Long employmentId) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                () -> new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND));

        Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
        );

        if (employment.getEmployee().equals(employee)) {
            employmentStatementRepository.deleteStatementsByEmployment(employment);
            employmentAuthorizationRepository.deleteAuthorizationsByEmployment(employment);
            employmentWorkplaceRepository.deleteWorkplacesByEmployment(employment);
            employmentRepository.delete(employment);
            return messageSource.getMessage("Hr.employee.employment.deleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException("Hr.employee.employmentNotFound", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public Set<EmploymentStatement> getEmploymentStatements(final Long employeeId, final Long employmentId) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );
            return employmentStatementRepository.findByEmploymentOrderById(employment);
        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public EmploymentStatement saveEmploymentStatement(final Long employeeId, final Long employmentId, final EmploymentStatement statement) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );
            statement.setEmployment(employment);
            return employmentStatementRepository.save(statement);

        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public String deleteEmploymentStatement(final Long employeeId, final Long employmentId, final Long statementId) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );

            EmploymentStatement statement = employmentStatementRepository.findById(statementId).orElseThrow(
                    () -> new AppException("Hr.employee.employment.statementNotFound", HttpStatus.NOT_FOUND)
            );

            if (statement.getEmployment().equals(employment)) {
                employmentStatementRepository.delete(statement);
                return messageSource.getMessage("Hr.employee.employment.statementDeleteMsg", null, Locale.getDefault());

            } else {
                throw new AppException("Hr.employee.employment.employmentStatementNotFound", HttpStatus.NOT_FOUND);
            }
        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public Set<EmploymentAuthorization> getEmploymentAuthorizations(final Long employeeId, final Long employmentId) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );
            return employmentAuthorizationRepository.findByEmploymentOrderById(employment);
        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public EmploymentAuthorization saveEmploymentAuthorization(final Long employeeId, final Long employmentId, final EmploymentAuthorization authorization) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );
            authorization.setEmployment(employment);
            return employmentAuthorizationRepository.save(authorization);

        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public String deleteEmploymentAuthorization(final Long employeeId, final Long employmentId, final Long authorizationId) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );

            EmploymentAuthorization authorization = employmentAuthorizationRepository.findById(authorizationId).orElseThrow(
                    () -> new AppException("Hr.employee.employment.authorizationNotFound", HttpStatus.NOT_FOUND)
            );

            if (authorization.getEmployment().equals(employment)) {
                employmentAuthorizationRepository.delete(authorization);
                return messageSource.getMessage("Hr.employee.employment.authorizationDeleteMsg", null, Locale.getDefault());

            } else {
                throw new AppException("Hr.employee.employment.employmentAuthorizationNotFound", HttpStatus.NOT_FOUND);
            }
        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public Set<EmploymentWorkplace> getEmploymentWorkplaces(final Long employeeId, final Long employmentId) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );
            return employmentWorkplaceRepository.findByEmploymentOrderById(employment);
        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public EmploymentWorkplace saveEmploymentWorkplace(final Long employeeId, final Long employmentId, final EmploymentWorkplace workplace) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );
            workplace.setEmployment(employment);
            return employmentWorkplaceRepository.save(workplace);

        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public String deleteEmploymentWorkplace(final Long employeeId, final Long employmentId, final Long workplaceId) {
        if (employeeRepository.existsById(employeeId)) {
            Employment employment = employmentRepository.findById(employmentId).orElseThrow(
                    () -> new AppException("Hr.employee.employmentNotFound", HttpStatus.NOT_FOUND)
            );

            EmploymentWorkplace workplace = employmentWorkplaceRepository.findById(workplaceId).orElseThrow(
                    () -> new AppException("Hr.employee.employment.workplaceNotFound", HttpStatus.NOT_FOUND)
            );

            if (workplace.getEmployment().equals(employment)) {
                employmentWorkplaceRepository.delete(workplace);
                return messageSource.getMessage("Hr.employee.employment.workplaceDeleteMsg", null, Locale.getDefault());

            } else {
                throw new AppException("Hr.employee.employment.employmentWorkplaceNotFound", HttpStatus.NOT_FOUND);
            }
        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.NOT_FOUND);
        }
    }
}
