package pl.viola.ems.service.modules.coordinator.plans;

import net.sf.jasperreports.engine.JRException;
import pl.viola.ems.model.common.coordinatorPlan.ApprovePlanType;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.*;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProcurementPlanPosition;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface PlanService {
    List<CoordinatorPlan> findByCoordinator();

    <T extends CoordinatorPlanPosition> List<T> findPositionsByPlan(Long planId);

    List<PublicProcurementPosition> getPublicProcurementPositionByYear();

    Optional<PublicProcurementPosition> getPublicProcurementPositionById(Long positionId);

    CoordinatorPlan findPlanById(Long planId);

    CoordinatorPlan savePlan(CoordinatorPlan plan, String action, User principal);

    CoordinatorPlan updatePlanStatus(Long planId, CoordinatorPlan.PlanStatus newStatus);

    void updateInferredPositionValue(ApplicationProcurementPlanPosition planPosition);

    CoordinatorPlan approvePlan(Long planId, ApprovePlanType approvePlanType);

    String deletePlan(Long planId);

    CoordinatorPlanPosition savePlanPosition(CoordinatorPlanPosition position, String action);

    CoordinatorPlan updatePlanPositionsByAccountant(List<FinancialPosition> positions, Long planId);

    String deletePlanPosition(Long planId, Long planPositionId);

    List<CoordinatorPlan> getPlansByCoordinatorInAccountant();

    List<CoordinatorPlan> getPlansByCoordinatorInPublicProcurement();

    List<CoordinatorPlan> getPlansCoordinatorInDirector();

    CoordinatorPlanPosition deleteSubPosition(CoordinatorPlanSubPosition subPosition, Long positionId);

    void exportPlansToExcel(ExportType exportType, String accessLevel, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportPlanPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportSubPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long positionId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportPlanToJasper(Long planId, HttpServletResponse response) throws IOException, JRException, SQLException;
}