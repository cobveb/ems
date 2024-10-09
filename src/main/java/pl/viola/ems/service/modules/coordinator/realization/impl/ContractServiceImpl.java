package pl.viola.ems.service.modules.coordinator.realization.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;
import pl.viola.ems.model.modules.coordinator.realization.contracts.repository.ContractRepository;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.payload.modules.coordinator.application.realization.contract.ContractPayload;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.realization.ContractService;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

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

//    @Override
//    public Set<Contract> getContracts(final int year) {
//        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
//                Utils.getCurrentUser().getOrganizationUnit().getCode()
//        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));
//
//        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));
//
//        if (year != 0) {
//            LocalDate curYear = LocalDate.of(year, Month.JANUARY, 1);
//            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
//            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
//            return contractRepository.findBySigningDateBetweenAndCoordinatorIn(firstDay, lastDay, coordinators);
//        } else {
//            return contractRepository.findByCoordinatorIn(coordinators);
//        }
//    }

    @Override
    public Page<ContractPayload> getContracts(final SearchConditions searchConditions, final boolean isExport, final String accessLevel) {
        List<OrganizationUnit> coordinators = new ArrayList<>();

        if (accessLevel.equals("coordinator")) {
            coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                    Utils.getCurrentUser().getOrganizationUnit().getCode()
            ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

            coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));
        }

        return contractRepository.findContractsPageable(coordinators, searchConditions.getConditions(), PageRequest.of(
                searchConditions.getPage(),
                searchConditions.getRowsPerPage(),
                searchConditions.getSort().getOrderType() != null ? searchConditions.getSort().getOrderType().equals("desc") ?
                        Sort.by(searchConditions.getSort().getOrderBy()).descending() : Sort.by(searchConditions.getSort().getOrderBy()).ascending() : Sort.by("id")
        ), isExport, accessLevel);
    }

    @Override
    public Contract getContractDetails(final Long contractId) {
        return contractRepository.findById(contractId).orElseThrow(() -> new AppException("Coordinator.contract.notFound", HttpStatus.NOT_FOUND));
    }

    @Override
    public Page<ContractPayload> getContractsAsDictionary(final SearchConditions searchConditions, final boolean isExport) {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        return contractRepository.findByCoordinatorAsDictionary(coordinators, searchConditions.getConditions(), PageRequest.of(
                searchConditions.getPage(),
                searchConditions.getRowsPerPage(),
                searchConditions.getSort().getOrderType() != null ? searchConditions.getSort().getOrderType().equals("desc") ?
                        Sort.by(searchConditions.getSort().getOrderBy()).descending() : Sort.by(searchConditions.getSort().getOrderBy()).ascending() : Sort.by("id")
        ), isExport);
    }

    @Override
    public Set<Contract> getContractsByYear(final int year) {
        if (year != 0) {
            LocalDate curYear = LocalDate.of(year, Month.JANUARY, 1);
            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
            return contractRepository.findBySigningDateBetween(firstDay, lastDay);
        } else {
            return new HashSet<>(contractRepository.findAll());
        }
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

    @Override
    public void exportContractsToExcel(final ExportType exportType, final ExportConditions exportConditions, final HttpServletResponse response, final String accessLevel) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        this.getContracts(exportConditions.getSearchConditions(), true, accessLevel).forEach(contract -> {
            Map<String, Object> row = new HashMap<>();
            row.put("number", contract.getNumber());
            row.put("contractObject", contract.getContractObject());
            row.put("signingDate", contract.getSigningDate());
            row.put("contractValueGross", contract.getContractValueGross());
            if (!accessLevel.equals("coordinator")) {
                row.put("coordinator", contract.getCoordinator());
            }
            row.put("realizedValueGross", contract.getRealizedValueGross());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, exportConditions.getHeadRows(), rows, response);
    }
}
