package pl.viola.ems.service.modules.publicProcurement.plans.institution;

import net.sf.jasperreports.engine.JRException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanSubPosition;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanPositionRequest;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanPositionResponse;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanResponse;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public interface PublicInstitutionPlanService {

    List<PublicInstitutionPlanResponse> getPlans(String levelAccess);

    Set<InstitutionPlanPosition> getPlanPositions(Long planId);

    List<PublicInstitutionPlanPositionResponse> getPlanPublicPositions(Long positionId);

    List<CoordinatorPlanSubPosition> getPlanSubPositions(Long positionId);

    String correctPlanSubPositions(PublicInstitutionPlanPositionRequest institutionPlanPositionRequest);

    String approvePlanPosition(Long positionId);

    InstitutionPlan.InstitutionPlanStatus updatePlanStatus(Long planId, String actions);

    void updateInstitutionPublicProcurementPlan(CoordinatorPlan plan);

    void exportPlanToJasper(Long planId, String type, HttpServletResponse response) throws IOException, JRException, SQLException;

    void exportPlanPositionsToExcel(ExportType exportType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;
}
