package pl.viola.ems.model.common.register.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.common.register.Register;

import java.util.Optional;
import java.util.Set;

@Repository
public interface RegisterRepository extends JpaRepository<Register, Long> {

    Set<Register> findByCodeIn(Set<String> codes);

    Optional<Register> findByCode(String code);
}
