package pl.viola.ems.service.modules.accountant.institution.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
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
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanRepository;
import pl.viola.ems.service.modules.accountant.institution.InstitutionPlanService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.utils.Utils;

import java.math.BigDecimal;
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

    @Override
    public List<InstitutionPlan> getPlans() {

        List<InstitutionPlan> institutionPlans = institutionPlanRepository.findAll();

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

                if (!coordinatorPlanPosition.equals(null)) {
                    if (action.equals("correct")) {
                        institutionPlanPosition.setAmountAwardedNet(institutionPlanPosition.getAmountAwardedNet() == null ?
                                position.getAmountAwardedNet() : institutionPlanPosition.getAmountAwardedNet().subtract(coordinatorPlanPosition.getAmountAwardedNet() != null ?
                                coordinatorPlanPosition.getAmountAwardedNet() : BigDecimal.ZERO).add(position.getAmountAwardedNet()));
                        institutionPlanPosition.setAmountAwardedGross(institutionPlanPosition.getAmountAwardedGross() == null ?
                                position.getAmountAwardedGross() : (institutionPlanPosition.getAmountAwardedGross().subtract(coordinatorPlanPosition.getAmountAwardedGross() != null ?
                                coordinatorPlanPosition.getAmountAwardedGross() : BigDecimal.ZERO)).add(position.getAmountAwardedGross()));
                    } else if (action.equals("accept")) {
                        institutionPlanPosition.setAmountAwardedNet(positions.stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
                        institutionPlanPosition.setAmountAwardedGross(positions.stream().map(InstitutionCoordinatorPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
                    }
                    coordinatorPlanPosition.setStatus(action.equals("accept") ? CoordinatorPlanPosition.PlanPositionStatus.ZA :
                            coordinatorPlanPosition.getAmountAwardedNet().equals(position.getAmountAwardedNet()) ?
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
            institutionPlan = new InstitutionPlan(coordinatorPlan.getYear(), InstitutionPlan.InstitutionPlanStatus.UT, coordinatorPlan.getType());
            if (coordinatorPlan.getType().equals(CoordinatorPlan.PlanType.FIN)) {
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
            }

        } else {
            //Update existing plan
            if (action.equals("send")) {
                //Update on send coordinator plan
                if (!institutionPlan.getPlanPositions().isEmpty()) {
                    InstitutionPlan finalInstitutionPlan2 = institutionPlan;
                    InstitutionPlan finalInstitutionPlan3 = institutionPlan;
                    coordinatorPlan.getPositions().forEach(coordinatorPlanPosition -> {
                        if (finalInstitutionPlan2.getPlanPositions().stream().anyMatch(institutionPlanPosition1 -> institutionPlanPosition1.getCostType().equals(coordinatorPlanPosition.getCostType()))) {
                            InstitutionPlanPosition institutionPlanPosition = finalInstitutionPlan2.getPlanPositions().stream().filter(institutionPlanPosition1 -> institutionPlanPosition1.getCostType().equals(coordinatorPlanPosition.getCostType())).findFirst().get();
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
                        institutionFinancialPlanPositions.add(institutionPlanPosition);

                        InstitutionCoordinatorPlanPosition institutionCoordinatorPlanPosition = new InstitutionCoordinatorPlanPosition(financialPosition, institutionPlanPosition);

                        institutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                        institutionPlanPosition.setInstitutionCoordinatorPlanPositions(institutionCoordinatorPlanPositions.stream().collect(Collectors.toSet()));

                    });
                    institutionPlan.setPlanPositions(institutionFinancialPlanPositions.stream().collect(Collectors.toSet()));
                }
            } else if (action.equals("withdraw")) {
                //Update on withdraw coordinator plan
                List<InstitutionPlanPosition> removedInstitutionPlanPositions = new ArrayList<>();
                List<InstitutionCoordinatorPlanPosition> removedInstitutionCoordinatorPlanPositions = new ArrayList<>();
                institutionPlan.getPlanPositions().forEach(institutionPlanPosition -> institutionPlanPosition.getInstitutionCoordinatorPlanPositions().forEach(institutionCoordinatorPlanPosition -> {
                    if (coordinatorPlan.getPositions().contains(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition())) {
                        removedInstitutionCoordinatorPlanPositions.add(institutionCoordinatorPlanPosition);
                        institutionPlanPosition.setAmountRequestedNet(institutionPlanPosition.getAmountRequestedNet().subtract(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAmountRequestedNet()));
                        institutionPlanPosition.setAmountRequestedGross(institutionPlanPosition.getAmountRequestedGross().subtract(institutionCoordinatorPlanPosition.getCoordinatorPlanPosition().getAmountRequestedGross()));

                        if (institutionPlanPosition.getInstitutionCoordinatorPlanPositions().size() == 1) {
                            removedInstitutionPlanPositions.add(institutionPlanPosition);
                        }
                    }
                }));
                institutionCoordinatorPlanPositionRepository.deleteInBatch(removedInstitutionCoordinatorPlanPositions);
                institutionPlanPositionRepository.deleteInBatch(removedInstitutionPlanPositions);
            }
        }

        institutionPlanRepository.save(institutionPlan);
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
    public InstitutionPlan updatePlanStatus(final Long planId, final String action) {
        InstitutionPlan plan = institutionPlanRepository.findById(planId).orElseThrow(() -> new AppException("Accountant.institution.planNotFound", HttpStatus.NOT_FOUND));

        User user = Utils.getCurrentUser();

        List<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByStatusAndTypeAndYear(action.equals("approve") ?
                CoordinatorPlan.PlanStatus.RO : CoordinatorPlan.PlanStatus.AK, plan.getType(), plan.getYear());

        coordinatorPlans.forEach(coordinatorPlan -> {
            coordinatorPlan.setStatus(action.equals("approve") ? CoordinatorPlan.PlanStatus.AK : CoordinatorPlan.PlanStatus.RO);
            coordinatorPlan.setPlanAcceptUser(action.equals("approve") ? user : null);
        });

        coordinatorPlanRepository.saveAll(coordinatorPlans);
        plan.setApproveUser(action.equals("approve") ? user : null);
        plan.setStatus(action.equals("approve") ? InstitutionPlan.InstitutionPlanStatus.ZA : InstitutionPlan.InstitutionPlanStatus.UT);

        return institutionPlanRepository.save(plan);
    }

    private void setInstitutionPlanPositionAmountAwardedValues(InstitutionPlanPosition institutionPlanPosition) {
        institutionPlanPosition.setAmountAwardedNet(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        institutionPlanPosition.setAmountAwardedGross(institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().map(InstitutionCoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        institutionPlanPositionRepository.save(institutionPlanPosition);
    }


    private InstitutionPlan setPlanAmountValues(InstitutionPlan plan) {
        if (!plan.getPlanPositions().isEmpty()) {
            plan.setAmountRequestedGross(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setAmountAwardedGross(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountAwardedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setAmountRealizedGross(plan.getPlanPositions().stream().map(InstitutionPlanPosition::getAmountRealizedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
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

}
