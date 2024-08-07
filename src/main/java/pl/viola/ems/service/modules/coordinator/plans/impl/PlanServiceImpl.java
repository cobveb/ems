package pl.viola.ems.service.modules.coordinator.plans.impl;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.coordinatorPlan.ApprovePlanType;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.*;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanRepository;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanSubPositionRepository;
import pl.viola.ems.model.modules.coordinator.plans.repository.FundingSourceRepository;
import pl.viola.ems.payload.auth.UserSummary;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.accountant.CoordinatorPlanResponse;
import pl.viola.ems.service.common.JasperPrintService;
import pl.viola.ems.service.modules.accountant.institution.InstitutionPlanService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.service.modules.coordinator.realization.InvoiceService;
import pl.viola.ems.service.modules.publicProcurement.plans.institution.PublicInstitutionPlanService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.time.Year;
import java.util.*;

@Service
public class PlanServiceImpl implements PlanService {

    @Autowired
    OrganizationUnitService organizationUnitService;

    @Autowired
    CoordinatorPlanRepository coordinatorPlanRepository;

    @Autowired
    CoordinatorPlanPositionRepository<FinancialPosition> financialPositionRepository;

    @Autowired
    CoordinatorPlanPositionRepository<PublicProcurementPosition> publicProcurementPositionRepository;

    @Autowired
    CoordinatorPlanPositionRepository<InvestmentPosition> investmentPositionRepository;

    @Autowired
    CoordinatorPlanSubPositionRepository<FinancialSubPosition> financialSubPositionRepository;

    @Autowired
    CoordinatorPlanSubPositionRepository<PublicProcurementSubPosition> publicProcurementSubPositionRepository;

    @Autowired
    CoordinatorPlanSubPositionRepository<InvestmentSubPosition> investmentSubPositionRepository;

    @Autowired
    FundingSourceRepository fundingSourceRepository;

    @Autowired
    MessageSource messageSource;

    @Autowired
    JasperPrintService jasperPrintService;

    @Autowired
    InstitutionPlanService institutionPlanService;

    @Autowired
    PublicInstitutionPlanService publicInstitutionPlanService;

    @Autowired
    InvoiceService invoiceService;

    @Override
    public Set<CoordinatorPlan> findByCoordinator(final int year) {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        Set<CoordinatorPlan> plans;
        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        if (year == 0) {
            plans = coordinatorPlanRepository.findByCoordinatorInOrderByIdDesc(coordinators);
        } else {
            plans = coordinatorPlanRepository.findByYearAndCoordinatorInOrderByIdDesc(year, coordinators);
        }

        if (!plans.isEmpty()) {
            plans.forEach(this::setPlanAmountValues);
        }
        return plans;
    }

