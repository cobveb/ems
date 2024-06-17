package pl.viola.ems.service.modules.hr.employees.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.model.modules.hr.employees.repository.EmployeeRepository;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.hr.employees.EmployeeService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public Page<Employee> getEmployeesPageable(final SearchConditions searchConditions) {

        return employeeRepository.findEmployeesPageable(searchConditions.getConditions(), PageRequest.of(
                searchConditions.getPage(),
                searchConditions.getRowsPerPage(),
                searchConditions.getSort().getOrderType() != null ? searchConditions.getSort().getOrderType().equals("desc") ?
                        Sort.by(searchConditions.getSort().getOrderBy()).descending() : Sort.by(searchConditions.getSort().getOrderBy()).ascending() : Sort.by("id")
        ), false);
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

    @Override
    public void exportEmployeesToExcel(final ExportType exportType, final ExportConditions exportConditions, final HttpServletResponse response) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        employeeRepository.findEmployeesPageable(exportConditions.getSearchConditions().getConditions(), PageRequest.of(
                exportConditions.getSearchConditions().getPage(),
                exportConditions.getSearchConditions().getRowsPerPage(),
                exportConditions.getSearchConditions().getSort().getOrderType() != null ? exportConditions.getSearchConditions().getSort().getOrderType().equals("desc") ?
                        Sort.by(exportConditions.getSearchConditions().getSort().getOrderBy()).descending() : Sort.by(exportConditions.getSearchConditions().getSort().getOrderBy()).ascending() : Sort.by("id")
        ), true).forEach(employee -> {
            Map<String, Object> row = new HashMap<>();
            row.put("id", employee.getId());
            row.put("name", employee.getName());
            row.put("surname", employee.getSurname());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, exportConditions.getHeadRows(), rows, response);
    }
}
