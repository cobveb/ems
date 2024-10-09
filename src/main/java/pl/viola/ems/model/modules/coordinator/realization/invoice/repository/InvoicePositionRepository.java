package pl.viola.ems.model.modules.coordinator.realization.invoice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;

import java.util.List;
import java.util.Set;

@Repository
public interface InvoicePositionRepository extends JpaRepository<InvoicePosition, Long> {

    Set<InvoicePosition> findByCoordinatorPlanPositionIn(List<CoordinatorPlanPosition> coordinatorPlanPositions);

    Set<InvoicePosition> findByInvoice(Invoice invoice);
}
