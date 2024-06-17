package pl.viola.ems.model.modules.hr.employees.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.hr.employees.Employee;

import java.util.Set;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, EmployeeRepositoryCustom {

    Set<Employee> findAllByOrderByName();
}
