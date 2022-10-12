package pl.viola.ems.service.modules.accountant.institution.impl;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionFinancialPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionCoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionFinancialPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionPlanPositionRepository;
import pl.viola.ems.model.modules.accountant.institution.plans.repository.InstitutionPlanRepository;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.FinancialPosition;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanRepository;
import pl.viola.ems.model.modules.publicProcurement.institution.plans.InstitutionPublicProcurementPlanPosition;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.common.JasperPrintService;
import pl.viola.ems.service.modules.accountant.institution.InstitutionPlanService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InstitutionPlanServicesImpl implements InstitutionPlanService {

    @Autowired
    PlanService coordinatorPlanServices;

    @Autowired
    InstitutionPlanRepository institutionPlanRepository;

    @Autowired
    InstitutionPlanPositionRepository institutionPlanPositionRepository;

    @Autowired
    InstitutionFinancialPlanPositionRepository institutionFinancialPlanPositionRepository;

    @Autowired
    InstitutionCoordinatorPlanPositionRepository institutionCoordinatorPlanPositionRepository;

    @Autowired
    CoordinatorPlanRepository coordinatorPlanRepository;

    @Autowired
    JasperPrintService jasperPrintService;

    @Override
    public List<InstitutionPlan> getPlans(String levelAccess) {

        List<InstitutionPlan.InstitutionPlanStatus> statuses = Arrays.asList(
                InstitutionPlan.InstitutionPlanStatus.AK,
                InstitutionPlan.InstitutionPlanStatus.AD,
                InstitutionPlan.InstitutionPlanStatus.AE,
                InstitutionPlan.InstitutionPlanStatus.AN,
                InstitutionPlan.InstitutionPlanStatus.ZA,
                InstitutionPlan.InstitutionPlanStatus.AA,
                InstitutionPlan.InstitutionPlanStatus.RE
        );

        List<CoordinatorPlan.PlanType> types = new ArrayList<>();

        if (levelAccess.equals("accountant")) {
            types.add(CoordinatorPlan.PlanType.FIN);
            types.add(CoordinatorPlan.PlanType.INW);
        } else if (levelAccess.equals("publicProcurement")) {
            types.add(CoordinatorPlan.PlanType.PZP);
        }

        List<InstitutionPlan> institutionPlans = (levelAccess.equals("accountant") || levelAccess.equals("publicProcurement")) ?
                institutionPlanRepository.findByTypeIn(types) : institutionPlanRepository.findByStatusIn(statuses);

        if (!institutionPlans.isEmpty()) {
            institutionPlans.forEach(this::setPlanAmountValues);
        }
        return institutionPlans;
    }

    @Override
    public InstitutionPlan getPlan(Long planId) {
        InstitutionPlan institutionPlan = institutionPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        return this.setPlanAmountValues(institutionPlan);
    }

    @Override
    public List<InstitutionCoordinatorPlanPosition> getCoordinatorPlanPositions(Long positionId) {
        return institutionCoordinatorPlanPositionRepository.findByInstitutionPlanPosition(institutionPlanPositionRepository.findById(positionId)
                .orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND)));
    }


    @Override
    @Transactional
    public List<InstitutionCoordinatorPlanPosition> updatePlanPositions(final List<InstitutionCoordinatorPlanPosition> positions, final CoordinatorPlan.PlanType planType, final Long positionId, final String action) {

        InstitutionPlanPosition institutionPlanPosition = institutionPlanPositionRepository.findById(positionId)
                .orElseThrow(() -> new AppException("Accountant.institution.planPositionNotFound", HttpStatus.NOT_FOUND));

        if (planType.equals(CoordinatorPlan.PlanType.FIN)) {

            List<FinancialPosition> coordinatorPlanPositions = coordinatorPlanServices.findPositionsByIdsAndPlanType(positions.stream()
                    .map(position -> position.getCoordinatorPlanPosition().getId()).collect(Collectors.toList()), CoordinatorPlan.PlanType.FIN);

            positions.forEach(position -> {
                position.setInstitutionPlanPosition(institutionPlanPosition);

                CoordinatorPlanPosition coordinatorPlanPosition = coordinatorPlanPositions.stream().filter(coordinatorPosition -> coordinatorPosition.getId().equals(position.getCoordinatorPlanPosition().getId())).findFirst().get();

                if (coordinatorPlanPosition != null) {

                    institutionPlanPosition.setAmountAwardedNet(institutionPlanPosition.getAmountAwardedNet() == null ?
                            position.getAmountAwardedNet() : institutionPlanPosition.getAmountAwardedNet().subtract(coordinatorPlanPosition.getAmountAwardedNet() != null ?
                            coordinatorPlanPosition.getAmountAwardedNet() : BigDecimal.ZERO).add(position.getAmountAwardedNet()));
                    institutionPlanPosition.setAmountAwardedGross(institutionPlanPosition.getAmountAwardedGross() == null ?
                            position.getAmountAwardedGross() : (institutionPlanPosition.getAmountAwardedGross().subtract(coordinatorPlanPosition.getAmountAwardedGross() != null ?
                            coordinatorPlanPosition.getAmountAwardedGross() : BigDecimal.ZERO)).add(position.getAmountAwardedGross()));

                    coordinatorPlanPosition.setStatus(action.equals("accept") ? CoordinatorPlanPosition.PlanPositionStatus.ZA :
                            (coordinatorPlanPosition.getAmountAwardedNet() != null && coordinatorPlanPosition.getAmountAwardedNet().equals(position.getAmountAwardedNet())) ?
                                    CoordinatorPlanPosition.PlanPositionStatus.ZA : CoordinatorPlanPosition.PlanPositionStatus.SK);
                    coordinatorPlanPosition.setAmountAwardedNet(position.getAmountAwardedNet());
                    coordinatorPlanPosition.setAmountAwardedGross(position.getAmountAwardedGross());

                    if (coordinatorPlanPosition.getPlan().getStatus() != CoordinatorPlan.PlanStatus.RO) {
                        coordinatorPlanPosition.getPlan().setStatus(CoordinatorPlan.PlanStatus.RO);
                    }
                }
                setInstitutionPlanPositionStatus(institutionPlanPosition);
            });
            institutionPlanPositionRepository.save(institutionPlanPosition);
        }
        return positions;
    }

    @Override
    @Transactional
    public void updateInstitutionPlan(final CoordinatorPlan coordinatorPlan, final String action) {
        InstitutionPlan institutionPlan = institutionPlanRepository.findByYearAndType(coordinatorPlan.getYear(), coordinatorPlan.getType());

        if (institutionPlan == null) {
            //Institution plan not exist
            if (coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.FIN)) {
                // Financial Institution Plan
                institutionPlan = new InstitutionPlan(coordinatorPlan.getYear(), InstitutionPlan.InstitutionPlanStatus.UT, coordinatorPlan.getType());
                List<InstitutionFinancialPlanPosition> institutionFinancialPlanPositions = new ArrayList<>();
                List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();
                List<FinancialPosition> financialPositions = coordinatorPlanServices.findPositionsByPlan(coordinatorPlan.getId());
                InstitutionPlan finalInstitutionPlan = institutionPlan;

                financialPositions.forEach(financialPosition -> {
                    InstitutionFinancialPlanPosition institutionPlanPosition = new InstitutionFinancialPlanPosition(
                            financialPosition.getStatus(),
                            financialPosition.getAmountRequestedNet(),
                            financialPosition.getAmountRequestedGross(),
                            financialPosition.getAmountAwardedNet() == null ? BigDecimal.ZERO : financialPosition.getAmountAwardedNet(),
                            financialPosition.getAmountAwardedGross() == null ? BigDecimal.ZERO : financialPosition.getAmountAwardedGross(),
                            financialPosition.getAmountRealizedNet() == null ? BigDecimal.ZERO : financialPosition.getAmountRealizedNet(),
                            financialPosition.getAmountRealizedGross() == null ? BigDecimal.ZERO : financialPosition.getAmountRealizedGross(),
                            finalInstitutionPlan,
                            financialPosition.getCostType()
                    );
                    institutionFinancialPlanPositions.add(institutionPlanPosition);
                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(financialPosition, institutionPlanPosition);
                    institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                    institutionPlanPosition.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));

                });
                institutionPlan.setPlanPositions(new HashSet<>(institutionFinancialPlanPositions));
            } else if (coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.PZP)) {
                /*
                    Public Procurement Institution Plan
                    Create Institution plan on send Public Procurement first coordinator plan
                */
                institutionPlan = new InstitutionPlan(coordinatorPlan.getYear(), InstitutionPlan.InstitutionPlanStatus.UT, coordinatorPlan.getType());
                List<InstitutionPublicProcurementPlanPosition> institutionPublicProcurementPlanPositions = new ArrayList<>();
                List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();
                List<PublicProcurementPosition> publicProcurementPositions = coordinatorPlanServices.findPositionsByPlan(coordinatorPlan.getId());
                InstitutionPlan institutionPublicProcurementPlan = institutionPlan;
                publicProcurementPositions.forEach(publicProcurementPosition -> {
                    InstitutionPublicProcurementPlanPosition institutionPublicProcurementPlanPosition = new InstitutionPublicProcurementPlanPosition(
                            publicProcurementPosition.getStatus(),
                            publicProcurementPosition.getAmountRequestedNet(),
                            publicProcurementPosition.getAmountRequestedGross(),
                            institutionPublicProcurementPlan,
                            publicProcurementPosition.getEstimationType(),
                            publicProcurementPosition.getOrderType(),
                            publicProcurementPosition.getAssortmentGroup()
                    );
                    institutionPublicProcurementPlanPositions.add(institutionPublicProcurementPlanPosition);
                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(publicProcurementPosition, institutionPublicProcurementPlanPosition);
                    institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                    institutionPublicProcurementPlanPosition.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));
                });
                institutionPlan.setPlanPositions(new HashSet<>(institutionPublicProcurementPlanPositions));
            }
        } else {
            //Update existing plan
            switch (action) {
                case "send":
                    //Update on send financial or investments coordinator plan
                    if (coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.FIN) || coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.INW)) {
                        if (institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.UT)) {
                            if (!institutionPlan.getPlanPositions().isEmpty()) {
                                InstitutionPlan finalInstitutionPlan2 = institutionPlan;
                                InstitutionPlan finalInstitutionPlan3 = institutionPlan;
                                coordinatorPlan.getPositions().forEach(coordinatorPlanPosition -> {
                                    if (finalInstitutionPlan2.getPlanPositions().stream().anyMatch(institutionPlanPosition1 -> institutionPlanPosition1.getCostType().equals(coordinatorPlanPosition.getCostType()))) {
                                        InstitutionPlanPosition institutionPlanPosition = finalInstitutionPlan2.getPlanPositions().stream().filter(institutionPlanPosition1 -> institutionPlanPosition1.getCostType().equals(coordinatorPlanPosition.getCostType())).findFirst().orElse(null);
                                        institutionPlanPosition.getInstitutionCoordinatorPlanPositions().add(new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition));
                                        institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                                        institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
                                    } else {
                                        Set<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new HashSet<>();
                                        InstitutionFinancialPlanPosition institutionPlanPosition = new InstitutionFinancialPlanPosition(
                                                coordinatorPlanPosition.getStatus(),
                                                coordinatorPlanPosition.getAmountRequestedNet(),
                                                coordinatorPlanPosition.getAmountRequestedGross(),
                                                finalInstitutionPlan2,
                                                coordinatorPlanPosition.getCostType()
                                        );

                                        InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition);
                                        institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                                        institutionPlanPosition.setInstitutionCoordinatorPlanPositions(institutionCoordinatorPlanPositions);
                                        finalInstitutionPlan3.getPlanPositions().add(institutionPlanPosition);
                                    }
                                });
                            } else {
                                InstitutionPlan finalInstitutionPlan1 = institutionPlan;
                                List<InstitutionFinancialPlanPosition> institutionFinancialPlanPositions = new ArrayList<>();
                                List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();

                                coordinatorPlan.getPositions().forEach(financialPosition -> {
                                    InstitutionFinancialPlanPosition institutionPlanPosition = new InstitutionFinancialPlanPosition(
                                            financialPosition.getStatus(),
                                            financialPosition.getAmountRequestedNet(),
                                            financialPosition.getAmountRequestedGross(),
                                            finalInstitutionPlan1,
                                            financialPosition.getCostType()
                                    );
                                    /* If resend coordinator plan after return by director */
                                    if (financialPosition.getAmountAwardedGross() != null) {
                                        institutionPlanPosition.setAmountAwardedNet(financialPosition.getAmountAwardedNet());
                                        institutionPlanPosition.setAmountAwardedGross(financialPosition.getAmountAwardedGross());
                                    }
                                    institutionFinancialPlanPositions.add(institutionPlanPosition);

                                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(financialPosition, institutionPlanPosition);

                                    institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                                    institutionPlanPosition.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));

                                });
                                institutionPlan.setPlanPositions(new HashSet<>(institutionFinancialPlanPositions));
                            }
                        }
                    } else if (coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.PZP)) {
                        //Update Public Procurement coordinator plan if exists institution plan

                        if (institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.UT)) {

                            InstitutionPlan institutionPlanUpd = institutionPlan;
                            if (!institutionPlan.getPlanPositions().isEmpty()) {
                                coordinatorPlan.getPositions().forEach(coordinatorPlanPosition -> {
                                    if (institutionPlanUpd.getPlanPositions().stream().anyMatch(institutionPlanUpdPosition -> institutionPlanUpdPosition.getAssortmentGroup().equals(coordinatorPlanPosition.getAssortmentGroup()))) {
                                        InstitutionPlanPosition institutionPlanPosition = institutionPlanUpd.getPlanPositions().stream().filter(institutionPlanUpdPosition -> institutionPlanUpdPosition.getAssortmentGroup().equals(coordinatorPlanPosition.getAssortmentGroup())).findFirst().orElse(null);
                                        if (institutionPlanPosition != null) {
                                            institutionPlanPosition.getInstitutionCoordinatorPlanPositions().add(new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition));
                                        }
                                        institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                                        institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
                                    } else {
                                        Set<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new HashSet<>();
                                        InstitutionPublicProcurementPlanPosition institutionPlanPosition = new InstitutionPublicProcurementPlanPosition(
                                                coordinatorPlanPosition.getStatus(),
                                                coordinatorPlanPosition.getAmountRequestedNet(),
                                                coordinatorPlanPosition.getAmountRequestedGross(),
                                                institutionPlanUpd,
                                                coordinatorPlanPosition.getEstimationType(),
                                                coordinatorPlanPosition.getOrderType(),
                                                coordinatorPlanPosition.getAssortmentGroup()
                                        );

                                        InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition);
                                        institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                                        institutionPlanPosition.setInstitutionCoordinatorPlanPositions(institutionCoordinatorPlanPositions);
                                        institutionPlanUpd.getPlanPositions().add(institutionPlanPosition);
                                    }
                                });
                            } else {
                                List<InstitutionPublicProcurementPlanPosition> institutionPublicProcurementPlanPositions = new ArrayList<>();
                                List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();

                                coordinatorPlan.getPositions().forEach(financialPosition -> {
                                    InstitutionPublicProcurementPlanPosition institutionPlanPosition = new InstitutionPublicProcurementPlanPosition(
                                            financialPosition.getStatus(),
                                            financialPosition.getAmountRequestedNet(),
                                            financialPosition.getAmountRequestedGross(),
                                            institutionPlanUpd,
                                            financialPosition.getEstimationType(),
                                            financialPosition.getOrderType(),
                                            financialPosition.getAssortmentGroup()
                                    );
                                    institutionPublicProcurementPlanPositions.add(institutionPlanPosition);

                                    InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(financialPosition, institutionPlanPosition);

                                    institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                                    institutionPlanPosition.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));

                                });
                                institutionPlan.setPlanPositions(new HashSet<>(institutionPublicProcurementPlanPositions));
                            }
                        }
                    }
                    coordinatorPlan.setInstitutionPlan(institutionPlan);
                    break;
                case "return":
                case "withdraw":
                    //Update on withdraw or return coordinator plan
                    List<InstitutionPlanPosition> removedInstitutionPlanPositions = new ArrayList<>();
                    List<InstitutionCoordinatorPlanPosition> removedInstitutionCoordinatorPlanPositions = new ArrayList<>();
                    institutionPlan.getPlanPositions().forEach(institutionPlanPosition -> institutionPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(institutionCoordinatorPlanPosition -> {
                        if (coordinatorPlan.getPositions().contains(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition())) {
                            removedInstitutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                            institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getAmountRequestedNet().subtract(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAmountRequestedNet()));
                            institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getAmountRequestedGross().subtract(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAmountRequestedGross()));
                            /*
                                If the plan has been returned to the coordinator from the director's module, calculate
                                the new value of the granted amounts and mark the corrected positions for resending
                            */
                            if (action.equals("return")) {
                                institutionPlanPosition.setAmountAwardedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
                                institutionPlanPosition.setAmountAwardedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
                                institutionPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.WY);
                            }
                            if (institutionPlanPosition.getInstitutionCoordinatorPlanPositions().size() == 1) {
                                removedInstitutionPlanPositions.add(institutionPlanPosition);
                            }
                        }
                    }));
                    /*
                        If the plan has been returned to the coordinator from the director module,
                        change the status of the institution's plan to created
                    */
                    if (action.equals("return")) {
                        institutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.UT);
                        institutionPlan.setApproveUser(null);
                    }
                    coordinatorPlan.setInstitutionPlan(null);
                    institutionCoordinatorPlanPositionRepository.deleteInBatch(removedInstitutionCoordinatorPlanPositions);
                    institutionPlanPositionRepository.deleteInBatch(removedInstitutionPlanPositions);
                    break;
                case "approveDirector":
                    if (!institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.AD)) {
                        if (!Utils.existsPlanToApprove(institutionPlan, "AK") && !institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.UT)) {
                            institutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AD);
                        }
                    }
                    break;
                case "approveEconomic":
                    if (!institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.AE)) {
                        if (!Utils.existsPlanToApprove(institutionPlan, "AD") && !institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.UT)) {
                            institutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AE);
                        }
                    }
                    break;
                case "approveChief":
                    if (!institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.AN)) {
                        if (!Utils.existsEconomicApprovePlan(institutionPlan) && !institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.UT)) {
                            institutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AN);
                        }
                    }
                    break;
            }
        }

        if (institutionPlan != null) {
            institutionPlanRepository.save(institutionPlan);
        }
    }

    @Transactional
    @Override
    public void correctInstitutionPlan(final CoordinatorPlan coordinatorPlan, final String action) {

//        InstitutionPlan institutionPlan = institutionPlanRepository.findByYearAndTypeAndStatusIn(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN, Arrays.asList(
//                InstitutionPlan.InstitutionPlanStatus.UT,
//                InstitutionPlan.InstitutionPlanStatus.AK,
//                InstitutionPlan.InstitutionPlanStatus.AD,
//                InstitutionPlan.InstitutionPlanStatus.AE)
//        );
        switch (action) {
//            case "send":
            case "approveChief":
                InstitutionPlan institutionPlan = institutionPlanRepository.findByYearAndTypeAndStatusIn(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN, Collections.singletonList(
                        InstitutionPlan.InstitutionPlanStatus.UT)
                );
                //If send first coordinator update plan and not exist institution update plan
                if (institutionPlan == null) {
                    /*
                        Create copy Institution plan on send first coordinator plan update
                    */
//                    InstitutionPlan oldInstitutionPlan = institutionPlanRepository.findByYearAndTypeAndStatusIn(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN, Arrays.asList(
//                        InstitutionPlan.InstitutionPlanStatus.AK,
////                        InstitutionPlan.InstitutionPlanStatus.AD,
////                        InstitutionPlan.InstitutionPlanStatus.AE,
//                        InstitutionPlan.InstitutionPlanStatus.ZA,
//                        InstitutionPlan.InstitutionPlanStatus.RE)
//                    );
                    InstitutionPlan oldInstitutionPlan = institutionPlanRepository.findFirstByYearAndTypeOrderByIdDesc(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN);

                    /*
                        Exist only one institution plan update in the same time
                     */
                    if (oldInstitutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.ZA) || oldInstitutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.RE)) {
                        oldInstitutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AA);
                        oldInstitutionPlan.getPlanPositions().forEach(planPositions -> planPositions.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA));
                        institutionPlanRepository.save(oldInstitutionPlan);
                    }

                    institutionPlan = new InstitutionPlan(coordinatorPlan.getYear(), InstitutionPlan.InstitutionPlanStatus.UT, coordinatorPlan.getType());
                    institutionPlan.setCorrectionPlan(oldInstitutionPlan);
                    institutionPlan.setUpdateNumber(oldInstitutionPlan.getUpdateNumber() != null ? oldInstitutionPlan.getUpdateNumber() + 1 : 1);
                    List<InstitutionFinancialPlanPosition> institutionFinancialPlanPositions = new ArrayList<>();
                    final InstitutionPlan finalInstitutionPlan = institutionPlan;
                    oldInstitutionPlan.getPlanPositions().forEach(oldPlanPosition -> {
                        BigDecimal oldAmountAwardedNet = oldPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                        BigDecimal oldAmountAwardedGross = oldPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                        BigDecimal oldAmountRealizedNet = oldPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                        BigDecimal oldAmountRealizedGross = oldPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRealizedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                        InstitutionFinancialPlanPosition institutionFinancialPlanPosition = new InstitutionFinancialPlanPosition(
                                CoordinatorPlanPosition.PlanPositionStatus.ZA,
                                oldAmountAwardedNet,
                                oldAmountAwardedGross,
                                oldAmountAwardedNet,
                                oldAmountAwardedGross,
                                oldAmountRealizedNet,
                                oldAmountRealizedGross,
                                finalInstitutionPlan,
                                oldPlanPosition.getCostType()
                        );
                        institutionFinancialPlanPosition.setCorrectionPlanPosition(oldPlanPosition);
                        institutionFinancialPlanPositions.add(institutionFinancialPlanPosition);
                        List<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new ArrayList<>();
                        oldPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(oldInstitutionCoordinatorPlanPosition -> {
                            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(
                                    oldInstitutionCoordinatorPlanPosition.getCoordinatorPlanPosition(), institutionFinancialPlanPosition);
                            institutionCoordinatorPlanPosition.setCorrectionPlanCoordinatorPosition(oldInstitutionCoordinatorPlanPosition);
                            institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                        });
                        institutionFinancialPlanPosition.setInstitutionCoordinatorPlanPositions(new HashSet<>(institutionCoordinatorPlanPositions));
                    });
                    institutionPlan.setPlanPositions(new HashSet<>(institutionFinancialPlanPositions));
                }

                final InstitutionPlan finalInstitutionPlan1 = institutionPlan;
                coordinatorPlan.getPositions().forEach(coordinatorPlanPosition -> {
                    if (coordinatorPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) {
                        if (finalInstitutionPlan1.getPlanPositions().stream().anyMatch(institutionPlanPosition1 -> institutionPlanPosition1.getCostType().equals(coordinatorPlanPosition.getCostType()))) {
                            InstitutionPlanPosition institutionPlanPosition = finalInstitutionPlan1.getPlanPositions().stream().filter(institutionPlanPosition1 -> institutionPlanPosition1.getCostType().equals(coordinatorPlanPosition.getCostType())).findFirst().orElse(null);
                            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = null;
                            if (institutionPlanPosition != null) {
                                institutionCoordinatorPlanPosition = institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().filter(institutionCoordinatorPlanPosition1 -> institutionCoordinatorPlanPosition1.getCoordinatorPlanPosition().getPlan().getCoordinator().equals(coordinatorPlan.getCoordinator())).findAny().orElse(null);
                            }
                            if (institutionCoordinatorPlanPosition != null) {
                                institutionCoordinatorPlanPosition.setCoordinatorPlanPosition(coordinatorPlanPosition);
                            } else {
                                institutionPlanPosition.getInstitutionCoordinatorPlanPositions().add(new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition));
                            }
                            if (!institutionPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) {
                                institutionPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
                            }
//                            if (coordinatorPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR)) {
                            institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                            institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
                            institutionPlanPosition.setAmountAwardedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
                            institutionPlanPosition.setAmountAwardedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));

//                            }
                        } else {
                            Set<InstitutionCoordinatorPlanPosition> institutionCoordinatorPlanPositions = new HashSet<>();
                            InstitutionFinancialPlanPosition institutionPlanPosition = new InstitutionFinancialPlanPosition(
                                    coordinatorPlanPosition.getStatus(),
                                    coordinatorPlanPosition.getAmountRequestedNet(),
                                    coordinatorPlanPosition.getAmountRequestedGross(),
                                    finalInstitutionPlan1,
                                    coordinatorPlanPosition.getCostType()
                            );

                            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(coordinatorPlanPosition, institutionPlanPosition);
                            institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                            institutionPlanPosition.setInstitutionCoordinatorPlanPositions(institutionCoordinatorPlanPositions);
                            finalInstitutionPlan1.getPlanPositions().add(institutionPlanPosition);
                        }


