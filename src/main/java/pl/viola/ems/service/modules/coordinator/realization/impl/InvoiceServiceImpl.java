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
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.InvoicePosition;
import pl.viola.ems.model.modules.coordinator.realization.invoice.repository.InvoicePositionRepository;
import pl.viola.ems.model.modules.coordinator.realization.invoice.repository.InvoiceRepository;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.payload.modules.accountant.institution.plans.InvoiceInstitutionPositionsResponse;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPlanPosition;
import pl.viola.ems.payload.modules.coordinator.application.realization.invoice.InvoicePayload;
import pl.viola.ems.payload.modules.coordinator.application.realization.invoice.InvoicePositionPayload;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    OrganizationUnitService organizationUnitService;

    @Autowired
    InvoiceRepository invoiceRepository;

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

                    this.setInstitutionPlanPositionAmountRealizedSubtract(institutionCoordinatorPlanPosition);
                }
            });
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
                    invoicePosition.getAmountGross()
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

        } else if (action.equals("edit")) {
            invoice.getInvoicePositions().stream().filter(position -> position.getId().equals(invoicePosition.getId()))
                    .findFirst().ifPresent(this::setCoordinatorPlanPositionAmountRealizedSubtract);

            this.setCoordinatorPlanPositionAmountRealizedAdd(invoicePosition);
        }

        if (invoicePosition.getPositionIncludedPlanType().equals(CoordinatorPlan.PlanType.FIN)) {
            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPositionIn(Collections.singletonList(invoicePosition.getCoordinatorPlanPosition()))
                    .stream().findFirst().orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));
            if (action.equals("add")) {
                this.setInstitutionPlanPositionAmountRealizedAdd(institutionCoordinatorPlanPosition);
            } else if (action.equals("edit")) {

                invoice.getInvoicePositions().stream().filter(position -> position.getId().equals(invoicePosition.getId()))
                        .findFirst().ifPresent(tmp -> this.setInstitutionPlanPositionAmountRealizedSubtract(institutionCoordinatorPlanPosition));

                this.setInstitutionPlanPositionAmountRealizedAdd(institutionCoordinatorPlanPosition);
            }
        }
        return invoicePositionRepository.save(invoicePosition);
    }

    @Transactional
    @Override
    public String deleteInvoicePosition(final Long invoicePositionId) {
        InvoicePosition invoicePosition = invoicePositionRepository.findById(invoicePositionId)
                .orElseThrow(() -> new AppException("Coordinator.invoice.positionNotExists", HttpStatus.BAD_REQUEST));

        this.setCoordinatorPlanPositionAmountRealizedSubtract(invoicePosition);

        if (invoicePosition.getPositionIncludedPlanType().equals(CoordinatorPlan.PlanType.FIN)) {
            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPositionIn(Collections.singletonList(invoicePosition.getCoordinatorPlanPosition()))
                    .stream().findFirst().orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));

            this.setInstitutionPlanPositionAmountRealizedSubtract(institutionCoordinatorPlanPosition);
        }
        invoicePositionRepository.deleteById(invoicePosition.getId());

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
                        invoicePosition.getAmountGross()
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
                rows.add(row);
            });
        }

        Utils.generateExcelExport(exportType, headRow, rows, response);
    }


    private void setCoordinatorPlanPositionAmountRealizedAdd(InvoicePosition invoicePosition) {
        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedNet(
                invoicePosition.getCoordinatorPlanPosition().getAmountRealizedNet() != null ?
                        invoicePosition.getCoordinatorPlanPosition().getAmountRealizedNet().add(invoicePosition.getAmountNet()) :
                        invoicePosition.getAmountNet()
        );

        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedGross(
                invoicePosition.getCoordinatorPlanPosition().getAmountRealizedGross() != null ?
                        invoicePosition.getCoordinatorPlanPosition().getAmountRealizedGross().add(invoicePosition.getAmountGross()) :
                        invoicePosition.getAmountGross()
        );

        this.updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedAdd(invoicePosition.getCoordinatorPlanPosition(), invoicePosition);

    }

    private void setCoordinatorPlanPositionAmountRealizedSubtract(InvoicePosition invoicePosition) {
        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedNet(
                invoicePosition.getCoordinatorPlanPosition().getAmountRealizedNet().subtract(invoicePosition.getAmountNet())
        );

        invoicePosition.getCoordinatorPlanPosition().setAmountRealizedGross(
                invoicePosition.getCoordinatorPlanPosition().getAmountRealizedGross().subtract(invoicePosition.getAmountGross())
        );

        this.updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedSubtract(invoicePosition.getCoordinatorPlanPosition(), invoicePosition);
    }

    private void setInstitutionPlanPositionAmountRealizedAdd(final InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition) {
        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedNet(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedGross(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)

        );

        if (Objects.equals(InstitutionPlan.InstitutionPlanStatus.ZA, institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getPlan().getStatus())) {
            institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getPlan().setStatus(InstitutionPlan.InstitutionPlanStatus.RE);
        }

        this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(institutionCoordinatorPlanPosition.getInstitutionPlanPosition());
    }

    private void setInstitutionPlanPositionAmountRealizedSubtract(final InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition) {

        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedNet(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)

        );

        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedGross(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(institutionCoordinatorPlanPosition.getInstitutionPlanPosition());
    }

    private void updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedAdd(final CoordinatorPlanPosition coordinatorPlanPosition, final InvoicePosition invoicePosition) {


        CoordinatorPlanPosition correctedPlanPosition = coordinatorPlanPosition.getPlan().getType().equals(CoordinatorPlan.PlanType.FIN) ?
                financialPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition) :
                investmentPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition);

        if (correctedPlanPosition != null) {
            correctedPlanPosition.setAmountRealizedNet(
                    correctedPlanPosition.getAmountRealizedNet() != null ?
                            correctedPlanPosition.getAmountRealizedNet().add(invoicePosition.getAmountNet()) :
                            invoicePosition.getAmountNet()
            );

            correctedPlanPosition.setAmountRealizedGross(
                    correctedPlanPosition.getAmountRealizedGross() != null ?
                            correctedPlanPosition.getAmountRealizedGross().add(invoicePosition.getAmountGross()) :
                            invoicePosition.getAmountGross()
            );

            updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedAdd(correctedPlanPosition, invoicePosition);
        }
    }

    private void updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedSubtract(final CoordinatorPlanPosition coordinatorPlanPosition, final InvoicePosition invoicePosition) {

        CoordinatorPlanPosition correctedPlanPosition = coordinatorPlanPosition.getPlan().getType().equals(CoordinatorPlan.PlanType.FIN) ?
                financialPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition) :
                investmentPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition);

        if (correctedPlanPosition != null) {
            correctedPlanPosition.setAmountRealizedNet(
                    correctedPlanPosition.getAmountRealizedNet() != null ?
                            correctedPlanPosition.getAmountRealizedNet().subtract(invoicePosition.getAmountNet()) :
                            invoicePosition.getAmountNet()
            );

            correctedPlanPosition.setAmountRealizedGross(
                    correctedPlanPosition.getAmountRealizedGross() != null ?
                            correctedPlanPosition.getAmountRealizedGross().subtract(invoicePosition.getAmountGross()) :
                            invoicePosition.getAmountGross()
            );

            updateValueCorrectedCoordinatorPlanPositionOnAmountRealizedSubtract(correctedPlanPosition, invoicePosition);
        }
    }

    private void updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(final InstitutionPlanPosition institutionPlanPosition) {

        InstitutionPlanPosition correctionInstitutionPlanPosition = institutionPlanPositionRepository.findByCorrectionPlanPosition(institutionPlanPosition);

        if (correctionInstitutionPlanPosition != null) {
            correctionInstitutionPlanPosition.setAmountRealizedNet(
                    correctionInstitutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)

            );

            correctionInstitutionPlanPosition.setAmountRealizedGross(
                    correctionInstitutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)

            );

            updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(correctionInstitutionPlanPosition);
        }
    }

    private void updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(final InstitutionPlanPosition institutionPlanPosition) {

        InstitutionPlanPosition correctionInstitutionPlanPosition = institutionPlanPositionRepository.findByCorrectionPlanPosition(institutionPlanPosition);

        if (correctionInstitutionPlanPosition != null) {
            correctionInstitutionPlanPosition.setAmountRealizedNet(
                    correctionInstitutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)

            );

            correctionInstitutionPlanPosition.setAmountRealizedGross(
                    correctionInstitutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)

            );

            updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(correctionInstitutionPlanPosition);
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

}
