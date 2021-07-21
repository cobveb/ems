package pl.viola.ems.model.modules.coordinator.publicProcurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationAssortmentGroup;

@Repository
public interface PublicProcurementApplicationAssortmentGroupRepository extends JpaRepository<ApplicationAssortmentGroup, Long> {
}
