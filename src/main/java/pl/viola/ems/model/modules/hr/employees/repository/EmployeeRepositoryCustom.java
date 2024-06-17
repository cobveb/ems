package pl.viola.ems.model.modules.hr.employees.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.hr.employees.Employee;

import java.util.List;

public interface EmployeeRepositoryCustom {
    Page<Employee> findEmployeesPageable(List<SearchCondition> conditions, Pageable pageable, Boolean isExport);
}
