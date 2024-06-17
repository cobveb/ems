package pl.viola.ems.service.modules.hr.employees;

import org.springframework.data.domain.Page;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.payload.export.ExportConditions;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface EmployeeService {

    Page<Employee> getEmployeesPageable(SearchConditions conditions);

    Employee saveEmployee(Employee employee);

    String deleteEmployee(Long employeeId);

    void exportEmployeesToExcel(ExportType exportType, ExportConditions exportConditions, HttpServletResponse response) throws IOException;

}
