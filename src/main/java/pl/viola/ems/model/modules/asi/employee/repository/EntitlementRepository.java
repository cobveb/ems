package pl.viola.ems.model.modules.asi.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.asi.employee.Entitlement;
import pl.viola.ems.model.modules.hr.employees.Employee;

import java.util.Optional;
import java.util.Set;

@Repository
public interface EntitlementRepository extends JpaRepository<Entitlement, Long>, EntitlementPermissionCustomRepository {
    Set<Entitlement> findByEmployeeOrderById(Employee employee);

    Optional<Entitlement> findByIdAndEmployee(Long Id, Employee employee);
}