    @Override
    public <T extends CoordinatorPlanPosition> List<T> findPositionsByPlan(Long planId) {
        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));
        return plan.getType().name().equals("FIN") ?
                (List<T>) financialPositionRepository.findByPlan(plan) :
                plan.getType().name().equals("PZP") ?
                        (List<T>) publicProcurementPositionRepository.findByPlan(plan) :
                        (List<T>) investmentPositionRepository.findByPlan(plan);
    }

    @Override
    public <T extends CoordinatorPlanPosition> List<T> findPositionsByIdsAndPlanType(List<Long> positionIds, CoordinatorPlan.PlanType planType) {
        return planType.name().equals("FIN") ?
                (List<T>) financialPositionRepository.findByIdIn(positionIds) :
                (List<T>) investmentPositionRepository.findByIdIn(positionIds);
    }

    @Override
    public List<CoordinatorPlanPosition> getPlanPositionByYearAndPlanType(final Integer year, final CoordinatorPlan.PlanType planType) {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.RE
        );

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        CoordinatorPlan plan = coordinatorPlanRepository.findByYearAndTypeAndCoordinatorInAndStatusIn(year != null ? year : Year.now().getValue(), planType,
                coordinators, statuses);

        if (plan == null) {
            return new ArrayList<>();
        }

        return this.findPositionsByPlan(plan.getId());
    }

    @Override
    public Optional<PublicProcurementPosition> getPublicProcurementPositionById(Long positionId) {
        return publicProcurementPositionRepository.findById(positionId);
    }

    @Override
    public CoordinatorPlanResponse findPlanById(Long planId) {
        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        setPlanAmountValues(plan);

        return new CoordinatorPlanResponse(
                plan.getId(),
                plan.getYear(),
                plan.getStatus(),
                plan.getType(),
                plan.getCoordinator(),
                new UserSummary(plan.getSendUser().getId(), plan.getSendUser().getName(), plan.getSendUser().getSurname(), plan.getSendUser().getUsername(), plan.getSendUser().getOrganizationUnit().getRole()),
                plan.getPlanAcceptUser() == null ? null : new UserSummary(plan.getPlanAcceptUser().getId(), plan.getPlanAcceptUser().getName(), plan.getPlanAcceptUser().getSurname(), plan.getPlanAcceptUser().getUsername(), plan.getPlanAcceptUser().getOrganizationUnit().getRole()),
                plan.getDirectorAcceptUser() == null ? null : new UserSummary(plan.getDirectorAcceptUser().getId(), plan.getDirectorAcceptUser().getName(), plan.getDirectorAcceptUser().getSurname(), plan.getDirectorAcceptUser().getUsername(), plan.getDirectorAcceptUser().getOrganizationUnit().getRole()),
                plan.getChiefAcceptUser() == null ? null : new UserSummary(plan.getChiefAcceptUser().getId(), plan.getChiefAcceptUser().getName(), plan.getChiefAcceptUser().getSurname(), plan.getChiefAcceptUser().getUsername(), plan.getChiefAcceptUser().getOrganizationUnit().getRole()),
                plan.getPlanAmountRequestedNet(),
                plan.getPlanAmountRequestedGross(),
                plan.getPlanAmountAwardedNet(),
                plan.getPlanAmountAwardedGross(),
                plan.getPlanAmountRealizedNet(),
                plan.getPlanAmountRealizedGross(),
                plan.getPositions()
        );
    }

    @Transactional
    @Override
    public CoordinatorPlan savePlan(final CoordinatorPlan plan, final String action, final User principal) {
        if (action.equals("add")) {
            plan.setCoordinator(principal.getOrganizationUnit());
            plan.setCreateDate(new Date());
        }
        return coordinatorPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public CoordinatorPlan updatePlanStatus(final Long planId, final CoordinatorPlan.PlanStatus newStatus) {
        if (newStatus == null) {
            throw new AppException("Coordinator.plan.invalidStatus", HttpStatus.BAD_REQUEST);
        }

        User user = Utils.getCurrentUser();

        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));
        if (!plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
            if (!newStatus.equals(CoordinatorPlan.PlanStatus.RO)) {
                if (plan.getType().equals(CoordinatorPlan.PlanType.FIN) && plan.getCorrectionPlan() != null) {
                    /* If updated financial plan */
                    plan.getPositions().forEach(position -> {
                        if (newStatus.equals(CoordinatorPlan.PlanStatus.WY)) {
                            /* If send  */
                            if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.ZP)) {
                                position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZA);
                            } else if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR)) {
                                /* If position is corrected remove amount awarded */
                                position.setAmountAwardedNet(null);
                                position.setAmountAwardedGross(null);
                            }
                        } else {
                            /* If withdraw */
                            if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.ZA)) {
                                position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP);
                            }
                        }
                    });
                } else {
                    plan.getPositions().forEach(position -> position.setStatus(
                            newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? CoordinatorPlanPosition.PlanPositionStatus.WY : CoordinatorPlanPosition.PlanPositionStatus.ZP)
                    );
                }
                plan.setSendDate(newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? new Date() : null);
                plan.setSendUser(newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? user : null);
            } else {
                plan.setPlanAcceptUser(null);
            }
            plan.setStatus(newStatus);
        } else {
            /* Send investment plan by Coordinator */
            if (newStatus.equals(CoordinatorPlan.PlanStatus.WY) && plan.getStatus().equals(CoordinatorPlan.PlanStatus.ZP)) {
                plan.setSendDate(new Date());
                plan.setSendUser(user);
                plan.setStatus(newStatus);

                /* If send plan is an update setup correct positions statuses */
                if (plan.getCorrectionPlan() != null) {
                    /* If updated investment plan */
                    if (plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
                        plan.getPositions().forEach(position -> {
                            if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.ZP)) {
                                position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.UZ);
                            }
                        });
                    }
                } else {
                    /* Send plan is not an update */
                    plan.getPositions().forEach(position -> position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.WY));
                }
            } else if (newStatus.equals(CoordinatorPlan.PlanStatus.WY) && plan.getStatus().equals(CoordinatorPlan.PlanStatus.PK)) {
                /* Send by Coordinator after agreed plan */
                plan.setStatus(CoordinatorPlan.PlanStatus.UZ);
            } else if (newStatus.equals(CoordinatorPlan.PlanStatus.ZP) && plan.getStatus().equals(CoordinatorPlan.PlanStatus.WY)) {
                /* Withdraw plan by Coordinator */
                plan.setSendDate(null);
                plan.setSendUser(null);
                plan.setStatus(newStatus);

                /* If withdraw plan is an update setup correct positions statuses */
                if (plan.getCorrectionPlan() != null) {
                    /* If withdraw investment plan */
                    if (plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
                        plan.getPositions().forEach(position -> {
                            if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.UZ)) {
                                position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP);
                            }
                        });
                    }
                } else {
                    /* Withdraw plan is not an update */
                    plan.getPositions().forEach(position -> position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP));
                }
            } else if (newStatus.equals(CoordinatorPlan.PlanStatus.PK)) {
                /* Forward plan form Accountant to Coordinator */
                plan.setStatus(newStatus);
            } else if (newStatus.equals(CoordinatorPlan.PlanStatus.RO) && plan.getStatus().equals(CoordinatorPlan.PlanStatus.AK)) {
                /* Withdraw plan by Accountant */
                plan.setStatus(newStatus);
                plan.setPlanAcceptUser(null);
            }
        }

        //If current plan is update set update number
        if (plan.getCorrectionPlan() != null && newStatus.equals(CoordinatorPlan.PlanStatus.WY)) {
            plan.setUpdateNumber(plan.getCorrectionPlan().getUpdateNumber() != null ?
                    plan.getCorrectionPlan().getUpdateNumber() + 1 : 1);
        }
        coordinatorPlanRepository.save(plan);
        //If plan different that investment then update institution plan
        if (!plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
            //If it is not an update of the coordinator's plan, update the institution's plan
            if (plan.getCorrectionPlan() == null) {
                institutionPlanService.updateInstitutionPlan(plan, newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? "send" : "withdraw");
            }
        }
        return plan;
    }

    @Transactional
    @Override
    public String returnCoordinatorPlan(Long planId) {
        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        plan.setStatus(CoordinatorPlan.PlanStatus.ZP);
        plan.setSendUser(null);
        plan.setPlanAcceptUser(null);
        plan.setPublicAcceptUser(null);
        plan.setDirectorAcceptUser(null);
        plan.setEconomicAcceptUser(null);
        plan.setChiefAcceptUser(null);

        if (plan.getType().equals(CoordinatorPlan.PlanType.FIN)) {
            if (plan.getCorrectionPlan() == null) {
                /* If returned financial base plan  */
                plan.getPositions().forEach(position -> {
                    position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP);
                    position.setAmountAwardedNet(null);
                    position.setAmountAwardedGross(null);
                });
            } else {
                /* If returned financial plan is an update  */
                plan.getPositions().forEach(position -> {
                    if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR)) {
                        position.setAmountAwardedNet(null);
                        position.setAmountAwardedGross(null);
                    } else if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) {
                        position.setAmountAwardedNet(null);
                        position.setAmountAwardedGross(null);
                        position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.KR);
                    } else {
                        position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP);
                        if (position.getAmountRequestedNet().compareTo(position.getCorrectionPlanPosition().getAmountAwardedNet()) != 0) {
                            /* Setup amount requested value to amount awarded value from corrected plan position
                                if not setup on create update plan
                            */
                            position.setAmountRequestedNet(position.getAmountAwardedNet());
                            position.setAmountRequestedGross(position.getAmountAwardedGross());
                        }
                    }
                });

            }

        } else {
            plan.getPositions().forEach(position -> position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP));
        }

        coordinatorPlanRepository.save(plan);
        if (!plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
            // Update institution plan if returned plan is not an update
            if (plan.getCorrectionPlan() == null) {
                institutionPlanService.updateInstitutionPlan(plan, "return");
            }
        }
        return messageSource.getMessage("Coordinator.plan.returnMsg", null, Locale.getDefault());
    }

    @Override
    public void updateInferredPositionValue(final PublicProcurementPosition position) {
        publicProcurementPositionRepository.save(position);
    }

    @Transactional
    @Override
    public CoordinatorPlan approvePlan(final Long planId, final ApprovePlanType approvePlanType) {
        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        User user = Utils.getCurrentUser();

        switch (approvePlanType) {
            /* Accountant approve for investments public procurement and update plan allowed */
            case ACCOUNTANT:
                plan.setStatus(CoordinatorPlan.PlanStatus.AK);
                plan.setPlanAcceptUser(user);
                // if approve update plan
                if (plan.getCorrectionPlan() != null) {
                    plan.getPositions().forEach(position -> {
                        if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.WY))
                            position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZA);
                    });
                }
                break;
            case PUBLIC_PROCUREMENT:
                plan.setStatus(CoordinatorPlan.PlanStatus.AZ);
                plan.setPublicAcceptUser(user);
                break;
            case DIRECTOR:
                plan.setStatus(CoordinatorPlan.PlanStatus.AD);
                plan.setDirectorAcceptUser(user);
                if (!plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
                    //update institution plan if current coordinator plan is not update
                    if (plan.getCorrectionPlan() == null) {
                        institutionPlanService.updateInstitutionPlan(plan, "approveDirector");
                    }
                }
                return coordinatorPlanRepository.save(plan);
            case ECONOMIC:
                plan.setStatus(CoordinatorPlan.PlanStatus.AE);
                plan.setEconomicAcceptUser(user);
                if (!plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
                    if (plan.getCorrectionPlan() == null) {
                        institutionPlanService.updateInstitutionPlan(plan, "approveEconomic");
                    }
                }
                return coordinatorPlanRepository.save(plan);
            case CHIEF:
                if (plan.getType().equals(CoordinatorPlan.PlanType.FIN)) {
                    if (plan.getCorrectionPlan() == null) {
                        plan.getPositions().forEach(position -> position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZA));
                        plan.setStatus(CoordinatorPlan.PlanStatus.AN);
                        institutionPlanService.updateInstitutionPlan(plan, "approveChief");
                    } else {
                        /* Update institution plan on accept coordinator plan */
                        plan.setStatus(CoordinatorPlan.PlanStatus.ZA);
                        plan.setChiefAcceptUser(user);
                        institutionPlanService.correctInstitutionPlan(plan, "approveChief");
                    }
                } else {
                    plan.getPositions().forEach(position -> position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZA));
                    if (plan.getType().equals(CoordinatorPlan.PlanType.PZP) && plan.getCorrectionPlan() != null) {
                        plan.setStatus(CoordinatorPlan.PlanStatus.AN);
                        publicInstitutionPlanService.updateInstitutionPublicProcurementPlan(plan);
                    } else {
                        /* Accept investment and PZP not update plan */
                        plan.setStatus(CoordinatorPlan.PlanStatus.ZA);
                        if (plan.getType().equals(CoordinatorPlan.PlanType.PZP)) {
                            /*
                                Update status institution public procurement plan to ZA
                                if all coordinators plan are accepted
                            */
                            List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                                    CoordinatorPlan.PlanStatus.ZA,
                                    CoordinatorPlan.PlanStatus.RE,
                                    CoordinatorPlan.PlanStatus.ZR,
                                    CoordinatorPlan.PlanStatus.AA
                            );
                            if (coordinatorPlanRepository.findByInstitutionPlanAndStatusNotIn(plan.getInstitutionPlan(), statuses).isEmpty()) {
                                plan.getInstitutionPlan().setStatus(InstitutionPlan.InstitutionPlanStatus.ZA);
                            }
                        }
                    }
                    plan.setChiefAcceptUser(user);
                }
                return coordinatorPlanRepository.save(plan);
        }

        return setPlanAmountValues(coordinatorPlanRepository.save(plan));
    }

    @Transactional
    @Override
    public String deletePlan(Long planId) {
        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        //If the deleted plan is an update, restore the source plan
        if (plan.getCorrectionPlan() != null) {
            plan.getCorrectionPlan().setStatus(plan.getCorrectionPlan().getPlanAmountRealizedGross() == null ?
                    CoordinatorPlan.PlanStatus.ZA : CoordinatorPlan.PlanStatus.RE);
            plan.getCorrectionPlan().getPositions().forEach(position -> position.setStatus(position.getAmountRealizedGross() == null ? CoordinatorPlanPosition.PlanPositionStatus.ZA :
                    position.getAmountRealizedGross().equals(position.getAmountAwardedGross()) ?
                            CoordinatorPlanPosition.PlanPositionStatus.ZR : CoordinatorPlanPosition.PlanPositionStatus.RE
            ));
            coordinatorPlanRepository.save(plan.getCorrectionPlan());
        }
        coordinatorPlanRepository.deleteById(plan.getId());
        return messageSource.getMessage("Coordinator.plan.deleteMsg", null, Locale.getDefault());

    }

    @Transactional
    @Override
    public CoordinatorPlanPosition savePlanPosition(CoordinatorPlanPosition position, final String action) {
        //Set status position KR - correct if plan is INW or FIN and is an update
        if (Arrays.asList(CoordinatorPlan.PlanType.INW, CoordinatorPlan.PlanType.FIN).contains(position.getPlan().getType()) && position.getPlan().getCorrectionPlan() != null && !position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR)) {
            position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.KR);
        }
        if (!position.getSubPositions().isEmpty()) {
            position.getSubPositions().forEach(posi -> {
                posi.setPlanPosition(position);
                if (position.getPlan().getType().name().equals("INW")) {
                    if (!posi.getFundingSources().isEmpty()) {
                        posi.getFundingSources().forEach(fundingSource -> {
                            if (fundingSource.getSourceAmountGross() != null && fundingSource.getSourceExpensesPlanGross() != null) {
                                fundingSource.setSourceAmountNet(fundingSource.getSourceAmountGross().divide(position.getVat(), 2, RoundingMode.HALF_EVEN));
                                fundingSource.setSourceExpensesPlanNet(fundingSource.getSourceExpensesPlanGross().divide(position.getVat(), 2, RoundingMode.HALF_EVEN));
                            } else {
                                fundingSource.setSourceAmountNet(BigDecimal.ZERO);
                                fundingSource.setSourceAmountGross(BigDecimal.ZERO);
                                fundingSource.setSourceExpensesPlanNet(BigDecimal.ZERO);
                                fundingSource.setSourceExpensesPlanGross(BigDecimal.ZERO);
                            }
                            fundingSource.setCoordinatorPlanSubPosition(posi);
                        });
                    }
                }
            });
            //If submit investment position update founding source
            if (position.getPlan().getType().equals(CoordinatorPlan.PlanType.INW)) {
                final boolean[] isAgreed = {true};
                position.getPositionFundingSources().forEach(source -> source.setCoordinatorPlanPosition(position));
                if (position.getPlan().getStatus().equals(CoordinatorPlan.PlanStatus.PK)) {
                    // Coordinator agreed plan mode
                    position.getPositionFundingSources().forEach(positionSource -> {
                        final BigDecimal[] sumSourceAwardedGross = {BigDecimal.ZERO};
                        final BigDecimal[] sumSourceExpensesAwardedGross = {BigDecimal.ZERO};
                        position.getSubPositions().forEach(coordinatorPlanSubPosition -> coordinatorPlanSubPosition.getFundingSources().forEach(source -> {
                            if (source.getType().equals(positionSource.getType())) {
                                sumSourceAwardedGross[0] = sumSourceAwardedGross[0].add(source.getSourceAmountAwardedGross() != null ? source.getSourceAmountAwardedGross() : BigDecimal.ZERO);
                                sumSourceExpensesAwardedGross[0] = sumSourceExpensesAwardedGross[0].add(source.getSourceExpensesPlanAwardedGross() != null ? source.getSourceExpensesPlanAwardedGross() : BigDecimal.ZERO);
                            }
                        }));
                        if (!positionSource.getSourceAmountAwardedGross().equals(sumSourceAwardedGross[0]) || !positionSource.getSourceExpensesPlanAwardedGross().equals(sumSourceExpensesAwardedGross[0])) {
                            isAgreed[0] = false;
                        }
                    });
                    if (isAgreed[0]) {
                        position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.UZ);
                    } else {
                        position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
                    }
                } else {
                    List<FundingSource> positionFundingSources = new ArrayList<>();
                    final BigDecimal[] amountRequestedNet = {new BigDecimal("0")};
                    final BigDecimal[] amountRequestedGross = {new BigDecimal("0")};
                    position.getSubPositions().forEach(coordinatorPlanSubPosition -> coordinatorPlanSubPosition.getFundingSources().forEach(fundingSource -> {
                        // if not exist any position source create new
                        if (positionFundingSources.isEmpty()) {
                            FundingSource source = new FundingSource();
                            source.setType(fundingSource.getType());
                            source.setSourceAmountNet(fundingSource.getSourceAmountNet());
                            source.setSourceAmountGross(fundingSource.getSourceAmountGross());
                            source.setSourceExpensesPlanNet(fundingSource.getSourceExpensesPlanNet());
                            source.setSourceExpensesPlanGross(fundingSource.getSourceExpensesPlanGross());
                            source.setCoordinatorPlanPosition(position);
                            positionFundingSources.add(source);
                        } else {
                            FundingSource positionsSource = positionFundingSources.stream().filter(fsource -> fsource.getType().equals(fundingSource.getType())).findFirst().orElse(null);
                            //if exists position source but not on current type, then create new source
                            if (positionsSource == null) {
                                FundingSource source = new FundingSource();
                                source.setType(fundingSource.getType());
                                source.setSourceAmountNet(fundingSource.getSourceAmountNet());
                                source.setSourceAmountGross(fundingSource.getSourceAmountGross());
                                source.setSourceExpensesPlanNet(fundingSource.getSourceExpensesPlanNet());
                                source.setSourceExpensesPlanGross(fundingSource.getSourceExpensesPlanGross());
                                source.setCoordinatorPlanPosition(position);
                                positionFundingSources.add(source);
                            } else {
                                //if exist source on current type update amount
                                positionsSource.setSourceAmountNet(positionsSource.getSourceAmountNet().add(fundingSource.getSourceAmountNet()));
                                positionsSource.setSourceAmountGross(positionsSource.getSourceAmountGross().add(fundingSource.getSourceAmountGross()));
                                positionsSource.setSourceExpensesPlanNet(positionsSource.getSourceExpensesPlanNet().add(fundingSource.getSourceExpensesPlanNet()));
                                positionsSource.setSourceExpensesPlanGross(positionsSource.getSourceExpensesPlanGross().add(fundingSource.getSourceExpensesPlanGross()));
                            }
                        }
                        amountRequestedNet[0] = amountRequestedNet[0].add(fundingSource.getSourceExpensesPlanNet());
                        amountRequestedGross[0] = amountRequestedGross[0].add(fundingSource.getSourceExpensesPlanGross());
                    }));

                    fundingSourceRepository.deleteAll(position.getPositionFundingSources());
                    position.setPositionFundingSources(positionFundingSources);
                    position.setAmountRequestedNet(amountRequestedNet[0]);
                    position.setAmountRequestedGross(amountRequestedGross[0]);

                }
            }
        }

        return position.getPlan().getType().name().equals("FIN") ?
                financialPositionRepository.save((FinancialPosition) position) :
                position.getPlan().getType().name().equals("PZP") ?
                        publicProcurementPositionRepository.save((PublicProcurementPosition) position) :
                        investmentPositionRepository.save((InvestmentPosition) position);
    }

    @Transactional
    @Override
    public CoordinatorPlan updatePlanPositionsByAccountant(final List<FinancialPosition> positions, final Long planId) {
        CoordinatorPlan coordinatorPlan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        if (coordinatorPlan.getStatus().equals(CoordinatorPlan.PlanStatus.WY)) {
            coordinatorPlan.setStatus(CoordinatorPlan.PlanStatus.RO);
        }
        positions.forEach(position -> {
            position.setPlan(coordinatorPlan);
            position.getSubPositions().forEach(subPosition -> subPosition.setPlanPosition(position));
        });

        financialPositionRepository.saveAll(positions);

        setPlanAmountValues(coordinatorPlanRepository.save(coordinatorPlan));

        if (coordinatorPlan.getCorrectionPlan() == null) {
            /* Update institution plan position if current position plan is base plan */
            institutionPlanService.updateInstitutionPlanPositions(positions);
        }
        return coordinatorPlan;
    }

    @Override
    @Transactional
    public CoordinatorPlanPosition updateInvestmentPositionByAccountant(InvestmentPosition position, Long planId) {
        CoordinatorPlan coordinatorPlan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        if (investmentPositionRepository.existsById(position.getId())) {

            if (coordinatorPlan.getStatus().equals(CoordinatorPlan.PlanStatus.WY)) {
                coordinatorPlan.setStatus(CoordinatorPlan.PlanStatus.RO);
            } else if (coordinatorPlan.getStatus().equals(CoordinatorPlan.PlanStatus.RO) && position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.UZ)) {
                // Update position after withdraw plan by Accountant
                position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
            }

            if (position.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.WY)) {
                position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
            }
            position.setPlan(coordinatorPlan);
            position.getPositionFundingSources().forEach(source -> source.setCoordinatorPlanPosition(position));
            position.setAmountAwardedNet(position.getPositionFundingSources().stream().map(
                    FundingSource::getSourceAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            position.setAmountAwardedGross(position.getPositionFundingSources().stream().map(
                    FundingSource::getSourceAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));

            position.getSubPositions().forEach(subPosition -> {
                subPosition.setPlanPosition(position);
                subPosition.getFundingSources().forEach(source -> source.setCoordinatorPlanSubPosition(subPosition));
            });
            return investmentPositionRepository.save(position);

        } else {
            throw new AppException("Coordinator.plan.position.notFound", HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @Override
    public String deletePlanPosition(final Long planId, final Long planPositionId) {

        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        if (plan.getType().name().equals("FIN")) {
            FinancialPosition position = financialPositionRepository.findById(planPositionId)
                    .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));
            if (plan.getPositions().contains(position)) {
                financialPositionRepository.deleteById(planPositionId);
            } else {
                throw new AppException("Coordinator.plan.positionNotExistsInPlan", HttpStatus.BAD_REQUEST);
            }
        } else if (plan.getType().name().equals("PZP")) {
            if (plan.getPositions().contains(publicProcurementPositionRepository.findById(planPositionId)
                    .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)))) {
                publicProcurementPositionRepository.deleteById(planPositionId);
            } else {
                throw new AppException("Coordinator.plan.positionNotExistsInPlan", HttpStatus.BAD_REQUEST);
            }
        } else {
            if (plan.getPositions().contains(investmentPositionRepository.findById(planPositionId)
                    .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)))) {
                investmentPositionRepository.deleteById(planPositionId);
            } else {
                throw new AppException("Coordinator.plan.positionNotExistsInPlan", HttpStatus.BAD_REQUEST);
            }
        }

        return messageSource.getMessage("Coordinator.plan.position.deleteMsg", null, Locale.getDefault());
    }

    @Override
    public Set<CoordinatorPlan> getPlansByCoordinatorInAccountant(final int year) {
        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.WY,
                CoordinatorPlan.PlanStatus.AK,
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.AE,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.RO,
                CoordinatorPlan.PlanStatus.PK,
                CoordinatorPlan.PlanStatus.UZ,
                CoordinatorPlan.PlanStatus.AN,
                CoordinatorPlan.PlanStatus.RE,
                CoordinatorPlan.PlanStatus.ZR,
                CoordinatorPlan.PlanStatus.AA
        );

        Set<CoordinatorPlan> coordinatorPlans;
        if (year != 0) {
            coordinatorPlans = coordinatorPlanRepository.findByYearAndStatusInAndCorrectionPlanIsNullOrderByIdDesc(year, statuses);
        } else {
            coordinatorPlans = coordinatorPlanRepository.findByStatusInAndCorrectionPlanIsNullOrderByIdDesc(statuses);
        }

        coordinatorPlans = this.filterCoordinatorsPlanInAccountant(coordinatorPlans);


        if (!coordinatorPlans.isEmpty()) {
            coordinatorPlans.forEach(this::setPlanAmountValues);
        }
        return coordinatorPlans;
    }

    @Override
    public Set<CoordinatorPlan> getPlansByCoordinatorInPublicProcurement(final int year) {

        Set<CoordinatorPlan> coordinatorPlans;

        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.WY,
                CoordinatorPlan.PlanStatus.AZ,
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.AK,
                CoordinatorPlan.PlanStatus.AN,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.RE,
                CoordinatorPlan.PlanStatus.ZR,
                CoordinatorPlan.PlanStatus.AA
        );

        if (year == 0) {
            coordinatorPlans = coordinatorPlanRepository.findByStatusInAndTypeAndCorrectionPlanIsNullOrderByIdDesc(statuses, CoordinatorPlan.PlanType.PZP);
        } else {
            coordinatorPlans = coordinatorPlanRepository.findByYearAndStatusInAndTypeAndCorrectionPlanIsNullOrderByIdDesc(year, statuses, CoordinatorPlan.PlanType.PZP);
        }

        if (!coordinatorPlans.isEmpty()) {
            coordinatorPlans.forEach(this::setPlanAmountValues);
        }
        return coordinatorPlans;
    }

    @Override
    public Set<CoordinatorPlan> getCoordinatorsPlanUpdates(String accessLevel, CoordinatorPlan.PlanType plan, int year) {
        Set<CoordinatorPlan> coordinatorPlanUpdates = new HashSet<>();
        List<CoordinatorPlan.PlanStatus> statuses;
        switch (accessLevel) {
            case "public":
                statuses = Arrays.asList(
                        CoordinatorPlan.PlanStatus.WY,
                        CoordinatorPlan.PlanStatus.AZ,
                        CoordinatorPlan.PlanStatus.AD,
                        CoordinatorPlan.PlanStatus.AK,
                        CoordinatorPlan.PlanStatus.AN,
                        CoordinatorPlan.PlanStatus.ZA,
                        CoordinatorPlan.PlanStatus.RE,
                        CoordinatorPlan.PlanStatus.ZR,
                        CoordinatorPlan.PlanStatus.AA
                );
                if (year == 0) {
                    coordinatorPlanUpdates = coordinatorPlanRepository.findByStatusInAndTypeAndCorrectionPlanIsNullOrderByIdDesc(statuses, CoordinatorPlan.PlanType.PZP);
                } else {
                    coordinatorPlanUpdates = coordinatorPlanRepository.findByYearAndStatusInAndTypeInAndCorrectionPlanIsNotNullOrderByIdDesc(year, statuses, Collections.singletonList(CoordinatorPlan.PlanType.PZP));
                }
                break;
            case "accountant":
                statuses = Arrays.asList(
                        CoordinatorPlan.PlanStatus.WY,
                        CoordinatorPlan.PlanStatus.PK,
                        CoordinatorPlan.PlanStatus.UZ,
                        CoordinatorPlan.PlanStatus.RO,
                        CoordinatorPlan.PlanStatus.AD,
                        CoordinatorPlan.PlanStatus.AE,
                        CoordinatorPlan.PlanStatus.AK,
                        CoordinatorPlan.PlanStatus.AN,
                        CoordinatorPlan.PlanStatus.ZA,
                        CoordinatorPlan.PlanStatus.RE,
                        CoordinatorPlan.PlanStatus.ZR,
                        CoordinatorPlan.PlanStatus.AA
                );
                if (year == 0) {
                    coordinatorPlanUpdates = coordinatorPlanRepository.findByStatusInAndTypeInAndCorrectionPlanIsNotNull(statuses, Arrays.asList(CoordinatorPlan.PlanType.PZP, CoordinatorPlan.PlanType.INW, CoordinatorPlan.PlanType.FIN));
                } else {
                    coordinatorPlanUpdates = coordinatorPlanRepository.findByYearAndStatusInAndTypeInAndCorrectionPlanIsNotNullOrderByIdDesc(year, statuses, Arrays.asList(CoordinatorPlan.PlanType.PZP, CoordinatorPlan.PlanType.INW, CoordinatorPlan.PlanType.FIN));
                }
                coordinatorPlanUpdates = this.filterCoordinatorsPlanInAccountant(coordinatorPlanUpdates);
                break;
        }
        if (!coordinatorPlanUpdates.isEmpty()) {
            coordinatorPlanUpdates.forEach(this::setPlanAmountValues);
        }
        return coordinatorPlanUpdates;
    }

    @Override
    public Set<CoordinatorPlan> getPlansCoordinatorInDirector(final boolean isPlanUpdates, final int year) {
        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.AZ,
                CoordinatorPlan.PlanStatus.AK,
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.AE,
                CoordinatorPlan.PlanStatus.AN,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.RE,
                CoordinatorPlan.PlanStatus.ZR,
                CoordinatorPlan.PlanStatus.AA
        );

        User user = Utils.getCurrentUser();
        Set<CoordinatorPlan> coordinatorPlans = new HashSet<>();

        if (user.getOrganizationUnit().getRole().equals(OrganizationUnit.Role.DIRECTOR)) {
            coordinatorPlans = isPlanUpdates ?
                    year == 0 ? coordinatorPlanRepository.findByStatusInAndCoordinatorInAndCorrectionPlanIsNotNullOrderByIdDesc(statuses, user.getOrganizationUnit().getDirectorCoordinators()) :
                            coordinatorPlanRepository.findByYearAndStatusInAndCoordinatorInAndCorrectionPlanIsNotNullOrderByIdDesc(year, statuses, user.getOrganizationUnit().getDirectorCoordinators())
                    :
                    year == 0 ? coordinatorPlanRepository.findByStatusInAndCoordinatorInAndCorrectionPlanIsNullOrderByIdDesc(statuses, user.getOrganizationUnit().getDirectorCoordinators()) :
                            coordinatorPlanRepository.findByYearAndStatusInAndCoordinatorInAndCorrectionPlanIsNullOrderByIdDesc(year, statuses, user.getOrganizationUnit().getDirectorCoordinators());
        } else if (user.getOrganizationUnit().getRole().equals(OrganizationUnit.Role.CHIEF) ||
                user.getOrganizationUnit().getRole().equals(OrganizationUnit.Role.ECONOMIC) ||
                user.getGroups().stream().anyMatch(group -> group.getCode().equals("admin"))) {
            coordinatorPlans = isPlanUpdates ?
                    year == 0 ? coordinatorPlanRepository.findByStatusInAndCorrectionPlanIsNotNullOrderByIdDesc(statuses) :
                            coordinatorPlanRepository.findByYearAndStatusInAndCorrectionPlanIsNotNullOrderByIdDesc(year, statuses)
                    :
                    year == 0 ? coordinatorPlanRepository.findByStatusInAndCorrectionPlanIsNullOrderByIdDesc(statuses) :
                            coordinatorPlanRepository.findByYearAndStatusInAndCorrectionPlanIsNullOrderByIdDesc(year, statuses);
        }

        if (!coordinatorPlans.isEmpty()) {
            coordinatorPlans.forEach(this::setPlanAmountValues);
        }
        return coordinatorPlans;
    }

    @Transactional
    @Override
    public CoordinatorPlanPosition deleteSubPosition(final CoordinatorPlanSubPosition subPosition, final Long positionId) {
        if (subPosition instanceof FinancialSubPosition) {
            Optional<FinancialPosition> position = financialPositionRepository.findById(positionId);
            position.orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)).removeSubPosition(subPosition);
            setPositionAmountRequestedValue(position.orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)));
            return financialPositionRepository.save(position.orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)));

        } else if (subPosition instanceof PublicProcurementSubPosition) {
            Optional<PublicProcurementPosition> position = publicProcurementPositionRepository.findById(positionId);
            position.orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)).removeSubPosition(subPosition);
            setPositionAmountRequestedValue(position.orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)));
            return publicProcurementPositionRepository.save(position.orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND)));
        } else {
            throw new AppException("Coordinator.plan.positionNotExistsInPlan", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public void exportPlansToExcel(final ExportType exportType, final String accessLevel,
                                   final ArrayList<ExcelHeadRow> headRow, final HttpServletResponse response) throws IOException {

        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        Set<CoordinatorPlan> plans;

        switch (accessLevel) {
            case "accountant":
                plans = getPlansByCoordinatorInAccountant(0);
                plans.forEach(plan -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", plan.getYear());
                    row.put("type.name", plan.getType().name());
                    row.put("coordinator.name", plan.getCoordinator().getName());
                    row.put("planAmountRequestedGross", plan.getPlanAmountRequestedGross());
                    row.put("planAmountAwardedGross", plan.getPlanAmountAwardedGross());
                    row.put("planAmountRealizedGross", plan.getPlanAmountRealizedGross());
                    row.put("status.name", plan.getStatus().name());
                    rows.add(row);
                });
                break;
            case "coordinator":
                plans = findByCoordinator(0);
                plans.forEach(plan -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", plan.getYear());
                    row.put("type.name", plan.getType().name());
                    row.put("status.name", plan.getStatus().name());
                    rows.add(row);
                });
                break;
            case "director":
                plans = getPlansCoordinatorInDirector(false, 0);
                plans.forEach(plan -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", plan.getYear());
                    row.put("type.name", plan.getType().name());
                    row.put("coordinator.name", plan.getCoordinator().getName());
                    row.put("planAmountRequestedNet", plan.getPlanAmountRequestedNet());
                    row.put("planAmountAwardedGross", plan.getPlanAmountAwardedGross());
                    row.put("status.name", plan.getStatus().name());
                    rows.add(row);
                });
                break;
            case "publicProcurement":
                plans = getPlansByCoordinatorInPublicProcurement(0);
                plans.forEach(plan -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", plan.getYear());
                    row.put("coordinator.name", plan.getCoordinator().getName());
                    row.put("planAmountRequestedNet", plan.getPlanAmountRequestedNet());
                    row.put("planAmountRealizedGross", plan.getPlanAmountRealizedNet());
                    row.put("status.name", plan.getStatus().name());
                    rows.add(row);
                });
                break;
        }

        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    @Override
    public void exportPlanPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException {

        ArrayList<Map<String, Object>> rows = new ArrayList<>();
        switch (planType) {
            case FIN:
                List<FinancialPosition> financialPositions = this.findPositionsByPlan(planId);
                financialPositions.forEach(position -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("costType.code", position.getCostType().getCode());
                    row.put("costType.name", position.getCostType().getName());
                    row.put("amountRequestedGross", position.getAmountRequestedGross());
                    row.put("amountAwardedGross", position.getAmountAwardedGross());
                    row.put("amountRealizedGross", position.getAmountRealizedGross());
                    row.put("isDescCor", position.getCoordinatorDescription() == null ? 0 : 1);
                    row.put("isDescMan", position.getManagementDescription() == null ? 0 : 1);

                    rows.add(row);
                });
                break;
            case PZP:
                List<PublicProcurementPosition> publicProcurementPositions = this.findPositionsByPlan(planId);
                publicProcurementPositions.forEach(position -> {

                    Map<String, Object> row = new HashMap<>();
                    row.put("assortmentGroup.name", position.getAssortmentGroup().getName());
                    row.put("orderType.name", position.getOrderType().name());
                    row.put("estimationType.name", position.getEstimationType().name());
                    row.put("amountRequestedNet", position.getAmountRequestedNet());
                    row.put("amountInferredNet", position.getAmountInferredNet());
                    row.put("initiationTerm", position.getInitiationTerm());
                    rows.add(row);
                });
                break;
            case INW:
                List<InvestmentPosition> investmentPositions = this.findPositionsByPlan(planId);
                investmentPositions.forEach(position -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("task", position.getTask());
                    row.put("taskPositionGross", position.getTaskPositionGross());
                    row.put("amountRequestedGross", position.getAmountRequestedGross());
                    row.put("expensesPositionAwardedGross", position.getExpensesPositionAwardedGross());
                    row.put("amountRealizedGross", position.getAmountRealizedGross());
                    rows.add(row);
                });
                break;
        }
        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    @Override
    public void exportPlanPositionsInvoicesPositionsToXlsx(final ExportType exportType, final CoordinatorPlan.PlanType planType, final Long positionId, final ArrayList<ExcelHeadRow> headRow, final HttpServletResponse response) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        invoiceService.getInvoicesPositionsByCoordinatorPlanPosition(planType, positionId).forEach(invoicePosition -> {
            Map<String, Object> row = new HashMap<>();
            row.put("invoiceNumber", invoicePosition.getInvoiceNumber());
            row.put("invoiceSellDate", invoicePosition.getInvoiceSellDate());
            row.put("invoiceContractorName", invoicePosition.getInvoiceContractorName());
            row.put("name.content", invoicePosition.getName().getContent());
            row.put("amountNet", invoicePosition.getAmountNet());
            row.put("amountGross", invoicePosition.getAmountGross());
            rows.add(row);
        });
        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    @Override
    public void exportSubPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long positionId,
                                          ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException {

        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        switch (planType) {
            case FIN:
                FinancialPosition financialPosition = financialPositionRepository.findById(positionId)
                        .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));
                List<FinancialSubPosition> financialSubPositions = financialSubPositionRepository.findByPlanPosition(financialPosition);
                financialSubPositions.forEach(position -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("name", position.getName());
                    row.put("quantity", position.getQuantity());
                    row.put("unitPrice", position.getUnitPrice());
                    row.put("amountNet", position.getAmountNet());
                    row.put("amountGross", position.getAmountGross());
                    rows.add(row);
                });
                break;
            case PZP:
                PublicProcurementPosition publicProcurementPosition = publicProcurementPositionRepository.findById(positionId)
                        .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));
                List<PublicProcurementSubPosition> publicProcurementPositions = publicProcurementSubPositionRepository.findByPlanPosition(publicProcurementPosition);
                publicProcurementPositions.forEach(position -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("name", position.getName());
                    row.put("amountNet", position.getAmountNet());
                    row.put("amountGross", position.getAmountGross());
                    rows.add(row);
                });
                break;
        }
        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    @Override
    public void exportPlanToJasper(final Long planId, final HttpServletResponse response) throws IOException, JRException, SQLException {
        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId).orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(planId, plan.getCorrectionPlan() == null ?
                "/jasper/prints/modules/coordinator/plans/coordinatorPlanReport.jrxml"
                : "/jasper/prints/modules/coordinator/plans/updateCoordinatorPlan.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }

    @Override
    @Transactional
    public CoordinatorPlan updatePlan(final Long planId) {

        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId).orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        CoordinatorPlan newPlan = new CoordinatorPlan();

        newPlan.setYear(plan.getYear());
        newPlan.setStatus(CoordinatorPlan.PlanStatus.ZP);
        newPlan.setType(plan.getType());
        newPlan.setCreateDate(new Date());
        newPlan.setCoordinator(plan.getCoordinator());
        newPlan.setCorrectionPlan(setPlanAmountValues(plan));
        coordinatorPlanRepository.save(newPlan);

        if (plan.getType().equals(CoordinatorPlan.PlanType.FIN)) {
            Set<FinancialPosition> newPlanPositions = new HashSet<>();
            plan.getPositions().forEach(planPosition -> {
                FinancialPosition newPosition = new FinancialPosition();
                newPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP);
                newPosition.setAmountRequestedNet(planPosition.getAmountAwardedNet());
                newPosition.setAmountRequestedGross(planPosition.getAmountAwardedGross());
                newPosition.setAmountAwardedNet(planPosition.getAmountAwardedNet());
                newPosition.setAmountAwardedGross(planPosition.getAmountAwardedGross());
                newPosition.setAmountRealizedNet(planPosition.getAmountRealizedNet());
                newPosition.setAmountRealizedGross(planPosition.getAmountRealizedGross());
                newPosition.setVat(planPosition.getVat());
                newPosition.setCostType(planPosition.getCostType());
                newPosition.setPlan(newPlan);
                newPosition.setCorrectionPlanPosition(planPosition);

                Set<CoordinatorPlanSubPosition> newSubPositions = new HashSet<>();

                if (!planPosition.getSubPositions().isEmpty()) {
                    planPosition.getSubPositions().forEach(subPosition -> {
                        FinancialSubPosition newSubPosition = new FinancialSubPosition();
                        newSubPosition.setName(subPosition.getName());
                        newSubPosition.setAmountNet(subPosition.getAmountNet());
                        newSubPosition.setAmountGross(subPosition.getAmountGross());
                        newSubPosition.setQuantity(subPosition.getQuantity());
                        newSubPosition.setUnit(subPosition.getUnit());
                        newSubPosition.setUnitPrice(subPosition.getUnitPrice());
                        newSubPosition.setPlanPosition(newPosition);
                        newSubPositions.add(newSubPosition);
                    });
                }
                newPosition.setSubPositions(newSubPositions);
                newPlanPositions.add(newPosition);

                // Set the status of the current position to updated
                planPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA);
            });

            financialPositionRepository.saveAll(newPlanPositions);

        } else if (plan.getType().equals(CoordinatorPlan.PlanType.PZP)) {
            Set<PublicProcurementPosition> newPlanPositions = new HashSet<>();
            plan.getPositions().forEach(planPosition -> {
                PublicProcurementPosition newPosition = new PublicProcurementPosition();
                newPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP);
                newPosition.setAmountRequestedNet(planPosition.getAmountRequestedNet());
                newPosition.setAmountRequestedGross(planPosition.getAmountRequestedGross());
                newPosition.setAmountAwardedNet(planPosition.getAmountAwardedNet());
                newPosition.setAmountAwardedGross(planPosition.getAmountAwardedGross());
                newPosition.setAmountRealizedNet(planPosition.getAmountRealizedNet());
                newPosition.setAmountRealizedGross(planPosition.getAmountRealizedGross());
                newPosition.setVat(planPosition.getVat());
                newPosition.setEstimationType(planPosition.getEstimationType());
                newPosition.setOrderType(planPosition.getOrderType());
                newPosition.setInitiationTerm(planPosition.getInitiationTerm());
                newPosition.setEuroExchangeRate(planPosition.getEuroExchangeRate());
                newPosition.setAmountRequestedEuroNet(planPosition.getAmountRequestedEuroNet());
                newPosition.setAmountInferredNet(planPosition.getAmountInferredNet());
                newPosition.setAmountInferredGross(planPosition.getAmountInferredGross());
                newPosition.setMode(planPosition.getMode());
                newPosition.setAssortmentGroup(planPosition.getAssortmentGroup());
                newPosition.setPlan(newPlan);
                newPosition.setCorrectionPlanPosition(planPosition);
                Set<CoordinatorPlanSubPosition> newSubPositions = new HashSet<>();

                if (!planPosition.getSubPositions().isEmpty()) {
                    planPosition.getSubPositions().forEach(subPosition -> {
                        PublicProcurementSubPosition newSubPosition = new PublicProcurementSubPosition();
                        newSubPosition.setName(subPosition.getName());
                        newSubPosition.setAmountNet(subPosition.getAmountNet());
                        newSubPosition.setAmountGross(subPosition.getAmountGross());
                        newSubPosition.setPlanPosition(newPosition);
                        newSubPositions.add(newSubPosition);
                    });
                }

                newPosition.setSubPositions(newSubPositions);
                newPlanPositions.add(newPosition);

                // Set the status of the current position to updated
                planPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA);
            });

            publicProcurementPositionRepository.saveAll(newPlanPositions);
        } else {
            Set<InvestmentPosition> newPlanPositions = new HashSet<>();
            plan.getPositions().forEach(planPosition -> {
                InvestmentPosition newPosition = new InvestmentPosition();
                newPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZP);
                newPosition.setAmountRequestedNet(planPosition.getAmountRequestedNet());
                newPosition.setAmountRequestedGross(planPosition.getAmountRequestedGross());
                newPosition.setAmountAwardedNet(planPosition.getAmountAwardedNet());
                newPosition.setAmountAwardedGross(planPosition.getAmountAwardedGross());
                newPosition.setAmountRealizedNet(planPosition.getAmountRealizedNet());
                newPosition.setAmountRealizedGross(planPosition.getAmountRealizedGross());
                newPosition.setVat(planPosition.getVat());
                newPosition.setName(planPosition.getName());
                newPosition.setTask(planPosition.getTask());
                newPosition.setApplication(planPosition.getApplication());
                newPosition.setSubstantiation(planPosition.getSubstantiation());
                newPosition.setCategory(planPosition.getCategory());
                newPosition.setRealizationDate(planPosition.getRealizationDate());
                //TODO: dodano właściwości Transistent sprawdzić czy będą potrzebne
                newPosition.setTaskPositionNet(planPosition.getTaskPositionNet());
                newPosition.setTaskPositionGross(planPosition.getTaskPositionGross());
                newPosition.setExpensesPositionAwardedNet(planPosition.getExpensesPositionAwardedNet());
                newPosition.setExpensesPositionAwardedGross(planPosition.getExpensesPositionAwardedGross());
                newPosition.setRealizedPositionNet(planPosition.getRealizedPositionNet());
                newPosition.setRealizedPositionGross(planPosition.getRealizedPositionGross());


//                //Copy position funding source if exist in to new position
                List<FundingSource> newPositionSources = new ArrayList<>();
                if (!planPosition.getPositionFundingSources().isEmpty()) {
                    planPosition.getPositionFundingSources().forEach(positionSource -> {
                        FundingSource newPositionSource = new FundingSource();
                        newPositionSource.setType(positionSource.getType());
                        newPositionSource.setSourceAmountNet(positionSource.getSourceAmountNet());
                        newPositionSource.setSourceAmountGross(positionSource.getSourceAmountGross());
                        newPositionSource.setSourceAmountAwardedNet(positionSource.getSourceAmountAwardedNet());
                        newPositionSource.setSourceAmountAwardedGross(positionSource.getSourceAmountAwardedGross());
                        newPositionSource.setSourceExpensesPlanNet(positionSource.getSourceExpensesPlanNet());
                        newPositionSource.setSourceExpensesPlanGross(positionSource.getSourceExpensesPlanGross());
                        newPositionSource.setSourceExpensesPlanAwardedNet(positionSource.getSourceExpensesPlanAwardedNet());
                        newPositionSource.setSourceExpensesPlanAwardedGross(positionSource.getSourceExpensesPlanAwardedGross());
                        newPositionSource.setSourceRealizedAmountNet(positionSource.getSourceRealizedAmountNet());
                        newPositionSource.setSourceRealizedAmountGross(positionSource.getSourceRealizedAmountGross());
                        newPositionSource.setCoordinatorPlanPosition(newPosition);
                        newPositionSources.add(newPositionSource);
                    });
                }
                newPosition.setPositionFundingSources(newPositionSources);

                //Copy sub position if exist in to new position
                Set<CoordinatorPlanSubPosition> newSubPositions = new HashSet<>();
                if (!planPosition.getSubPositions().isEmpty()) {
                    planPosition.getSubPositions().forEach(subPosition -> {
                        InvestmentSubPosition newSubPosition = new InvestmentSubPosition();
                        newSubPosition.setName(subPosition.getName());
                        newSubPosition.setAmountNet(subPosition.getAmountNet());
                        newSubPosition.setAmountGross(subPosition.getAmountGross());
                        newSubPosition.setQuantity(subPosition.getQuantity());
                        newSubPosition.setTargetUnit(subPosition.getTargetUnit());
                        newSubPosition.setPlanPosition(newPosition);

                        //Copy funding Sources if exist in to new sub position
                        List<FundingSource> newSubPositionSources = new ArrayList<>();
                        if (!subPosition.getFundingSources().isEmpty()) {
                            subPosition.getFundingSources().forEach(subPositionSource -> {
                                FundingSource newSubPositionSource = new FundingSource();
                                newSubPositionSource.setType(subPositionSource.getType());
                                newSubPositionSource.setSourceAmountNet(subPositionSource.getSourceAmountNet());
                                newSubPositionSource.setSourceAmountGross(subPositionSource.getSourceAmountGross());
                                newSubPositionSource.setSourceAmountAwardedNet(subPositionSource.getSourceAmountAwardedNet());
                                newSubPositionSource.setSourceAmountAwardedGross(subPositionSource.getSourceAmountAwardedGross());
                                newSubPositionSource.setSourceExpensesPlanNet(subPositionSource.getSourceExpensesPlanNet());
                                newSubPositionSource.setSourceExpensesPlanGross(subPositionSource.getSourceExpensesPlanGross());
                                newSubPositionSource.setSourceExpensesPlanAwardedNet(subPositionSource.getSourceExpensesPlanAwardedNet());
                                newSubPositionSource.setSourceExpensesPlanAwardedGross(subPositionSource.getSourceExpensesPlanAwardedGross());
                                newSubPositionSource.setSourceRealizedAmountNet(subPositionSource.getSourceRealizedAmountNet());
                                newSubPositionSource.setSourceRealizedAmountGross(subPositionSource.getSourceRealizedAmountGross());
                                newSubPositionSource.setCoordinatorPlanSubPosition(newSubPosition);
                                newSubPositionSources.add(newSubPositionSource);
                            });
                        }
                        newSubPosition.setFundingSources(newSubPositionSources);
                        newSubPositions.add(newSubPosition);
                    });
                }

                newPosition.setSubPositions(newSubPositions);
                newPosition.setPlan(newPlan);
                newPosition.setCorrectionPlanPosition(planPosition);

                newPlanPositions.add(newPosition);

                // Set the status of the current position to updated
                planPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA);
            });
            investmentPositionRepository.saveAll(newPlanPositions);
        }

        newPlan.setYear(plan.getYear());
        newPlan.setStatus(CoordinatorPlan.PlanStatus.ZP);
        newPlan.setType(plan.getType());
        newPlan.setCreateDate(new Date());
        newPlan.setCoordinator(plan.getCoordinator());
        newPlan.setCorrectionPlan(plan);

        //Set the status of the current plan to updated
        plan.setStatus(CoordinatorPlan.PlanStatus.AA);
        coordinatorPlanRepository.save(plan);

        return setPlanAmountValues(coordinatorPlanRepository.save(newPlan));
    }

    @Override
    @Transactional
    public CoordinatorPlanPosition deleteTargetUnit(Long unitId) {
        InvestmentSubPosition investmentSubPosition = investmentSubPositionRepository.findById(unitId)
                .orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));

        investmentSubPosition.getFundingSources().forEach(source -> investmentSubPosition.getPlanPosition().getPositionFundingSources().stream().filter(psource -> psource.getType().equals(source.getType())).forEach(i -> {

            // update Coordinator plan position value AmountRequestedNet and AmountRequestedGross
            investmentSubPosition.getPlanPosition().setAmountRequestedNet(investmentSubPosition.getPlanPosition().getAmountRequestedNet().subtract(source.getSourceAmountNet()));
            investmentSubPosition.getPlanPosition().setAmountRequestedGross(investmentSubPosition.getPlanPosition().getAmountRequestedGross().subtract(source.getSourceAmountGross()));

            // update position founding source amount value
            i.setSourceAmountNet(i.getSourceAmountNet().subtract(source.getSourceAmountNet()));
            i.setSourceAmountGross(i.getSourceAmountGross().subtract(source.getSourceAmountGross()));
            i.setSourceExpensesPlanNet(i.getSourceExpensesPlanNet().subtract(source.getSourceExpensesPlanNet()));
            i.setSourceExpensesPlanGross(i.getSourceExpensesPlanGross().subtract(source.getSourceExpensesPlanGross()));

            // remove position funding source if 0
            if (i.getSourceAmountGross().equals(BigDecimal.ZERO) && i.getSourceExpensesPlanGross().equals(BigDecimal.ZERO)) {
                fundingSourceRepository.deleteById(i.getId());
            }

        }));

        investmentSubPosition.getPlanPosition().getSubPositions().remove(investmentSubPosition);

        investmentSubPosition.getPlanPosition().getPositionFundingSources().removeIf(source ->
                source.getSourceAmountGross().equals(BigDecimal.ZERO)
        );

        // Set status Coordinator position to KR - correct if delete target unit in updated plan
        if (investmentSubPosition.getPlanPosition().getCorrectionPlanPosition() != null &&
                !investmentSubPosition.getPlanPosition().getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR)) {
            investmentSubPosition.getPlanPosition().setStatus(CoordinatorPlanPosition.PlanPositionStatus.KR);
        }

        return investmentSubPosition.getPlanPosition();
    }

    @Override
    @Transactional
    public CoordinatorPlanPosition deleteInvestmentSource(Long positionId, Long sourceId) {
        InvestmentSubPosition investmentSubPosition = investmentSubPositionRepository.findById(positionId).
                orElseThrow(() -> new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND));
        FundingSource fSource = fundingSourceRepository.findById(sourceId).
                orElseThrow(() -> new AppException("Coordinator.plan.position.source.notFound", HttpStatus.NOT_FOUND));

        investmentSubPosition.getPlanPosition().getPositionFundingSources().stream().filter(source -> source.getType().equals(fSource.getType())).forEach(i -> {

            // update Coordinator plan position value AmountRequestedNet and AmountRequestedGross
            investmentSubPosition.getPlanPosition().setAmountRequestedNet(investmentSubPosition.getPlanPosition().getAmountRequestedNet().subtract(fSource.getSourceAmountNet()));
            investmentSubPosition.getPlanPosition().setAmountRequestedGross(investmentSubPosition.getPlanPosition().getAmountRequestedGross().subtract(fSource.getSourceAmountGross()));

            // remove position funding source if 0
            if (i.getSourceAmountGross().equals(fSource.getSourceAmountGross()) && i.getSourceExpensesPlanGross().equals(fSource.getSourceExpensesPlanGross())) {
                fundingSourceRepository.deleteById(i.getId());
            }

            // update position founding source amount value
            i.setSourceAmountNet(i.getSourceAmountNet().subtract(fSource.getSourceAmountNet()));
            i.setSourceAmountGross(i.getSourceAmountGross().subtract(fSource.getSourceAmountGross()));
            i.setSourceExpensesPlanNet(i.getSourceExpensesPlanNet().subtract(fSource.getSourceExpensesPlanNet()));
            i.setSourceExpensesPlanGross(i.getSourceExpensesPlanGross().subtract(fSource.getSourceExpensesPlanGross()));
        });

        investmentSubPosition.getFundingSources().remove(fSource);
        fundingSourceRepository.delete(fSource);

        investmentSubPosition.getPlanPosition().getPositionFundingSources().removeIf(source ->
                source.getSourceAmountGross().equals(BigDecimal.ZERO)
        );

        // Set status Coordinator position to KR - correct if delete target unit in updated plan
        if (investmentSubPosition.getPlanPosition().getCorrectionPlanPosition() != null &&
                !investmentSubPosition.getPlanPosition().getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR)) {
            investmentSubPosition.getPlanPosition().setStatus(CoordinatorPlanPosition.PlanPositionStatus.KR);
        }

        return investmentSubPosition.getPlanPosition();
    }

    @Override
    public List<CoordinatorPlanPosition> findCorrectedPlanPositions(final CoordinatorPlanPosition coordinatorPlanPosition) {

        List<CoordinatorPlanPosition> correctedPlanPositions = new ArrayList<>(Collections.singletonList(coordinatorPlanPosition));

        CoordinatorPlanPosition correctedPlanPosition = financialPositionRepository.findByCorrectionPlanPosition(coordinatorPlanPosition);

        if (correctedPlanPosition != null) {
            correctedPlanPositions.add(correctedPlanPosition);
            if (correctedPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.AA)) {
                this.findCorrectedPlanPosition(correctedPlanPosition, correctedPlanPositions);
            }
        }
        return correctedPlanPositions;
    }


    private void setPositionAmountRequestedValue(CoordinatorPlanPosition position) {
        if (!position.getSubPositions().isEmpty()) {
            position.setAmountRequestedNet(position.getSubPositions().stream().map(CoordinatorPlanSubPosition::getAmountNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            position.setAmountRequestedGross(position.getSubPositions().stream().map(CoordinatorPlanSubPosition::getAmountGross).reduce(BigDecimal.ZERO, BigDecimal::add));
        } else {
            position.setAmountRequestedNet(BigDecimal.ZERO);
            position.setAmountRequestedGross(BigDecimal.ZERO);
        }
    }

    private CoordinatorPlan setPlanAmountValues(CoordinatorPlan plan) {
        if (!plan.getPositions().isEmpty()) {
            plan.setPlanAmountRequestedNet(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRequestedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountRequestedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRequestedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            if (!plan.getType().equals(CoordinatorPlan.PlanType.INW)) {
                plan.setPlanAmountAwardedNet(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
                plan.setPlanAmountAwardedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            } else {
                plan.setPlanAmountAwardedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getExpensesPositionAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            }
            plan.setPlanAmountRealizedNet(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRealizedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountRealizedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRealizedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        }

        if (plan.getCorrectionPlan() != null) {
            setPlanAmountValues(plan.getCorrectionPlan());
        }
        return plan;
    }

    private void findCorrectedPlanPosition(final CoordinatorPlanPosition planPosition, final List<CoordinatorPlanPosition> correctPlanPositions) {
        CoordinatorPlanPosition correctedPlanPosition = financialPositionRepository.findByCorrectionPlanPosition(planPosition);

        if (correctedPlanPosition != null) {
            correctPlanPositions.add(correctedPlanPosition);
            this.findCorrectedPlanPosition(correctedPlanPosition, correctPlanPositions);
        }
    }

    private Set<CoordinatorPlan> filterCoordinatorsPlanInAccountant(Set<CoordinatorPlan> coordinatorPlans) {

        List<CoordinatorPlan.PlanStatus> publicProcurementStatuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.AK,
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.AN,
                CoordinatorPlan.PlanStatus.RE,
                CoordinatorPlan.PlanStatus.ZR,
                CoordinatorPlan.PlanStatus.AA
        );

        coordinatorPlans.stream().filter(coordinatorPlan ->
                (!coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.PZP) ||
                        (coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.PZP) && publicProcurementStatuses.contains(coordinatorPlan.getStatus())
                        )));

        TreeSet<CoordinatorPlan> tSet = new TreeSet<>(Collections.reverseOrder());
        tSet.addAll(coordinatorPlans);
        return tSet;
    }
}
