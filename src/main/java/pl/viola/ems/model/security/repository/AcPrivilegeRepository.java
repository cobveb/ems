package pl.viola.ems.model.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.security.AcPrivilege;

@Repository
public interface AcPrivilegeRepository extends JpaRepository<AcPrivilege, Long> {
    AcPrivilege findByCode(String code);
}
