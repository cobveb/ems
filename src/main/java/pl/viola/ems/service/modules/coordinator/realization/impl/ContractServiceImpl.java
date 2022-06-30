package pl.viola.ems.service.modules.coordinator.realization.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;
import pl.viola.ems.model.modules.coordinator.realization.contracts.repository.ContractRepository;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.realization.ContractService;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;
import pl.viola.ems.utils.Utils;

import java.util.*;

@Service
public class ContractServiceImpl implements ContractService {
    @Autowired
    OrganizationUnitService organizationUnitService;

    @Autowired
    ContractRepository contractRepository;

    @Autowired
    InvoiceService invoiceService;

    @Autowired
    MessageSource messageSource;

    @Override
    public Set<Contract> getContracts() {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        return contractRepository.findByCoordinatorIn(coordinators);
    }

    @Transactional
    @Override
    public Contract saveContract(final Contract contract, final String action) {
        if (action.equals("add")) {
            contract.setCoordinator(Utils.getCurrentUser().getOrganizationUnit());
        }
        return contractRepository.save(contract);
    }

    @Transactional
    @Override
    public String deleteContract(final Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new AppException("Coordinator.contract.notFound", HttpStatus.NOT_FOUND));

        if (!contract.getInvoices().isEmpty()) {
            contract.getInvoices().forEach(invoice -> invoiceService.deleteInvoice(invoice.getId()));
        }

        contractRepository.deleteById(contract.getId());

        return messageSource.getMessage("Coordinator.contract.deleteMsg", null, Locale.getDefault());
    }

    @Override
    public List<Invoice> getInvoices(final Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new AppException("Coordinator.contract.notFound", HttpStatus.NOT_FOUND));

        return new ArrayList<>(contract.getInvoices());
    }
}
