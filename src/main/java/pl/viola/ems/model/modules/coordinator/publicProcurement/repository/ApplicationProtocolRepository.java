package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocol;

import java.util.List;

@Repository
public interface ApplicationProtocolRepository extends JpaRepository<ApplicationProtocol, Long> {

    List<ApplicationProtocol> findByIdInAndStatusIn(List<Long> ids, List<ApplicationProtocol.ProtocolStatus> statuses);
}
