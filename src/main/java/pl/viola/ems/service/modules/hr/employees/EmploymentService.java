package pl.viola.ems.service.modules.hr.employees;

import pl.viola.ems.model.modules.hr.employees.Employment;
import pl.viola.ems.model.modules.hr.employees.EmploymentAuthorization;
import pl.viola.ems.model.modules.hr.employees.EmploymentStatement;
import pl.viola.ems.model.modules.hr.employees.EmploymentWorkplace;
import pl.viola.ems.payload.modules.asi.employee.EntitlementEmploymentResponse;

import java.util.Set;

public interface EmploymentService {
    Set<Employment> getEmploymentsByEmployee(Long employeeId);

    Set<EntitlementEmploymentResponse> getActiveEmploymentsByEmployee(Long employeeId);

    Employment saveEmployment(Long employeeId, Employment employment);

    String deleteEmployment(Long employeeId, Long employmentId);

    Set<EmploymentStatement> getEmploymentStatements(Long employeeId, Long employmentId);

    EmploymentStatement saveEmploymentStatement(Long employeeId, Long employmentId, EmploymentStatement statement);

    String deleteEmploymentStatement(Long employeeId, Long employmentId, Long statementId);

    Set<EmploymentAuthorization> getEmploymentAuthorizations(Long employeeId, Long employmentId);

    EmploymentAuthorization saveEmploymentAuthorization(Long employeeId, Long employmentId, EmploymentAuthorization authorization);

    String deleteEmploymentAuthorization(Long employeeId, Long employmentId, Long authorizationId);

    Set<EmploymentWorkplace> getEmploymentWorkplaces(Long employeeId, Long employmentId);

    EmploymentWorkplace saveEmploymentWorkplace(Long employeeId, Long employmentId, EmploymentWorkplace workplace);

    String deleteEmploymentWorkplace(Long employeeId, Long employmentId, Long workplaceId);
}
