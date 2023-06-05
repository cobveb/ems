package pl.viola.ems.model.modules.hr.employees.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.hr.employees.Employment;
import pl.viola.ems.model.modules.hr.employees.EmploymentStatement;

import java.util.Set;

@Repository
public interface EmploymentStatementRepository extends JpaRepository<EmploymentStatement, Long> {
    Set<EmploymentStatement> findByEmploymentOrderById(Employment employment);

    @Modifying
    @Query("delete from EmploymentStatement sta where sta.employment=:employment")
    void deleteStatementsByEmployment(@Param("employment") Employment employment);
}
