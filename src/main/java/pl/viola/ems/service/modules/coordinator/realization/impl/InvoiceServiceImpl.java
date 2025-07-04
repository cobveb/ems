package pl.viola.ems.service.modules.coordinator.realization.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionCoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionPlanPositionRepository;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.FinancialPosition;
import pl.viola.ems.model.modules.coordinator.plans.InvestmentPosition;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.PublicProcurementApplicationRepository;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;
import pl.viola.ems.model.modules.coordinator.realization.invoice.repository.InvoicePositionRepository;
import pl.viola.ems.model.modules.coordinator.realization.invoice.repository.InvoiceRepository;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.payload.modules.accountant.institution.plans.InvoiceInstitutionPositionsResponse;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPlanPosition;
import pl.viola.ems.payload.modules.coordinator.realization.invoice.InvoicePayload;
import pl.viola.ems.payload.modules.coordinator.realization.invoice.InvoicePositionPayload;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.coordinator.realization.ContractService;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    OrganizationUnitService organizationUnitService;

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    ContractService contractService;

    @Autowired
    InvoicePositionRepository invoicePositionRepository;

    @Autowired
    MessageSource messageSource;

    @Autowired
    PublicProcurementApplicationRepository publicProcurementApplicationRepository;

    @Autowired
    PlanService planService;

    @Autowired
    InstitutionCoordinatorPlanPositionRepository institutionCoordinatorPlanPositionRepository;

    @Autowired
    CoordinatorPlanPositionRepository<InvestmentPosition> investmentPositionRepository;

    @Autowired
    CoordinatorPlanPositionRepository<FinancialPosition> financialPositionRepository;

    @Autowired
    InstitutionPlanPositionRepository institutionPlanPositionRepository;

    @Override
    public Page<InvoicePayload> getInvoicesPageable(final SearchConditions searchConditions, final boolean isExport, final String accessLevel) {
        List<OrganizationUnit> coordinators = new ArrayList<>();

        if (accessLevel.equals("coordinator")) {
            coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                    Utils.getCurrentUser().getOrganizationUnit().getCode()
            ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

            coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));
        }
        return invoiceRepository.findInvoicesPageable(coordinators, searchConditions.getConditions(), PageRequest.of(
                searchConditions.getPage(),
                searchConditions.getRowsPerPage(),
                searchConditions.getSort().getOrderType() != null ? searchConditions.getSort().getOrderType().equals("desc") ?
                        Sort.by(searchConditions.getSort().getOrderBy()).descending() : Sort.by(searchConditions.getSort().getOrderBy()).ascending() : Sort.by("id")
        ), isExport, accessLevel);
    }

    @Override
    public Invoice getInvoiceDetails(final Long invoiceId) {
        return invoiceRepository.findById(invoiceId).orElseThrow(() -> new AppException("Coordinator.invoice.notFound", HttpStatus.NOT_FOUND));
    }

    @Transactional
    @Override
    public Invoice saveInvoice(final Invoice invoice, final String action) {
        if (action.equals("add")) {
            invoice.setCoordinator(Utils.getCurrentUser().getOrganizationUnit());
        } else if (action.equals("edit") && !invoice.getInvoicePositions().isEmpty()) {
            invoice.getInvoicePositions().forEach(invoicePosition -> invoicePosition.setInvoice(invoice));
            Invoice prevInvoice = invoiceRepository.findById(invoice.getId())
                    .orElseThrow(() -> new AppException("Coordinator.invoice.notFound", HttpStatus.NOT_FOUND));
            if (prevInvoice.getContract() != null && prevInvoice.getContract() != invoice.getContract()) {
                // Updated previous contract values
                Map<String, BigDecimal> updatedPrevContractValues = this.updateContractValues(prevInvoice, "delete");
                Contract prevContract = contractService.getContractDetails(prevInvoice.getContract().getId());

                prevContract.setInvoicesValueNet(updatedPrevContractValues.get("contractInvoicesValueNet"));
                prevContract.setInvoicesValueGross(updatedPrevContractValues.get("contractInvoicesValueGross"));
                prevContract.setRealizedOptionValueNet(updatedPrevContractValues.get("contractRealizedInvoicesOptionValueNet"));
                prevContract.setRealizedOptionValueGross(updatedPrevContractValues.get("contractRealizedInvoicesOptionValueGross"));
                contractService.saveContract(prevContract, "edit");
            }
            if (invoice.getContract() != null && prevInvoice.getContract() != invoice.getContract()) {
                // Updated values if current contract changed
                Map<String, BigDecimal> updatedContractValues = this.updateContractValues(invoice, "add");
                Contract contract = contractService.getContractDetails(invoice.getContract().getId());
                contract.setInvoicesValueNet(updatedContractValues.get("contractInvoicesValueNet"));
                contract.setInvoicesValueGross(updatedContractValues.get("contractInvoicesValueGross"));
                contract.setRealizedOptionValueNet(updatedContractValues.get("contractRealizedInvoicesOptionValueNet"));
                contract.setRealizedOptionValueGross(updatedContractValues.get("contractRealizedInvoicesOptionValueGross"));
                contractService.saveContract(contract, "edit");
            }
        }

        if (invoice.getPublicProcurementApplication() != null) {
            invoice.setPublicProcurementApplication(publicProcurementApplicationRepository.findById(invoice.getPublicProcurementApplication().getId())
                    .orElseThrow(() -> new AppException("Coordinator.publicProcurement.application.notFound", HttpStatus.NOT_FOUND)));
        }

        return invoiceRepository.save(invoice);
    }

    @Transactional
    @Override
    public String deleteInvoice(final Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new AppException("Coordinator.invoice.notFound", HttpStatus.NOT_FOUND));

        // Update coordinator plan realized value on delete
        if (!invoice.getInvoicePositions().isEmpty()) {
            invoice.getInvoicePositions().forEach(invoicePosition -> {
                this.setCoordinatorPlanPositionAmountRealizedSubtract(invoicePosition);
                if (invoicePosition.getPositionIncludedPlanType().equals(CoordinatorPlan.PlanType.FIN)) {
                    // Update institution plan position
                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPosition(
                            invoicePosition.getCoordinatorPlanPosition()
                    );

                    this.setInstitutionPlanPositionAmountRealizedSubtract(institutionCoordinatorPlanPosition, invoicePosition);
                }
            });
        }


        // Update contract values if the deleted invoice was related to a contract
        if (invoice.getContract() != null) {
            invoice.getContract().getInvoices().remove(invoice);
            Map<String, BigDecimal> updatedContractValues = this.updateContractValues(invoice, "delete");

            invoice.getContract().setInvoicesValueNet(updatedContractValues.get("contractInvoicesValueNet"));
            invoice.getContract().setInvoicesValueGross(updatedContractValues.get("contractInvoicesValueGross"));
            invoice.getContract().setRealizedOptionValueNet(updatedContractValues.get("contractRealizedInvoicesOptionValueNet"));
            invoice.getContract().setRealizedOptionValueGross(updatedContractValues.get("contractRealizedInvoicesOptionValueGross"));
        }

        invoiceRepository.deleteById(invoice.getId());

        return messageSource.getMessage("Coordinator.invoice.deleteMsg", null, Locale.getDefault());
    }

    @Override
    public Set<InvoicePositionPayload> getInvoicesPositionsByCoordinatorPlanPosition(final CoordinatorPlan.PlanType planType, final Long positionId) {
        Set<InvoicePositionPayload> positions = new HashSet<>();
        List<CoordinatorPlanPosition> planPositions = new ArrayList<>();

        CoordinatorPlanPosition coordinatorPlanPosition = planType.equals(CoordinatorPlan.PlanType.FIN) ?
                financialPositionRepository.findById(positionId).orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)) :
                investmentPositionRepository.findById(positionId).orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));

        planPositions.add(coordinatorPlanPosition);

        if (coordinatorPlanPosition.getCorrectionPlanPosition() != null) {
            planPositions.add(coordinatorPlanPosition.getCorrectionPlanPosition());
            this.findCorrectedPlanPosition(coordinatorPlanPosition.getCorrectionPlanPosition(), planPositions);
        }

        invoicePositionRepository.findByCoordinatorPlanPositionIn(planPositions).forEach(invoicePosition -> {
            InvoicePositionPayload positionPayload = new InvoicePositionPayload(
                    invoicePosition.getId(),
                    invoicePosition.getInvoice().getNumber(),
                    invoicePosition.getInvoice().getSellDate(),
                    invoicePosition.getInvoice().getContractor().getName(),
                    invoicePosition.getName(),
                    invoicePosition.getAmountNet(),
                    invoicePosition.getAmountGross(),
                    invoicePosition.getOptionValueNet(),
                    invoicePosition.getOptionValueGross()
            );

            positions.add(positionPayload);
        });

        return positions;
    }

    @Transactional
    @Override
    public InvoicePosition saveInvoicePosition(final InvoicePosition invoicePosition, final Long invoiceId, final String action) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new AppException("Coordinator.invoice.notFound", HttpStatus.NOT_FOUND));

        invoicePosition.setInvoice(invoice);
        invoicePosition.setCoordinatorPlanPosition(planService.findPositionsByIdsAndPlanType(
                Collections.singletonList(invoicePosition.getCoordinatorPlanPosition().getId()), invoicePosition.getPositionIncludedPlanType()).get(0)
        );

        if (action.equals("add")) {
            this.setCoordinatorPlanPositionAmountRealizedAdd(invoicePosition);
            this.updateInvoiceValues(invoice, invoicePosition, "save");
        } else if (action.equals("edit")) {
            InvoicePosition tmp = invoice.getInvoicePositions().stream().filter(position -> position.getId().equals(invoicePosition.getId()))
                    .findFirst().orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));
            /*
                Check if changed coordinator plan position on the current edited invoice position.
                If change find old institution plan position and subtract action on old plan position
            */
            if (!tmp.getCoordinatorPlanPosition().equals(invoicePosition.getCoordinatorPlanPosition())) {
                this.setCoordinatorPlanPositionAmountRealizedSubtract(tmp);
            }

            this.updateInvoiceValues(invoice, invoicePosition, "save");
            this.setCoordinatorPlanPositionAmountRealizedAdd(invoicePosition);
        }

        if (invoicePosition.getPositionIncludedPlanType().equals(CoordinatorPlan.PlanType.FIN)) {
            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPositionIn(Collections.singletonList(invoicePosition.getCoordinatorPlanPosition()))
                    .stream().findFirst().orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));
            if (action.equals("add")) {
                this.setInstitutionPlanPositionAmountRealizedAdd(institutionCoordinatorPlanPosition, invoicePosition);
            } else if (action.equals("edit")) {
                InvoicePosition tmp = invoice.getInvoicePositions().stream().filter(position -> position.getId().equals(invoicePosition.getId()))
                        .findFirst().orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));
                /*
                    Check if changed coordinator plan position on current editable invoice position.
                    If change find old institution plan position and update reazlized values on old plan position
                */
                if (!tmp.getCoordinatorPlanPosition().equals(invoicePosition.getCoordinatorPlanPosition())) {
                    InstitutionCoordinatorPlanPosition tmpInstitutionCoordinatorPlanPosition = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPositionIn(Collections.singletonList(tmp.getCoordinatorPlanPosition()))
                            .stream().findFirst().orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));
                    this.setInstitutionPlanPositionAmountRealizedSubtract(tmpInstitutionCoordinatorPlanPosition, invoicePosition);
                }
                this.setInstitutionPlanPositionAmountRealizedAdd(institutionCoordinatorPlanPosition, invoicePosition);
            }
        }
        return invoicePositionRepository.save(invoicePosition);
    }

    @Transactional
    @Override
    public String deleteInvoicePosition(final Long invoiceId, final Long invoicePositionId) {
        InvoicePosition invoicePosition = invoicePositionRepository.findById(invoicePositionId)
                .orElseThrow(() -> new AppException("Coordinator.invoice.positionNotExists", HttpStatus.BAD_REQUEST));
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new AppException("Coordinator.invoice.notFound", HttpStatus.NOT_FOUND));

        if (!invoice.getInvoicePositions().contains(invoicePosition)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Coordinator.invoice.notContainsPosition");
        }
        this.updateInvoiceValues(invoice, invoicePosition, "delete");
        this.setCoordinatorPlanPositionAmountRealizedSubtract(invoicePosition);

        if (invoicePosition.getPositionIncludedPlanType().equals(CoordinatorPlan.PlanType.FIN)) {
            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPositionIn(Collections.singletonList(invoicePosition.getCoordinatorPlanPosition()))
                    .stream().findFirst().orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));

            this.setInstitutionPlanPositionAmountRealizedSubtract(institutionCoordinatorPlanPosition, invoicePosition);
        }

        invoice.setInvoicePositions(invoice.getInvoicePositions().stream().filter(position -> !position.getId().equals(invoicePosition.getId())).collect(Collectors.toSet()));
        invoicePositionRepository.delete(invoicePosition);

        return messageSource.getMessage("Coordinator.invoice.position.deleteMsg", null, Locale.getDefault());
    }

    @Override
    public List<ApplicationPlanPosition> getPlanPositionByYearAndPlanType(final Integer year, final CoordinatorPlan.PlanType planType) {
        List<ApplicationPlanPosition> positions = new ArrayList<>();
        List<CoordinatorPlanPosition> planPositions = planService.getPlanPositionByYearAndPlanType(year, planType);
        if (!planPositions.isEmpty()) {
            planPositions.forEach(planPosition -> {
                ApplicationPlanPosition applicationPlanPosition = new ApplicationPlanPosition(
                        planPosition.getId(),
                        planType.equals(CoordinatorPlan.PlanType.FIN) ? planPosition.getCostType().getCode() : planPosition.getId().toString(),
                        planType.equals(CoordinatorPlan.PlanType.FIN) ? planPosition.getCostType().getName() : planPosition.getTask(),
                        planType.equals(CoordinatorPlan.PlanType.FIN) ? planPosition.getCostType().getName() : planPosition.getTask(),
                        planPosition.getAmountAwardedNet(),
                        planPosition.getAmountAwardedGross(),
                        planPosition.getAmountRealizedNet(),
                        planPosition.getAmountRealizedGross()
                );
                positions.add(applicationPlanPosition);
            });
        }
        return positions;
    }

    @Override
    public Set<InvoiceInstitutionPositionsResponse> getInvoicesByInstitutionPlanPositions(final Long planPositionId) {
        Set<InvoiceInstitutionPositionsResponse> invoicesPositions = new HashSet<>();

        InstitutionPlanPosition institutionPlanPosition = institutionPlanPositionRepository.findById(planPositionId)
                .orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.BAD_REQUEST));

        institutionPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(institutionCoordinatorPlanPosition -> {
            List<CoordinatorPlanPosition> planPositions = new ArrayList<>();

            planPositions.add(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition());
            if (institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getCorrectionPlanPosition() != null) {
                planPositions.add(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getCorrectionPlanPosition());
                this.findCorrectedPlanPosition(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getCorrectionPlanPosition(), planPositions);
            }

            invoicePositionRepository.findByCoordinatorPlanPositionIn(planPositions).forEach(invoicePosition -> {
                InvoiceInstitutionPositionsResponse invoiceInstitutionPositionsResponse = new InvoiceInstitutionPositionsResponse(
                        invoicePosition.getId(),
                        institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getPlan().getCoordinator().getName(),
                        invoicePosition.getInvoice().getNumber(),
                        invoicePosition.getInvoice().getSellDate(),
                        invoicePosition.getInvoice().getContractor().getName(),
                        invoicePosition.getName(),
                        invoicePosition.getAmountNet(),
                        invoicePosition.getAmountGross(),
                        invoicePosition.getOptionValueNet(),
                        invoicePosition.getOptionValueGross()
                );
                invoicesPositions.add(invoiceInstitutionPositionsResponse);
            });
        });

        return invoicesPositions;
    }

    @Override
    public void exportInvoicesToExcel(final ExportType exportType, final ExportConditions exportConditions, final HttpServletResponse response, final String accessLevel) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        this.getInvoicesPageable(exportConditions.getSearchConditions(), true, accessLevel).forEach(invoice -> {
            Map<String, Object> row = new HashMap<>();
            row.put("number", invoice.getNumber());
            row.put("sellDate", invoice.getSellDate());
            row.put("invoiceValueGross", invoice.getInvoiceValueGross());
            if (!accessLevel.equals("coordinator")) {
                row.put("coordinator.name", invoice.getCoordinator().getName());
            }
            row.put("contractor.name", invoice.getContractor().getName());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, exportConditions.getHeadRows(), rows, response);
    }

    @Override
    public void exportPlanPositionInvoicesPositionsToXlsx(final ExportType exportType, final Long positionId, final ArrayList<ExcelHeadRow> headRow, final HttpServletResponse response, final CoordinatorPlan.PlanType planType) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();
        if (planType == null) {
            this.getInvoicesByInstitutionPlanPositions(positionId).stream().sorted(Comparator.comparing(InvoiceInstitutionPositionsResponse::getInvoiceSellDate)).forEach(invoicesInstitutionPosition -> {
                Map<String, Object> row = new HashMap<>();
                row.put("invoiceNumber", invoicesInstitutionPosition.getInvoiceNumber());
                row.put("coordinatorName", invoicesInstitutionPosition.getCoordinatorName());
                row.put("invoiceSellDate", invoicesInstitutionPosition.getInvoiceSellDate());
                row.put("invoiceContractorName", invoicesInstitutionPosition.getInvoiceContractorName());
                row.put("name.content", invoicesInstitutionPosition.getName().getContent());
                row.put("amountNet", invoicesInstitutionPosition.getAmountNet());
                row.put("amountGross", invoicesInstitutionPosition.getAmountGross());
                row.put("amountOptionNet", invoicesInstitutionPosition.getAmountOptionNet());
                row.put("amountOptionGross", invoicesInstitutionPosition.getAmountOptionGross());
                rows.add(row);
            });

        } else {
            getInvoicesPositionsByCoordinatorPlanPosition(planType, positionId).forEach(invoicePositionPayload -> {
                Map<String, Object> row = new HashMap<>();
                row.put("invoiceNumber", invoicePositionPayload.getInvoiceNumber());
                row.put("coordinatorName", Utils.getCurrentUser().getOrganizationUnit().getName());
                row.put("invoiceSellDate", invoicePositionPayload.getInvoiceSellDate());
                row.put("invoiceContractorName", invoicePositionPayload.getInvoiceContractorName());
                row.put("name.content", invoicePositionPayload.getName().getContent());
                row.put("amountNet", invoicePositionPayload.getAmountNet());
                row.put("amountGross", invoicePositionPayload.getAmountGross());
                row.put("amountOptionNet", invoicePositionPayload.getAmountOptionNet());
                row.put("amountOptionGross", invoicePositionPayload.getAmountOptionGross());
                rows.add(row);
            });
        }

        Utils.generateExcelExport(exportType, headRow, rows, response);
    }


    private void updateInvoiceValues(final Invoice invoice, final InvoicePosition invoicePosition, final String action) {
        BigDecimal invoiceValueNet = new BigDecimal(0);
        BigDecimal invoiceValueGross = new BigDecimal(0);
        BigDecimal optionValueNet = new BigDecimal(0);
        BigDecimal optionValueGross = new BigDecimal(0);
        Set<InvoicePosition> invoicePositions;

        invoicePositions = invoice.getInvoicePositions().stream().filter(position -> !position.getId().equals(invoicePosition.getId())).collect(Collectors.toSet());
        if (!action.equals("delete")) {
            invoicePositions.add(invoicePosition);
        }

        for (InvoicePosition position : invoicePositions) {
            invoiceValueNet = invoiceValueNet.add(position.getAmountNet());
            invoiceValueGross = invoiceValueGross.add(position.getAmountGross());
            /* Setup invoice option value */
            if (position.getOptionValueGross() != null && position.getOptionValueGross().signum() > 0) {
                optionValueNet = optionValueNet.add(position.getOptionValueNet());
                optionValueGross = optionValueGross.add(position.getOptionValueGross());
            }
        }

        invoice.setInvoiceValueNet(invoiceValueNet);
        invoice.setInvoiceValueGross(invoiceValueGross);
        invoice.setOptionValueNet(optionValueNet.compareTo(BigDecimal.ZERO) > 0 ? optionValueNet : null);
        invoice.setOptionValueGross(optionValueGross.compareTo(BigDecimal.ZERO) > 0 ? optionValueGross : null);

        if (invoice.getContract() != null) {
            Map<String, BigDecimal> updatedContractValues = this.updateContractValues(invoice, "add");

            invoice.getContract().setInvoicesValueNet(updatedContractValues.get("contractInvoicesValueNet"));
            invoice.getContract().setInvoicesValueGross(updatedContractValues.get("contractInvoicesValueGross"));
            invoice.getContract().setRealizedOptionValueNet(updatedContractValues.get("contractRealizedInvoicesOptionValueNet"));
            invoice.getContract().setRealizedOptionValueGross(updatedContractValues.get("contractRealizedInvoicesOptionValueGross"));
        }
    }

    private void setCoordinatorPlanPositionAmountRealizedAdd(InvoicePosition invoicePosition) {
        Map<String, BigDecimal> updatedValues = this.updateCoordinatorPlanPositionRealizedValues(invoicePosition.getCoordinatorPlanPosition(), invoicePosition, "add");
        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

        this.updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedAdd(invoicePosition.getCoordinatorPlanPosition(), invoicePosition);
    }

    private void setCoordinatorPlanPositionAmountRealizedSubtract(InvoicePosition invoicePosition) {
        Map<String, BigDecimal> updatedValues = this.updateCoordinatorPlanPositionRealizedValues(invoicePosition.getCoordinatorPlanPosition(), invoicePosition, "subtract");
        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

        this.updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedSubtract(invoicePosition.getCoordinatorPlanPosition(), invoicePosition);
    }

    private void setInstitutionPlanPositionAmountRealizedAdd(final InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition, final InvoicePosition invoicePosition) {
        Map<String, BigDecimal> updatedValues = updateInstitutionPlanPositionRealizedValues(institutionCoordinatorPlanPosition.getInstitutionPlanPosition(), invoicePosition, "add");
        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

        if (Objects.equals(InstitutionPlan.InstitutionPlanStatus.ZA, institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getPlan().getStatus())) {
            institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getPlan().setStatus(InstitutionPlan.InstitutionPlanStatus.RE);
        }

        this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(institutionCoordinatorPlanPosition.getInstitutionPlanPosition(), invoicePosition);
    }

    private void setInstitutionPlanPositionAmountRealizedSubtract(final InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition, final InvoicePosition invoicePosition) {
        Map<String, BigDecimal> updatedValues = updateInstitutionPlanPositionRealizedValues(institutionCoordinatorPlanPosition.getInstitutionPlanPosition(), invoicePosition, "subtract");
        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

        this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(institutionCoordinatorPlanPosition.getInstitutionPlanPosition(), invoicePosition);
    }

    private void updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedAdd(final CoordinatorPlanPosition coordinatorPlanPosition, final InvoicePosition invoicePosition) {
        CoordinatorPlanPosition correctedPlanPosition = coordinatorPlanPosition.getPlan().getType().equals(CoordinatorPlan.PlanType.FIN) ?
                financialPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition) :
                investmentPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition);

        if (correctedPlanPosition != null) {
            Map<String, BigDecimal> updatedValues = this.updateCoordinatorPlanPositionRealizedValues(correctedPlanPosition, invoicePosition, "add");
            correctedPlanPosition.setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
            correctedPlanPosition.setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

            this.updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedAdd(correctedPlanPosition, invoicePosition);
        }
    }

    private void updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedSubtract(final CoordinatorPlanPosition coordinatorPlanPosition, final InvoicePosition invoicePosition) {

        /* Check if exist corrected plan position */
        CoordinatorPlanPosition correctedPlanPosition = coordinatorPlanPosition.getPlan().getType().equals(CoordinatorPlan.PlanType.FIN) ?
                financialPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition) :
                investmentPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition);

        if (correctedPlanPosition != null) {
            Map<String, BigDecimal> updatedValues = this.updateCoordinatorPlanPositionRealizedValues(correctedPlanPosition, invoicePosition, "subtract");
            correctedPlanPosition.setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
            correctedPlanPosition.setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

            this.updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedSubtract(correctedPlanPosition, invoicePosition);
        }
    }

    private void updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(final InstitutionPlanPosition institutionPlanPosition, final InvoicePosition invoicePosition) {
        InstitutionPlanPosition correctionInstitutionPlanPosition = institutionPlanPositionRepository.findByCorrectionPlanPosition(institutionPlanPosition);

        if (correctionInstitutionPlanPosition != null) {
            Map<String, BigDecimal> updatedValues = updateInstitutionPlanPositionRealizedValues(correctionInstitutionPlanPosition, invoicePosition, "add");
            correctionInstitutionPlanPosition.setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
            correctionInstitutionPlanPosition.setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

            this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(correctionInstitutionPlanPosition, invoicePosition);
        }
    }

    private void updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(final InstitutionPlanPosition institutionPlanPosition, final InvoicePosition invoicePosition) {
        InstitutionPlanPosition correctionInstitutionPlanPosition = institutionPlanPositionRepository.findByCorrectionPlanPosition(institutionPlanPosition);

        if (correctionInstitutionPlanPosition != null) {
            Map<String, BigDecimal> updatedValues = updateInstitutionPlanPositionRealizedValues(correctionInstitutionPlanPosition, invoicePosition, "subtract");
            correctionInstitutionPlanPosition.setAmountRealizedNet(updatedValues.get("planPositionAmountRealizedNet"));
            correctionInstitutionPlanPosition.setAmountRealizedGross(updatedValues.get("planPositionAmountRealizedGross"));

            this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(correctionInstitutionPlanPosition, invoicePosition);
        }
    }

    private void findCorrectedPlanPosition(final CoordinatorPlanPosition planPosition, final List<CoordinatorPlanPosition> planPositions) {
        if (planPosition.getCorrectionPlanPosition() != null) {
            CoordinatorPlanPosition correctedPlanPosition = planPosition.getPlan().getType().equals(CoordinatorPlan.PlanType.FIN) ?
                    financialPositionRepository.findById(planPosition.getCorrectionPlanPosition().getId()).orElse(null) :
                    investmentPositionRepository.findById(planPosition.getCorrectionPlanPosition().getId()).orElse(null);

            if (correctedPlanPosition != null) {
                planPositions.add(correctedPlanPosition);
                if (correctedPlanPosition.getCorrectionPlanPosition() != null) {
                    planPositions.add(correctedPlanPosition.getCorrectionPlanPosition());
                    this.findCorrectedPlanPosition(correctedPlanPosition.getCorrectionPlanPosition(), planPositions);
                }
            }
        }
    }

    private Map<String, BigDecimal> updateCoordinatorPlanPositionRealizedValues(final CoordinatorPlanPosition coordinatorPlanPosition, final InvoicePosition invoicePosition, final String action) {
        Map<String, BigDecimal> updatedPlanPositionValues = new HashMap<>();
        BigDecimal planPositionInvoicesPositionsValueNet = new BigDecimal(0);
        BigDecimal planPositionInvoicesPositionsValueGross = new BigDecimal(0);
        BigDecimal planPositionInvoicesPositionsOptionsValueNet = new BigDecimal(0);
        BigDecimal planPositionInvoicesPositionsOptionsValueGross = new BigDecimal(0);

        Set<InvoicePositionPayload> positionInvoices = this.getInvoicesPositionsByCoordinatorPlanPosition(
                coordinatorPlanPosition.getPlan().getType(), coordinatorPlanPosition.getId()
        ).stream().filter(position -> !position.getId().equals(invoicePosition.getId())).collect(Collectors.toSet());

        for (InvoicePositionPayload position : positionInvoices) {
            planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(position.getAmountNet());
            planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(position.getAmountGross());
            /* Setup invoice option value */
            if (position.getAmountOptionGross() != null && position.getAmountOptionGross().signum() > 0) {
                planPositionInvoicesPositionsOptionsValueNet = planPositionInvoicesPositionsOptionsValueNet.add(position.getAmountOptionNet());
                planPositionInvoicesPositionsOptionsValueGross = planPositionInvoicesPositionsOptionsValueGross.add(position.getAmountOptionGross());
            }
        }

        planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(planPositionInvoicesPositionsOptionsValueNet);
        planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(planPositionInvoicesPositionsOptionsValueGross);

        if (action.equals("add")) {
            if (invoicePosition.getOptionValueGross() != null) {
                planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(invoicePosition.getAmountNet().add(invoicePosition.getOptionValueNet()));
                planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(invoicePosition.getAmountGross().add(invoicePosition.getOptionValueGross()));

            } else {
                planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(invoicePosition.getAmountNet());
                planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(invoicePosition.getAmountGross());
            }
        }

        updatedPlanPositionValues.put("planPositionAmountRealizedNet", planPositionInvoicesPositionsValueNet);
        updatedPlanPositionValues.put("planPositionAmountRealizedGross", planPositionInvoicesPositionsValueGross);

        return updatedPlanPositionValues;
    }

    private Map<String, BigDecimal> updateInstitutionPlanPositionRealizedValues(final InstitutionPlanPosition institutionPlanPosition, final InvoicePosition invoicePosition, final String action) {
        Map<String, BigDecimal> updatedPlanPositionValues = new HashMap<>();
        BigDecimal planPositionInvoicesPositionsValueNet = new BigDecimal(0);
        BigDecimal planPositionInvoicesPositionsValueGross = new BigDecimal(0);
        BigDecimal planPositionInvoicesPositionsOptionsValueNet = new BigDecimal(0);
        BigDecimal planPositionInvoicesPositionsOptionsValueGross = new BigDecimal(0);

        Set<InvoiceInstitutionPositionsResponse> institutionPlanPositionInvoicesPositions = this.getInvoicesByInstitutionPlanPositions(
                institutionPlanPosition.getId()).stream().filter(position -> !position.getId().equals(invoicePosition.getId())).collect(Collectors.toSet());


        for (InvoiceInstitutionPositionsResponse position : institutionPlanPositionInvoicesPositions) {
            planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(position.getAmountNet());
            planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(position.getAmountGross());
            /* Setup invoice option value */
            if (position.getAmountOptionGross() != null && position.getAmountOptionGross().signum() > 0) {
                planPositionInvoicesPositionsOptionsValueNet = planPositionInvoicesPositionsOptionsValueNet.add(position.getAmountOptionNet());
                planPositionInvoicesPositionsOptionsValueGross = planPositionInvoicesPositionsOptionsValueGross.add(position.getAmountOptionGross());
            }
        }

        planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(planPositionInvoicesPositionsOptionsValueNet);
        planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(planPositionInvoicesPositionsOptionsValueGross);

        if (action.equals("add")) {
            if (invoicePosition.getOptionValueGross() != null) {
                planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(invoicePosition.getAmountNet().add(invoicePosition.getOptionValueNet()));
                planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(invoicePosition.getAmountGross().add(invoicePosition.getOptionValueGross()));

            } else {
                planPositionInvoicesPositionsValueNet = planPositionInvoicesPositionsValueNet.add(invoicePosition.getAmountNet());
                planPositionInvoicesPositionsValueGross = planPositionInvoicesPositionsValueGross.add(invoicePosition.getAmountGross());
            }
        }

        updatedPlanPositionValues.put("planPositionAmountRealizedNet", planPositionInvoicesPositionsValueNet);
        updatedPlanPositionValues.put("planPositionAmountRealizedGross", planPositionInvoicesPositionsValueGross);

        return updatedPlanPositionValues;
    }


    private Map<String, BigDecimal> updateContractValues(final Invoice invoice, final String action) {
        Map<String, BigDecimal> updatedContractValues = new HashMap<>();
        BigDecimal contractInvoicesValueNet = new BigDecimal(0);
        BigDecimal contractInvoicesValueGross = new BigDecimal(0);
        BigDecimal contractInvoicesOptionValueNet = new BigDecimal(0);
        BigDecimal contractInvoicesOptionValueGross = new BigDecimal(0);
        Set<Invoice> contractInvoices = contractService.getInvoices(invoice.getContract().getId())
                .stream().filter(inv -> !inv.getId().equals(invoice.getId()) && inv.getInvoiceValueGross() != null).collect(Collectors.toSet());

        if (!contractInvoices.isEmpty()) {
            for (Invoice crtInvoice : contractInvoices) {
                contractInvoicesValueNet = contractInvoicesValueNet.add(crtInvoice.getInvoiceValueNet());
                contractInvoicesValueGross = contractInvoicesValueGross.add(crtInvoice.getInvoiceValueGross());
                if (crtInvoice.getOptionValueNet() != null) {
                    contractInvoicesOptionValueNet = contractInvoicesOptionValueNet.add(crtInvoice.getOptionValueNet());
                    contractInvoicesOptionValueGross = contractInvoicesOptionValueGross.add(crtInvoice.getOptionValueGross());
                }
            }
        }

        if (action.equals("add")) {
            contractInvoicesValueNet = contractInvoicesValueNet.add(invoice.getInvoiceValueNet());
            contractInvoicesValueGross = contractInvoicesValueGross.add(invoice.getInvoiceValueGross());

            if (invoice.getOptionValueGross() != null) {
                contractInvoicesOptionValueNet = contractInvoicesOptionValueNet.add(invoice.getOptionValueNet());
                contractInvoicesOptionValueGross = contractInvoicesOptionValueGross.add(invoice.getOptionValueGross());
            }
        }
        updatedContractValues.put("contractInvoicesValueNet", contractInvoicesValueNet);
        updatedContractValues.put("contractInvoicesValueGross", contractInvoicesValueGross);
        updatedContractValues.put("contractRealizedInvoicesOptionValueNet", contractInvoicesOptionValueNet);
        updatedContractValues.put("contractRealizedInvoicesOptionValueGross", contractInvoicesOptionValueGross);

        return updatedContractValues;
    }
}
