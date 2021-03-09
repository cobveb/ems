package pl.viola.ems.service.modules.coordinator.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.*;
import pl.viola.ems.model.modules.coordinator.repository.CoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.coordinator.repository.CoordinatorPlanRepository;
import pl.viola.ems.model.modules.coordinator.repository.CoordinatorPlanSubPositionRepository;
import pl.viola.ems.payload.modules.accountant.CoordinatorPlanResponse;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.PlanService;
import pl.viola.ems.utils.Utils;

import java.math.BigDecimal;
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
    MessageSource messageSource;

    @Override
    public List<CoordinatorPlan> findByCoordinator() {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        return coordinatorPlanRepository.findByCoordinatorIn(coordinators);
    }

    @Override
    public <T extends CoordinatorPlanPosition> List<T> findPositionsByPlan(Long planId) {
        CoordinatorPlan plan = this.findPlanById(planId);
        return plan.getType().name().equals("FIN") ?
                (List<T>) financialPositionRepository.findByPlan(plan) :
                plan.getType().name().equals("PZP") ?
                        (List<T>) publicProcurementPositionRepository.findByPlan(plan) :
                        (List<T>) investmentPositionRepository.findByPlan(plan);
    }

    @Override
    public CoordinatorPlan findPlanById(Long planId) {
        return coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));
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

        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));
        plan.getPositions().forEach(position -> position.setStatus(
                newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? CoordinatorPlanPosition.PlanPositionStatus.WY : CoordinatorPlanPosition.PlanPositionStatus.ZP)
        );
        plan.setStatus(newStatus);
        plan.setSendDate(newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? new Date() : null);
        coordinatorPlanRepository.save(plan);

        return plan;
    }

    @Transactional
    @Override
    public String deletePlan(Long planId) {
        if (coordinatorPlanRepository.existsById(planId)) {
            coordinatorPlanRepository.deleteById(planId);
            return messageSource.getMessage("Coordinator.plan.deleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "Coordinator.plan.notFound");
        }
    }

    @Transactional
    @Override
    public CoordinatorPlanPosition savePlanPosition(CoordinatorPlanPosition position, final String action) {
        if (!position.getSubPositions().isEmpty()) {
            position.getSubPositions().forEach(posi -> posi.setPlanPosition(position));
        }


        return position.getPlan().getType().name().equals("FIN") ?
                financialPositionRepository.save((FinancialPosition) position) :
                position.getPlan().getType().name().equals("PZP") ?
                        publicProcurementPositionRepository.save((PublicProcurementPosition) position) :
                        investmentPositionRepository.save((InvestmentPosition) position);
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
                financialPositionRepository.delete(position);
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
    public List<CoordinatorPlanResponse> getPlansByCoordinatorInAccountant() {
        List<CoordinatorPlanResponse> plans = new ArrayList<>();

        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.WY,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.SK,
                CoordinatorPlan.PlanStatus.RE,
                CoordinatorPlan.PlanStatus.ZR
        );

        List<CoordinatorPlan.PlanType> types = Arrays.asList(
                CoordinatorPlan.PlanType.FIN,
                CoordinatorPlan.PlanType.INW
        );

        List<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByStatusInAndTypeIn(statuses, types);
        if (!coordinatorPlans.isEmpty()) {
            coordinatorPlans.forEach(coordinatorPlan -> {
                CoordinatorPlanResponse plan = new CoordinatorPlanResponse();
                plan.setId(coordinatorPlan.getId());
                plan.setYear(coordinatorPlan.getYear());
                plan.setStatus(coordinatorPlan.getStatus());
                plan.setType(coordinatorPlan.getType());
                plan.setCoordinator(coordinatorPlan.getCoordinator());
                plan.setPositions(coordinatorPlan.getPositions());

                plans.add(setPlanAmountValues(plan));
            });
        }
        return plans;
    }

    @Transactional
    @Override
    public String deleteSubPosition(CoordinatorPlanSubPosition subPosition, Long positionId) {
        if (subPosition instanceof FinancialSubPosition) {
            if (financialPositionRepository.existsById(positionId)) {
                financialSubPositionRepository.deleteById(subPosition.getId());
            } else {
                throw new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND);
            }
        } else if (subPosition instanceof PublicProcurementSubPosition) {
            if (publicProcurementPositionRepository.existsById(positionId)) {
                publicProcurementSubPositionRepository.deleteById(subPosition.getId());
            } else {
                throw new AppException("Coordinator.plan.position.notFound", HttpStatus.NOT_FOUND);
            }
        }
        return messageSource.getMessage("Coordinator.plan.position.deleteMsg", null, Locale.getDefault());
    }

    private CoordinatorPlanResponse setPlanAmountValues(CoordinatorPlanResponse plan) {
        if (!plan.getPositions().isEmpty()) {
            plan.setPlanAmountRequestedNet(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRequestedNet).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountRequestedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRequestedGross).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountAwardedNet(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountAwardedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return plan;
    }
}
