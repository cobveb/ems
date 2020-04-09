package pl.viola.ems.model.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.security.AcObject;

@Repository
public interface AcObjectRepository extends JpaRepository<AcObject, Long> {

}
