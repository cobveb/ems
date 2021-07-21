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
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.*;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanPositionRepository;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanRepository;
import pl.viola.ems.model.modules.coordinator.plans.repository.CoordinatorPlanSubPositionRepository;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProcurementPlanPosition;
import pl.viola.ems.service.common.JasperPrintService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.coordinator.plans.PlanService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
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
    MessageSource messageSource;

    @Autowired
    JasperPrintService jasperPrintService;


    @Override
    public List<CoordinatorPlan> findByCoordinator() {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        List<CoordinatorPlan> plans = coordinatorPlanRepository.findByCoordinatorIn(coordinators);

        if (!plans.isEmpty()) {
            plans.forEach(this::setPlanAmountValues);
        }
        return plans;
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
    public List<PublicProcurementPosition> getPublicProcurementPositionByYear() {
        List<OrganizationUnit> coordinators = new ArrayList<>(Collections.singletonList(organizationUnitService.findCoordinatorByCode(
                Utils.getCurrentUser().getOrganizationUnit().getCode()
        ).orElseThrow(() -> new AppException("Coordinator.coordinator.notFound", HttpStatus.NOT_FOUND))));

        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.RE
        );

        coordinators.addAll(Utils.getChildesOu(coordinators.get(0).getCode()));

        CoordinatorPlan plan = coordinatorPlanRepository.findByYearAndCoordinatorInAndStatusIn(Year.now().getValue(),
                coordinators, statuses);

        return publicProcurementPositionRepository.findByPlan(plan);
    }

    @Override
    public Optional<PublicProcurementPosition> getPublicProcurementPositionById(Long positionId) {
        return publicProcurementPositionRepository.findById(positionId);
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

        User user = Utils.getCurrentUser();

        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));
        if (!newStatus.equals(CoordinatorPlan.PlanStatus.RO)) {
            plan.getPositions().forEach(position -> position.setStatus(
                    newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? CoordinatorPlanPosition.PlanPositionStatus.WY : CoordinatorPlanPosition.PlanPositionStatus.ZP)
            );
            plan.setSendDate(newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? new Date() : null);
            plan.setSendUser(newStatus.equals(CoordinatorPlan.PlanStatus.WY) ? user : null);
        } else {
            plan.setPlanAcceptUser(null);
        }
        plan.setStatus(newStatus);

        coordinatorPlanRepository.save(plan);

        return plan;
    }

    @Override
    public void updateInferredPositionValue(ApplicationProcurementPlanPosition planPosition) {
        System.out.println(planPosition);
        Optional<PublicProcurementPosition> position = publicProcurementPositionRepository.findById(planPosition.getId());
        position.get().setAmountInferredNet(planPosition.getAmountInferredNet());
        publicProcurementPositionRepository.save(position.get());
    }

    @Transactional
    @Override
    public CoordinatorPlan approvePlan(final Long planId, final ApprovePlanType approvePlanType) {
        CoordinatorPlan plan = coordinatorPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException("Coordinator.plan.notFound", HttpStatus.NOT_FOUND));

        User user = Utils.getCurrentUser();

        switch (approvePlanType) {
            case ACCOUNTANT:
                CoordinatorPlanPosition isCorrected = plan.getPositions().stream().filter(position -> CoordinatorPlanPosition.PlanPositionStatus.SK.equals(position.getStatus())).findFirst().orElse(null);
                if (isCorrected == null) {
                    plan.setStatus(CoordinatorPlan.PlanStatus.AK);
                } else {
                    plan.setStatus(CoordinatorPlan.PlanStatus.SK);
                }
                plan.setPlanAcceptUser(user);
                break;
            case PUBLIC_PROCUREMENT:
                plan.setStatus(CoordinatorPlan.PlanStatus.AZ);
                plan.setPlanAcceptUser(user);
                break;
            case DIRECTOR:
                plan.setStatus(CoordinatorPlan.PlanStatus.AD);
                plan.setDirectorAcceptUser(user);
                return coordinatorPlanRepository.save(plan);
            case CHIEF:
                plan.setStatus(CoordinatorPlan.PlanStatus.ZA);
                plan.setChiefAcceptUser(user);
                plan.getPositions().forEach(position -> position.setStatus(CoordinatorPlanPosition.PlanPositionStatus.ZA));
                return coordinatorPlanRepository.save(plan);
        }

        return setPlanAmountValues(coordinatorPlanRepository.save(plan));
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

        return setPlanAmountValues(coordinatorPlanRepository.save(coordinatorPlan));
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
    public List<CoordinatorPlan> getPlansByCoordinatorInAccountant() {
        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.WY,
                CoordinatorPlan.PlanStatus.AK,
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.RO,
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
            coordinatorPlans.forEach(this::setPlanAmountValues);
        }
        return coordinatorPlans;
    }

    @Override
    public List<CoordinatorPlan> getPlansByCoordinatorInPublicProcurement() {

        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.WY,
                CoordinatorPlan.PlanStatus.AZ,
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.RE,
                CoordinatorPlan.PlanStatus.ZR
        );

        List<CoordinatorPlan> coordinatorPlans = coordinatorPlanRepository.findByStatusInAndType(statuses, CoordinatorPlan.PlanType.PZP);
        if (!coordinatorPlans.isEmpty()) {
            coordinatorPlans.forEach(this::setPlanAmountValues);
        }
        return coordinatorPlans;
    }

    @Override
    public List<CoordinatorPlan> getPlansCoordinatorInDirector() {
        List<CoordinatorPlan.PlanStatus> statuses = Arrays.asList(
                CoordinatorPlan.PlanStatus.AZ,
                CoordinatorPlan.PlanStatus.AK,
                CoordinatorPlan.PlanStatus.SK,
                CoordinatorPlan.PlanStatus.ZA,
                CoordinatorPlan.PlanStatus.AD,
                CoordinatorPlan.PlanStatus.RE,
                CoordinatorPlan.PlanStatus.ZR
        );

        User user = Utils.getCurrentUser();
        List<CoordinatorPlan> coordinatorPlans = new ArrayList<>();

        if (user.getOrganizationUnit().getRole().equals(OrganizationUnit.Role.DIRECTOR)) {
            coordinatorPlans = coordinatorPlanRepository.findByStatusInAndCoordinatorIn(statuses, user.getOrganizationUnit().getDirectorCoordinators());
        } else if (user.getOrganizationUnit().getRole().equals(OrganizationUnit.Role.CHIEF) ||
                user.getGroups().stream().anyMatch(group -> group.getCode().equals("admin"))) {
            coordinatorPlans = coordinatorPlanRepository.findByStatusIn(statuses);
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

        List<CoordinatorPlan> plans;

        switch (accessLevel) {
            case "accountant":
                plans = getPlansByCoordinatorInAccountant();
                plans.forEach(plan -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", plan.getYear());
                    row.put("coordinator.name", plan.getCoordinator().getName());
                    row.put("planAmountRequestedGross", plan.getPlanAmountRequestedGross());
                    row.put("planAmountAwardedGross", plan.getPlanAmountAwardedGross());
                    row.put("planAmountRealizedGross", plan.getPlanAmountRealizedGross());
                    row.put("status.name", plan.getStatus().name());
                    rows.add(row);
                });
                break;
            case "coordinator":
                plans = findByCoordinator();
                plans.forEach(plan -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", plan.getYear());
                    row.put("type.name", plan.getType().name());
                    row.put("status.name", plan.getStatus().name());
                    rows.add(row);
                });
                break;
            case "director":
                plans = getPlansCoordinatorInDirector();
                plans.forEach(plan -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", plan.getYear());
                    row.put("type.name", plan.getType().name());
                    row.put("coordinator.name", plan.getCoordinator());
                    row.put("planAmountAwardedGross", plan.getPlanAmountAwardedGross());
                    row.put("status.name", plan.getStatus().name());
                    rows.add(row);
                });
                break;
            case "publicProcurement":
                plans = getPlansByCoordinatorInPublicProcurement();
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
//                    if(position.getAmountAwardedGross() != null) {
                    row.put("amountAwardedGross", position.getAmountAwardedGross());
//                    }
//                    if(position.getAmountRealizedGross() != null){
                    row.put("amountRealizedGross", position.getAmountRealizedGross());
//                    }
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
                    row.put("initiationTerm", position.getInitiationTerm());
                    rows.add(row);
                });
                break;

        }
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
        OutputStream outputStream = response.getOutputStream();
        JasperPrint jasperPrint = jasperPrintService.exportPdf(planId, "/jasper/prints/modules/coordinator/coordinatorPlanReport.jrxml");
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
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
            plan.setPlanAmountAwardedNet(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountAwardedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountAwardedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountAwardedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountRealizedNet(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRealizedNet).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
            plan.setPlanAmountRealizedGross(plan.getPositions().stream().map(CoordinatorPlanPosition::getAmountRealizedGross).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return plan;
    }
}
