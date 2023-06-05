package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocol;

import java.util.List;
import java.util.Set;

@Repository
public interface ApplicationProtocolRepository extends JpaRepository<ApplicationProtocol, Long> {

    Set<ApplicationProtocol> findByIdInAndStatusIn(List<Long> ids, List<ApplicationProtocol.ProtocolStatus> statuses);
}
