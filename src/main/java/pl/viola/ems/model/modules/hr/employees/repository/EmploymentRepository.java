package pl.viola.ems.model.modules.hr.employees.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.model.modules.hr.employees.Employment;

import java.util.Set;

@Repository
public interface EmploymentRepository extends JpaRepository<Employment, Long> {
    Set<Employment> findByEmployeeOrderById(Employee employee);

    boolean existsEmploymentByEmployee(Employee employee);
}
