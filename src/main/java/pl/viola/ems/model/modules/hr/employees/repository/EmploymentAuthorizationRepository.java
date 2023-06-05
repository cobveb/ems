package pl.viola.ems.model.modules.hr.employees.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.hr.employees.Employment;
import pl.viola.ems.model.modules.hr.employees.EmploymentAuthorization;

import java.util.Set;

@Repository
public interface EmploymentAuthorizationRepository extends JpaRepository<EmploymentAuthorization, Long> {
    Set<EmploymentAuthorization> findByEmploymentOrderById(Employment employment);

    @Modifying
    @Query("delete from EmploymentAuthorization auth where auth.employment=:employment")
    void deleteAuthorizationsByEmployment(@Param("employment") Employment employment);
}
