package pl.viola.ems.service.modules.hr.employees.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.model.modules.hr.employees.repository.EmployeeRepository;
import pl.viola.ems.service.modules.hr.employees.EmployeeService;

import java.util.Locale;
import java.util.Set;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public Set<Employee> getEmployees() {

        return employeeRepository.findAllByOrderByName();
    }

    @Override
    public Employee saveEmployee(final Employee employee) {

        return employeeRepository.save(employee);
    }

    @Override
    public String deleteEmployee(final Long employeeId) {
        if (employeeRepository.existsById(employeeId)) {
            employeeRepository.deleteById(employeeId);
            return messageSource.getMessage("Hr.employee.employment.deleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException("Hr.employee.employeeNotFound", HttpStatus.BAD_REQUEST);
        }
    }
}
