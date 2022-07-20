package pl.viola.ems.service.modules.coordinator.realization.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
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
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;
import pl.viola.ems.utils.Utils;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

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
    public Set<Invoice> getInvoices() {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        return invoiceRepository.findByCoordinatorIn(coordinators);
    }

    @Override
    public List<Invoice> getInvoicesByYear(final int year) {
        if (year != 0) {
            LocalDate curYear = LocalDate.of(year, Month.JANUARY, 1);
            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
            return invoiceRepository.findBySellDateBetween(firstDay, lastDay);
        } else {
            return invoiceRepository.findAll();
        }
    }

    @Transactional
    @Override
    public Invoice saveInvoice(final Invoice invoice, final String action) {
        if (action.equals("add")) {
            invoice.setCoordinator(Utils.getCurrentUser().getOrganizationUnit());
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
        invoiceRepository.deleteById(invoice.getId());
        return messageSource.getMessage("Coordinator.invoice.deleteMsg", null, Locale.getDefault());
    }

    @Override
    public List<InvoicePosition> getInvoicePositions(final Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new AppException("Coordinator.invoice.notFound", HttpStatus.NOT_FOUND));

        return new ArrayList<>(invoice.getInvoicePositions());
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
                    .stream().filter(institutionCoordinatorPlanPosition1 -> !institutionCoordinatorPlanPosition1.getInstitutionPlanPosition().getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.AA))
                    .findAny().orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));
            if (action.equals("add")) {
                this.setInstitutionPlanPositionAmountRealizedAdd(institutionCoordinatorPlanPosition, invoicePosition);
            } else if (action.equals("edit")) {

                invoice.getInvoicePositions().stream().filter(position -> position.getId().equals(invoicePosition.getId()))
                        .findFirst().ifPresent(tmp -> this.setInstitutionPlanPositionAmountRealizedSubtract(institutionCoordinatorPlanPosition, tmp));

                this.setInstitutionPlanPositionAmountRealizedAdd(institutionCoordinatorPlanPosition, invoicePosition);
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
                    .stream().filter(institutionCoordinatorPlanPosition1 -> !institutionCoordinatorPlanPosition1.getInstitutionPlanPosition().getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.AA))
                    .findAny().orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));

            this.setInstitutionPlanPositionAmountRealizedSubtract(institutionCoordinatorPlanPosition, invoicePosition);
        }
        invoicePositionRepository.deleteById(invoicePosition.getId());

        return messageSource.getMessage("Coordinator.invoice.position.deleteMsg", null, Locale.getDefault());
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

    private void setInstitutionPlanPositionAmountRealizedAdd(final InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition, final InvoicePosition invoicePosition) {
        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedNet(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getAmountRealizedNet().add(invoicePosition.getAmountNet())
        );

        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedGross(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getAmountRealizedGross().add(invoicePosition.getAmountGross())
        );

        if (!Arrays.asList(InstitutionPlan.InstitutionPlanStatus.RE, InstitutionPlan.InstitutionPlanStatus.UT, InstitutionPlan.InstitutionPlanStatus.AA).contains(institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getPlan().getStatus())) {
            institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getPlan().setStatus(InstitutionPlan.InstitutionPlanStatus.RE);
        }

        this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(institutionCoordinatorPlanPosition.getInstitutionPlanPosition(), invoicePosition);
    }

    private void setInstitutionPlanPositionAmountRealizedSubtract(final InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition, final InvoicePosition invoicePosition) {

        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedNet(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getAmountRealizedNet().subtract(invoicePosition.getAmountNet())
        );

        institutionCoordinatorPlanPosition.getInstitutionPlanPosition().setAmountRealizedGross(
                institutionCoordinatorPlanPosition.getInstitutionPlanPosition().getAmountRealizedGross().subtract(invoicePosition.getAmountGross())
        );

        this.updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(institutionCoordinatorPlanPosition.getInstitutionPlanPosition(), invoicePosition);
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

    private void updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(final InstitutionPlanPosition institutionPlanPosition, final InvoicePosition invoicePosition) {

        InstitutionPlanPosition correctionInstitutionPlanPosition = institutionPlanPositionRepository.findByCorrectionPlanPosition(institutionPlanPosition);

        if (correctionInstitutionPlanPosition != null) {
            correctionInstitutionPlanPosition.setAmountRealizedNet(
                    correctionInstitutionPlanPosition.getAmountRealizedNet().add(invoicePosition.getAmountNet())
            );

            correctionInstitutionPlanPosition.setAmountRealizedGross(
                    correctionInstitutionPlanPosition.getAmountRealizedGross().add(invoicePosition.getAmountGross())
            );

            updateValueCorrectedInstitutionPlanPositionOnAmountRealizedAdd(correctionInstitutionPlanPosition, invoicePosition);
        }
    }

    private void updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(final InstitutionPlanPosition institutionPlanPosition, final InvoicePosition invoicePosition) {

        InstitutionPlanPosition correctionInstitutionPlanPosition = institutionPlanPositionRepository.findByCorrectionPlanPosition(institutionPlanPosition);

        if (correctionInstitutionPlanPosition != null) {
            correctionInstitutionPlanPosition.setAmountRealizedNet(
                    correctionInstitutionPlanPosition.getAmountRealizedNet().subtract(invoicePosition.getAmountNet())
            );

            correctionInstitutionPlanPosition.setAmountRealizedGross(
                    correctionInstitutionPlanPosition.getAmountRealizedGross().subtract(invoicePosition.getAmountGross())
            );

            updateValueCorrectedInstitutionPlanPositionOnAmountRealizedSubtract(correctionInstitutionPlanPosition, invoicePosition);
        }
    }

}
