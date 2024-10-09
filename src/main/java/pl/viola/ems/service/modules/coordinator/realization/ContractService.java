package pl.viola.ems.service.modules.coordinator.realization;

import org.springframework.data.domain.Page;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.payload.modules.coordinator.application.realization.contract.ContractPayload;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface ContractService {

    Page<ContractPayload> getContracts(SearchConditions searchConditions, boolean isExport, String accessLevel);

    Contract getContractDetails(Long contractId);

    Page<ContractPayload> getContractsAsDictionary(SearchConditions searchConditions, boolean isExport);

    Set<Contract> getContractsByYear(int year);

    Contract saveContract(Contract contract, String action);

    String deleteContract(Long contractId);

    List<Invoice> getInvoices(Long contractId);

    void exportContractsToExcel(ExportType exportType, ExportConditions exportConditions, HttpServletResponse response, String accessLevel) throws IOException;
}
