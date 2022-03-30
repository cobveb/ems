package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocolPrice;

@Repository
public interface ApplicationProtocolPriceRepository extends JpaRepository<ApplicationProtocolPrice, Long> {
}