//                        /* Set status coordinator plan position as corrected */
//                        coordinatorPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.SK);
                    }
                });

                /* Add coordinator plan to current institution plan */
                coordinatorPlan.setInstitutionPlan(institutionPlan);

                institutionPlanRepository.save(institutionPlan);
                break;
            case "return":
            case "withdraw":
                //Update on withdraw or return coordinator plan
                List<InstitutionPlanPosition> removedInstitutionPlanPositions = new ArrayList<>();
                List<InstitutionCoordinatorPlanPosition> removedInstitutionCoordinatorPlanPositions = new ArrayList<>();
                InstitutionPlan returnInsPlan = institutionPlanRepository.findByYearAndTypeAndStatusIn(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN, Collections.singletonList(
                        InstitutionPlan.InstitutionPlanStatus.UT)
                );
                returnInsPlan.getPlanPositions().forEach(institutionPlanPosition -> institutionPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(institutionCoordinatorPlanPosition -> {
                    if (coordinatorPlan.getPositions().contains(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition())) {
                        CoordinatorPlanPosition coordinatorPlanPosition = coordinatorPlan.getPositions().stream().filter(coordinatorPlanPosition1 -> coordinatorPlanPosition1.getCostType().equals(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getCostType())).findAny().orElse(null);
                        if (coordinatorPlanPosition != null) {
                            if (coordinatorPlanPosition.getCorrectionPlanPosition() != null) {
                                if (coordinatorPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR) ||
                                        coordinatorPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) {
                                    /*
                                        Change correction position of current corrected returned coordinator plan
                                        position set amount requested equal as amount awarded
                                     */
                                    coordinatorPlanPosition.getCorrectionPlanPosition().setAmountRequestedNet(coordinatorPlanPosition.getCorrectionPlanPosition().getAmountAwardedNet());
                                    coordinatorPlanPosition.getCorrectionPlanPosition().setAmountRequestedGross(coordinatorPlanPosition.getCorrectionPlanPosition().getAmountAwardedGross());
                                }
                                institutionCoordinatorPlanPosition.setCoordinatorPlanPosition(coordinatorPlanPosition.getCorrectionPlanPosition());
                            } else {
                                removedInstitutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
//                                    institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getAmountRequestedNet().subtract(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAmountAwardedNet()));
//                                    institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getAmountRequestedGross().subtract(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAmountAwardedGross()));

                                if (institutionPlanPosition.getInstitutionCoordinatorPlanPositions().size() == 1) {
                                    removedInstitutionPlanPositions.add(institutionPlanPosition);
                                }
                            }

                            if (coordinatorPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) {
                                /*
                                    Return plan to Coordinator, if position amount awarded add in Accountant module
                                    change to null
                                 */
                                coordinatorPlanPosition.setAmountAwardedNet(null);
                                coordinatorPlanPosition.setAmountAwardedGross(null);
                                coordinatorPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.KR);
                            }
                        }
                        institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
                        institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
                        institutionPlanPosition.setAmountAwardedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
                        institutionPlanPosition.setAmountAwardedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));

                        if ((institutionPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR) || institutionPlanPosition.getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK))
                                && institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().filter(insCoordinatorPlanPosition ->
                                institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.KR)).collect(Collectors.toSet()).isEmpty()) {
                            institutionPlanPosition.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZA);
                        }
                    }
                }));
                if (action.equals("return")) {
                    returnInsPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.UT);
                    returnInsPlan.setApproveUser(null);
                }
                if (!removedInstitutionCoordinatorPlanPositions.isEmpty()) {
                    institutionCoordinatorPlanPositionRepository.deleteInBatch(removedInstitutionCoordinatorPlanPositions);
                }
                if (!removedInstitutionPlanPositions.isEmpty()) {
                    institutionPlanPositionRepository.deleteInBatch(removedInstitutionPlanPositions);
                }
                break;
