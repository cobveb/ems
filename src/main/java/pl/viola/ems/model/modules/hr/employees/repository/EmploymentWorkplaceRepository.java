package pl.viola.ems.model.modules.hr.employees.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.hr.employees.Employment;
import pl.viola.ems.model.modules.hr.employees.EmploymentWorkplace;

import java.util.Set;

@Repository
public interface EmploymentWorkplaceRepository extends JpaRepository<EmploymentWorkplace, Long> {
    Set<EmploymentWorkplace> findByEmploymentOrderById(Employment employment);

    @Modifying
    @Query("delete from EmploymentWorkplace wpl where wpl.employment=:employment")
    void deleteWorkplacesByEmployment(@Param("employment") Employment employment);
}
