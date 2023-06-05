package pl.viola.ems.service.modules.hr.employees;

import pl.viola.ems.model.modules.hr.employees.Employee;

import java.util.Set;

public interface EmployeeService {

    Set<Employee> getEmployees();

    Employee saveEmployee(Employee employee);

    String deleteEmployee(Long employeeId);
}
