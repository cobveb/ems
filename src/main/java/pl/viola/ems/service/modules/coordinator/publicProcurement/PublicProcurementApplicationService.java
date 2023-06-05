package pl.viola.ems.service.modules.coordinator.publicProcurement;

import net.sf.jasperreports.engine.JRException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.publicProcurement.*;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationDetailsPayload;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPayload;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPlanPosition;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProcurementPlanPosition;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public interface PublicProcurementApplicationService {

    List<ApplicationProcurementPlanPosition> getApplicationProcurementPlanPosition();

    List<ApplicationPlanPosition> getPlanPositionByYearAndPlanType(CoordinatorPlan.PlanType planType);

    Set<ApplicationPayload> getApplicationsByCoordinator(int year);

    Set<ApplicationPayload> getApplicationsByCoordinatorInRealization();

    Set<ApplicationPayload> getApplicationsByAccessLevel(int year, String accessLevel);

    ApplicationDetailsPayload getApplication(Long applicationId);

    ApplicationDetailsPayload saveApplication(ApplicationDetailsPayload application, String action, User principal);

    ApplicationDetailsPayload saveApplicationAssortmentGroup(Long applicationId, ApplicationAssortmentGroup applicationAssortmentGroup, String action);

    ApplicationAssortmentGroup saveAssortmentGroupSubsequentYear(Long assortmentGroupPlanPositionId, AssortmentGroupSubsequentYear assortmentGroupSubsequentYear, String action);

    ApplicationAssortmentGroup deleteAssortmentGroupSubsequentYear(Long assortmentGroupId, Long subsequentYearId);

    ApplicationDetailsPayload deleteApplicationAssortmentGroup(Long applicationAssortmentGroupId);

    ApplicationDetailsPayload deleteApplicationAssortmentGroupPlanPosition(Long planPositionId);

    ApplicationPart saveApplicationPart(Long applicationId, ApplicationPart applicationPart, String action);

    String deleteApplicationPart(Long applicationPartId);

    ApplicationCriterion saveApplicationCriterion(Long applicationId, ApplicationCriterion applicationCriterion, String action);

    String deleteApplicationCriterion(Long applicationCriterionId);

    ApplicationDetailsPayload updateApplicationStatus(Long applicationId, Application.ApplicationStatus newStatus);

    ApplicationDetailsPayload confirmRealization(Long applicationId);

    ApplicationDetailsPayload rollbackPartRealization(Long applicationId, Set<ApplicationPart> parts);

    ApplicationDetailsPayload rollbackRealization(Long applicationId);

    String deleteApplication(Long applicationId);

    void exportApplicationsToExcel(ExportType exportType, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response, String accessLevel) throws IOException;

    void exportApplicationsPartsToExcel(ExportType exportType, Long applicationId, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportApplicationToJasper(Long applicationId, HttpServletResponse response) throws IOException, JRException, SQLException;

}
