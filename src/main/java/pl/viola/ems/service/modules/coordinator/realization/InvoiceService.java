package pl.viola.ems.service.modules.coordinator.realization;

import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;
import pl.viola.ems.payload.modules.coordinator.application.realization.invoice.InvoicePositionPayload;

import java.util.List;
import java.util.Set;

public interface InvoiceService {

    Set<Invoice> getInvoices();

    List<Invoice> getInvoicesByYear(int year);

    Invoice saveInvoice(Invoice invoice, String action);

    String deleteInvoice(Long invoiceId);

    List<InvoicePosition> getInvoicePositions(Long invoiceId);

    Set<InvoicePositionPayload> getInvoicesPositionsByCoordinatorPlanPosition(CoordinatorPlan.PlanType planType, Long positionId);

    InvoicePosition saveInvoicePosition(InvoicePosition invoicePosition, Long invoiceId, String action);

    String deleteInvoicePosition(Long invoicePositionId);
}
