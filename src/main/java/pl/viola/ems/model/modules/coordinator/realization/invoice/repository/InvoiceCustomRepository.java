package pl.viola.ems.model.modules.coordinator.realization.invoice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.payload.modules.coordinator.realization.invoice.InvoicePayload;

import java.util.List;

public interface InvoiceCustomRepository {
    Page<InvoicePayload> findInvoicesPageable(List<OrganizationUnit> coordinators, List<SearchCondition> conditions, Pageable pageable, Boolean isExport, String accessLevel);

}
