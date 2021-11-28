package pl.viola.ems.service.modules.publicProcurement.plans.institution;

import net.sf.jasperreports.engine.JRException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlanSubPosition;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanPositionResponse;
import pl.viola.ems.payload.modules.publicProcurement.plans.PublicInstitutionPlanResponse;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public interface PublicInstitutionPlanService {

    List<PublicInstitutionPlanResponse> getPlans(String levelAccess);

    List<PublicInstitutionPlanPositionResponse> getPlanPositions(Long planId);

    List<CoordinatorPlanSubPosition> getPlanSubPositions(Long positionId);

    void exportPlanToJasper(Long planId, String type, HttpServletResponse response) throws IOException, JRException, SQLException;

    void exportPlanPositionsToExcel(ExportType exportType, Long planId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;
}
