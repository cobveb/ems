package pl.viola.ems.model.modules.coordinator.realization.invoice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;

@Repository
public interface InvoicePositionRepository extends JpaRepository<InvoicePosition, Long> {
}
