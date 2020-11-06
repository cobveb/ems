package pl.viola.ems.model.modules.applicant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.applicant.Application;
import pl.viola.ems.model.modules.applicant.ApplicationPosition;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationPositionRepository extends JpaRepository<ApplicationPosition, Long> {

    List<ApplicationPosition> findByApplication(Optional<Application> application);

}
