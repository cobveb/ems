package pl.viola.ems.model.modules.coordinator.realization.invoice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;

import java.util.List;
import java.util.Set;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Set<Invoice> findByCoordinatorIn(List<OrganizationUnit> coordinators);
}
