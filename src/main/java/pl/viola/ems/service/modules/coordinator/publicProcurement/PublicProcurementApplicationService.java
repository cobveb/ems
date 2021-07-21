package pl.viola.ems.service.modules.coordinator.publicProcurement;

import net.sf.jasperreports.engine.JRException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationAssortmentGroup;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationCriterion;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationPart;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProcurementPlanPosition;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public interface PublicProcurementApplicationService {

    List<ApplicationProcurementPlanPosition> getPlanPositionByYear();

    List<Application> getApplicationsByCoordinator();

    Application saveApplication(Application application, String action, User principal);

    Application saveApplicationAssortmentGroup(Long applicationId, ApplicationAssortmentGroup applicationAssortmentGroup, String action);

    Application deleteApplicationAssortmentGroup(Long applicationAssortmentGroupId);

    ApplicationPart saveApplicationPart(Long applicationId, ApplicationPart applicationPart, String action);

    String deleteApplicationPart(Long applicationPartId);

    ApplicationCriterion saveApplicationCriterion(Long applicationId, ApplicationCriterion applicationCriterion, String action);

    String deleteApplicationCriterion(Long applicationCriterionId);

    Application updateApplicationStatus(Long applicationId, Application.ApplicationStatus newStatus);

    void exportApplicationsToExcel(ExportType exportType, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportApplicationToJasper(Long applicationId, HttpServletResponse response) throws IOException, JRException, SQLException;

}
