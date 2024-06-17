package pl.viola.ems.service.modules.coordinator.realization;

import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.accountant.institution.plans.InvoiceInstitutionPositionsResponse;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPlanPosition;
import pl.viola.ems.payload.modules.coordinator.application.realization.invoice.InvoicePositionPayload;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public interface InvoiceService {

    Set<Invoice> getInvoices(int year);

    Set<Invoice> getInvoicesByYear(int year);

    Invoice saveInvoice(Invoice invoice, String action);

    String deleteInvoice(Long invoiceId);

    List<InvoicePosition> getInvoicePositions(Long invoiceId);

    Set<InvoicePositionPayload> getInvoicesPositionsByCoordinatorPlanPosition(CoordinatorPlan.PlanType planType, Long positionId);

    InvoicePosition saveInvoicePosition(InvoicePosition invoicePosition, Long invoiceId, String action);

    String deleteInvoicePosition(Long invoicePositionId);

    List<ApplicationPlanPosition> getPlanPositionByYearAndPlanType(Integer year, CoordinatorPlan.PlanType planType);

    Set<InvoiceInstitutionPositionsResponse> getInvoicesByInstitutionPlanPositions(Long institutionPlanPositionId);

    void exportPlanPositionInvoicesPositionsToXlsx(ExportType exportType, Long positionId, final ArrayList<ExcelHeadRow> headRow, final HttpServletResponse response, CoordinatorPlan.PlanType planType) throws IOException;

}
