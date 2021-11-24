package pl.viola.ems.service.modules.accountant.institution;

import net.sf.jasperreports.engine.JRException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.FinancialPosition;
import pl.viola.ems.payload.export.ExcelHeadRow;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public interface InstitutionPlanService {

    List<InstitutionPlan> getPlans(String levelAccess);

    InstitutionPlan getPlan(Long planId);

    List<InstitutionCoordinatorPlanPosition> getCoordinatorPlanPositions(Long positionId);

    List<InstitutionCoordinatorPlanPosition> updatePlanPositions(List<InstitutionCoordinatorPlanPosition> positions, CoordinatorPlan.PlanType planType, Long positionId, String action);

    void updateInstitutionPlan(CoordinatorPlan coordinatorPlan, String action);

    void updateInstitutionPlanPositions(List<FinancialPosition> positions);

    InstitutionPlan updatePlanStatus(Long planId, String action, String levelAccess);

    boolean disableWithdrawInstitutionPlan(Long planId);

    void exportPlanToJasper(Long planId, HttpServletResponse response) throws IOException, JRException, SQLException;

    void exportPlansToExcel(ExportType exportType, String accessLevel, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportPlanPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportPlanSubPositionsToExcel(ExportType exportType, CoordinatorPlan.PlanType planType, Long positionId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

}