//            case "approveDirector":
//                InstitutionPlan aprDyrInstitutionPlan = institutionPlanRepository.findByYearAndTypeAndStatusIn(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN, Arrays.asList(
//                    InstitutionPlan.InstitutionPlanStatus.AK,
//                    InstitutionPlan.InstitutionPlanStatus.AD,
//                    InstitutionPlan.InstitutionPlanStatus.AE)
//                );
//                if (!aprDyrInstitutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.AD)) {
//                    if (!Utils.existsPlanToApprove(aprDyrInstitutionPlan, "AK")) {
//                        aprDyrInstitutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AD);
//                    }
//                }
//                break;
//            case "approveEconomic":
//                InstitutionPlan aprDyrEcoInstitutionPlan = institutionPlanRepository.findByYearAndTypeAndStatusIn(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN, Arrays.asList(
//                    InstitutionPlan.InstitutionPlanStatus.AK,
//                    InstitutionPlan.InstitutionPlanStatus.AD,
//                    InstitutionPlan.InstitutionPlanStatus.AE)
//                );
//                if (!aprDyrEcoInstitutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.AE)) {
////                    if (!Utils.existsPlanToApprove(institutionPlan, "AD") && !institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.UT)) {
//                    if (!Utils.existsPlanToApprove(aprDyrEcoInstitutionPlan, "AD")) {
//                        aprDyrEcoInstitutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AE);
//                    }
//                }
//                break;
//            case "approveChief":
//                InstitutionPlan aprChiefInstitutionPlan = institutionPlanRepository.findByYearAndTypeAndStatusIn(coordinatorPlan.getYear(), CoordinatorPlan.PlanType.FIN, Arrays.asList(
//                    InstitutionPlan.InstitutionPlanStatus.AK,
//                    InstitutionPlan.InstitutionPlanStatus.AD,
//                    InstitutionPlan.InstitutionPlanStatus.AE)
//                );
//                if (!aprChiefInstitutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.AN)) {
////                    if (!Utils.existsEconomicApprovePlan(institutionPlan) && !institutionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.UT)) {
//                    if (!Utils.existsEconomicApprovePlan(aprChiefInstitutionPlan)) {
//                        aprChiefInstitutionPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AN);
//                    }
//                }
//                break;
        }
    }

    @Transactional
    @Override
    public void updateInstitutionPlanPositions(List<FinancialPosition> positions) {
        positions.forEach(financialPosition -> {
            InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = institutionCoordinatorPlanPositionRepository.findByCoordinatorPlanPosition(financialPosition);
            setInstitutionPlanPositionAmountAwardedValues(institutionCoordinatorPlanPosition.getInstitutionPlanPosition());
            setInstitutionPlanPositionStatus(institutionCoordinatorPlanPosition.getInstitutionPlanPosition());
        });
    }

    @Transactional
    @Override
    public InstitutionPlan updatePlanStatus(final Long planId, final String action, final String levelAccess) {
        InstitutionPlan plan = institutionPlanRepository.findById(planId).orElseThrow(() -> new AppException("Accountant.institution.planNotFound", HttpStatus.NOT_FOUND));

        User user = Utils.getCurrentUser();

        Set<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByInstitutionPlan(plan);
        if (plan.getCorrectionPlan() == null) {
            /* Update Coordinators plans if current approved institution plan is base plan in the year(is not an update plan) */

//            List<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByStatusAndTypeAndYear(action.equals("approve") ?
//                    levelAccess.equals("accountant") ? CoordinatorPlan.PlanStatus.RO : CoordinatorPlan.PlanStatus.AN
//                    : levelAccess.equals("accountant") ? CoordinatorPlan.PlanStatus.AK : CoordinatorPlan.PlanStatus.AN, plan.getType(), plan.getYear());
            coordinatorPlans.forEach(coordinatorPlan -> {
                coordinatorPlan.setStatus(action.equals("approve") ?
                        levelAccess.equals("accountant") ?
                                coordinatorPlan.getStatus().equals(CoordinatorPlan.PlanStatus.RO) ? CoordinatorPlan.PlanStatus.AK : coordinatorPlan.getStatus()
                                : CoordinatorPlan.PlanStatus.ZA
                        : CoordinatorPlan.PlanStatus.RO);
                if (levelAccess.equals("accountant")) {
                    coordinatorPlan.setPlanAcceptUser(action.equals("approve") ? user : null);
                } else if (levelAccess.equals("director")) {
                    if (action.equals("approve")) {
                        coordinatorPlan.setChiefAcceptUser(user);
                    } else if (action.equals("withdraw")) {
                        coordinatorPlan.setChiefAcceptUser(null);
                        coordinatorPlan.setEconomicAcceptUser(null);
                        coordinatorPlan.setDirectorAcceptUser(null);
                        coordinatorPlan.setPlanAcceptUser(null);
                    }
                }
            });

            coordinatorPlanRepository.saveAll(coordinatorPlans);
        } else {
            /* Update coordinator plan if current approved plan is update and levelAccess is chief */
            if (levelAccess.equals("director")) {
                coordinatorPlans.forEach(coordinatorPlan -> {
                    coordinatorPlan.setStatus(CoordinatorPlan.PlanStatus.ZA);
                    coordinatorPlan.setChiefAcceptUser(user);
                });
            }
        }

        if (levelAccess.equals("accountant")) {
            plan.setApproveUser(action.equals("approve") ? user : null);
        } else if (levelAccess.equals("director")) {
            plan.setChiefAcceptUser(action.equals("approve") ? user : null);
        }
        plan.setStatus(action.equals("approve") ?
                levelAccess.equals("accountant") ? InstitutionPlan.InstitutionPlanStatus.AK : InstitutionPlan.InstitutionPlanStatus.ZA
                : InstitutionPlan.InstitutionPlanStatus.UT);
        /*
            Exist more than one institution plan update in the same time and approved corrected plan status is not AA change corrected plan to AA
         */
        if (levelAccess.equals("director")) {
            if (plan.getCorrectionPlan().getStatus().equals(InstitutionPlan.InstitutionPlanStatus.ZA) || plan.getCorrectionPlan().getStatus().equals(InstitutionPlan.InstitutionPlanStatus.RE)) {
                /* if correction current approved plan status not update, setup correction plan status as updated */
                plan.getCorrectionPlan().setStatus(InstitutionPlan.InstitutionPlanStatus.AA);
                plan.getCorrectionPlan().getPlanPositions().forEach(planPositions -> planPositions.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA));

            }

            /* Check if exists other plans and have the status accepted or realized if so, mark the current plan as updated */
            InstitutionPlan correctionPlan = institutionPlanRepository.findByCorrectionPlan(plan);
            if (correctionPlan != null) {
                if (correctionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.ZA) || correctionPlan.getCorrectionPlan().getStatus().equals(InstitutionPlan.InstitutionPlanStatus.RE)) {
                    plan.setStatus(InstitutionPlan.InstitutionPlanStatus.AA);
                    plan.getPlanPositions().forEach(planPositions -> planPositions.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA));
                }
                this.findApprovedCorrectionInstitutionPlan(correctionPlan, plan);
            }
        }
        return institutionPlanRepository.save(plan);
    }

    @Override
    public boolean disableWithdrawInstitutionPlan(final Long planId) {
        InstitutionPlan plan = institutionPlanRepository.findById(planId).orElseThrow(() -> new AppException("Accountant.institution.planNotFound", HttpStatus.NOT_FOUND));

        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.AE,
                CoordinatorPlan.PlanStatus.AN
        );
        List<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByStatusInAndTypeAndYear(statuses, plan.getType(), plan.getYear());
        return !coordinatorPlans.isEmpty();
    }

    @Override
    public void exportPlanToJasper(Long planId, HttpServletResponse response) throws IOException, JRException, SQLException {
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(planId, "/jasper/prints/modules/accountant/plans/institutionPlan.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }

    @Override
    public void exportPlansToExcel(ExportType exportType, String accessLevel, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        List<InstitutionPlan> plans = getPlans(accessLevel);

        plans.forEach(plan -> {
            Map<String, Object> row = new HashMap<>();
            row.put("year", plan.getYear());
            row.put("type.name", plan.getType().name());
            row.put("amountRequestedGross", plan.getAmountRequestedGross());
            row.put("amountAwardedGross", plan.getAmountAwardedGross());
            row.put("amountRealizedGross", plan.getAmountRealizedGross());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    @Override
    public void exportPlanPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException {

        ArrayList<Map<String, Object>> rows = new ArrayList<>();
        if (planType == CoordinatorPlan.PlanType.FIN) {
            Set<InstitutionPlanPosition> financialPositions = this.getPlan(planId).getPlanPositions();
            financialPositions.forEach(position -> {
                Map<String, Object> row = new HashMap<>();
                row.put("costType.code", position.getCostType().getCode());
                row.put("costType.name", position.getCostType().getName());
                row.put("amountRequestedGross", position.getAmountRequestedGross());
                row.put("amountAwardedGross", position.getAmountAwardedGross());
                row.put("amountRealizedGross", position.getAmountRealizedGross());
                rows.add(row);
            });
        }
        Utils.generateExcelExport(exportType, headRow, rows, response);

    }

    @Override
    public void exportPlanSubPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long positionId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException {
        ArrayList<Map<String, Object>> rows = new ArrayList<>();
        if (planType == CoordinatorPlan.PlanType.FIN) {
            InstitutionPlanPosition institutionFinancialPlanPosition = institutionFinancialPlanPositionRepository.findById(positionId).orElseThrow(() -> new AppException("Accountant.institution.planNotFound", HttpStatus.NOT_FOUND));
            institutionFinancialPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(institutionCoordinatorPlanPosition -> {
                Map<String, Object> row = new HashMap<>();
                row.put("coordinatorName", institutionCoordinatorPlanPosition.getCoordinatorName());
                row.put("amountRequestedGross", institutionCoordinatorPlanPosition.getAmountRequestedGross());
                row.put("amountAwardedGross", institutionCoordinatorPlanPosition.getAmountAwardedGross());
                row.put("amountRealizedGross", institutionCoordinatorPlanPosition.getAmountRealizedGross());
                rows.add(row);
            });
        }
        Utils.generateExcelExport(exportType, headRow, rows, response);
    }

    private void setInstitutionPlanPositionAmountAwardedValues(InstitutionPlanPosition institutionPlanPosition) {
        institutionPlanPosition.setAmountAwardedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        institutionPlanPosition.setAmountAwardedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        institutionPlanPositionRepository.save(institutionPlanPosition);
    }


    private InstitutionPlan setPlanAmountValues(InstitutionPlan plan) {
        if (!plan.getPlanPositions().isEmpty()) {
            if (plan.getType().equals(CoordinatorPlan.PlanType.PZP)) {
                plan.setAmountRequestedNet(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                plan.setAmountRealizedNet(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRealizedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            } else {
                plan.setAmountRequestedGross(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
                plan.setAmountAwardedGross(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
                plan.setAmountRealizedGross(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRealizedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
            }
        }
        return plan;
    }

    private void setInstitutionPlanPositionStatus(InstitutionPlanPosition institutionPlanPosition) {
        if (institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().noneMatch(institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getAmountAwardedNet() == null)) {
            institutionPlanPosition.setStatus(
                    institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().anyMatch(
                            institutionCoordinatorPlanPosition -> institutionCoordinatorPlanPosition.getPositionStatus().equals(CoordinatorPlanPosition.PlanPositionStatus.SK)) ?
                            CoordinatorPlanPosition.PlanPositionStatus.SK : CoordinatorPlanPosition.PlanPositionStatus.ZA
            );
        }
    }

    private void findApprovedCorrectionInstitutionPlan(InstitutionPlan institutionPlan, InstitutionPlan currentApprovedPlan) {
        InstitutionPlan correctionPlan = institutionPlanRepository.findByCorrectionPlan(institutionPlan);
        if (correctionPlan != null) {
            if (correctionPlan.getStatus().equals(InstitutionPlan.InstitutionPlanStatus.ZA) || correctionPlan.getCorrectionPlan().getStatus().equals(InstitutionPlan.InstitutionPlanStatus.RE)) {
                currentApprovedPlan.setStatus(InstitutionPlan.InstitutionPlanStatus.AA);
                currentApprovedPlan.getPlanPositions().forEach(planPositions -> planPositions.setStatus(CoordinatorPlanPosition.PlanPositionStatus.AA));
            } else {
                this.findApprovedCorrectionInstitutionPlan(correctionPlan, currentApprovedPlan);
            }
        }
    }

}
