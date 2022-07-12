package pl.viola.ems.service.modules.coordinator.realization;

import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;

import java.util.List;
import java.util.Set;

public interface ContractService {

    Set<Contract> getContracts();

    List<Contract> getAllContracts();

    Set<Contract> getContractsByYear(int year);

    Contract saveContract(Contract contract, String action);

    String deleteContract(Long contractId);

    List<Invoice> getInvoices(Long contractId);
}
