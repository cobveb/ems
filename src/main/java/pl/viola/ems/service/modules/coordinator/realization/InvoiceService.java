package pl.viola.ems.service.modules.coordinator.realization;

import org.springframework.data.domain.Page;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.payload.modules.accountant.institution.plans.InvoiceInstitutionPositionsResponse;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPlanPosition;
import pl.viola.ems.payload.modules.coordinator.application.realization.invoice.InvoicePayload;
import pl.viola.ems.payload.modules.coordinator.application.realization.invoice.InvoicePositionPayload;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public interface InvoiceService {

    Page<InvoicePayload> getInvoicesPageable(SearchConditions searchConditions, boolean isExport, String accessLevel);

    Invoice getInvoiceDetails(Long invoiceId);

    Invoice saveInvoice(Invoice invoice, String action);

    String deleteInvoice(Long invoiceId);

    Set<InvoicePositionPayload> getInvoicesPositionsByCoordinatorPlanPosition(CoordinatorPlan.PlanType planType, Long positionId);

    InvoicePosition saveInvoicePosition(InvoicePosition invoicePosition, Long invoiceId, String action);

    String deleteInvoicePosition(Long invoicePositionId);

    List<ApplicationPlanPosition> getPlanPositionByYearAndPlanType(Integer year, CoordinatorPlan.PlanType planType);

    Set<InvoiceInstitutionPositionsResponse> getInvoicesByInstitutionPlanPositions(Long institutionPlanPositionId);

    void exportInvoicesToExcel(ExportType exportType, ExportConditions exportConditions, HttpServletResponse response, String accessLevel) throws IOException;

    void exportPlanPositionInvoicesPositionsToXlsx(ExportType exportType, Long positionId, final ArrayList<ExcelHeadRow> headRow, final HttpServletResponse response, CoordinatorPlan.PlanType planType) throws IOException;


}
