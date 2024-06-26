package pl.viola.ems.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlan;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionPlanPosition;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.hr.employees.Employment;
import pl.viola.ems.model.modules.hr.employees.EmploymentWorkplace;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.common.ExportService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.administrator.UserService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class Utils {

    private static UserService userService;

    private static OrganizationUnitService organizationUnitService;

    private static ExportService exportService;

    @Autowired
    public Utils(UserService userService, OrganizationUnitService organizationUnitService, ExportService exportService) {
        Utils.userService = userService;
        Utils.organizationUnitService = organizationUnitService;
        Utils.exportService = exportService;
    }


    public static User getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(principal.getUsername())
                .orElseThrow(() -> new AppException("Administrator.user.notFound", HttpStatus.NOT_FOUND));
    }

    //TODO: Zmienić ApplicantServiceImpl -> findChildOu na poniższą metodę
    public static List<OrganizationUnit> getChildesOu(final String parent) {

        List<OrganizationUnit> childesOU = new ArrayList<>(organizationUnitService.findByParent(parent));
        List<OrganizationUnit> tmp = new ArrayList<>();
        if (!childesOU.isEmpty()) {
            childesOU.forEach(ou -> {
                if (!getChildesOu(ou.getCode()).isEmpty()) {
                    tmp.addAll(getChildesOu(ou.getCode()));
                }
            });
            childesOU.addAll(tmp);
        }
        return childesOU;
    }

    public static HttpServletResponse generateExportResponse(final HttpServletResponse response, final ExportType exportType) {
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=export_" + currentDateTime + "." + exportType.name().toLowerCase();
        response.setHeader(headerKey, headerValue);
        return response;
    }

    public static void generateExcelExport(ExportType exportType, ArrayList<ExcelHeadRow> headRow, ArrayList<Map<String, Object>> dataRows, HttpServletResponse response) throws IOException {
        if (exportType.equals(ExportType.XLSX)) {
            exportService.exportToXlsx(headRow, dataRows, response);
        } else if (exportType.equals(ExportType.XLS)) {
            exportService.exportToXls(headRow, dataRows, response);
        }
    }

    public static HttpServletResponse generateJasperResponse(final HttpServletResponse response, final JasperExportType jasperExportType) {
        response.setContentType("application/x-download");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=export_" + currentDateTime + "." + jasperExportType.name().toLowerCase();
        response.setHeader(headerKey, headerValue);

        return response;

    }

    public static BigDecimal getArt30percent(BigDecimal amountRealized, BigDecimal amountRealizedArt30) {

        if (amountRealized == null || amountRealized.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        } else if (amountRealizedArt30 == null) {
            return BigDecimal.ZERO;
        } else {
            return amountRealizedArt30.divide(amountRealized, 2, RoundingMode.HALF_DOWN).multiply(new BigDecimal(100));
        }
    }

    public static boolean existsPlanToApprove(InstitutionPlan institutionPlan, String status) {
        boolean existPlanToApprove = false;
        for (InstitutionPlanPosition institutionPlanPosition : institutionPlan.getPlanPositions()) {
            InstitutionCoordinatorPlanPosition position = institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().filter(
                    institutionCoordinatorPlanPosition ->
                            institutionCoordinatorPlanPosition.getPlanStatus().equals(status)
            ).findAny().orElse(null);
            if (position != null) {
                existPlanToApprove = true;
                break;
            }
        }
        return existPlanToApprove;
    }

    public static boolean existsEconomicApprovePlan(InstitutionPlan institutionPlan) {
        boolean existsEconomicApprovePlan = false;

        for (InstitutionPlanPosition institutionPlanPosition : institutionPlan.getPlanPositions()) {
            InstitutionCoordinatorPlanPosition position = institutionPlanPosition.getInstitutionCoordinatorPlanPositions().stream().filter(
                    institutionCoordinatorPlanPosition ->
                            institutionCoordinatorPlanPosition.getPlanStatus().equals("AE") || institutionCoordinatorPlanPosition.getPlanStatus().equals("AD")
            ).findAny().orElse(null);
            if (position != null) {
                existsEconomicApprovePlan = true;
                break;
            }
        }

        return existsEconomicApprovePlan;
    }

    public static String generateEmployeeEmploymentWorkplaceList(final Employment employment, final Set<EmploymentWorkplace> workplaces) {

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        String dateTo = employment.getDateTo() == null ? " " : formatter.format(employment.getDateTo());
        String dateFrom = employment.getDateFrom() == null ? " " : formatter.format(employment.getDateFrom());
        String workplaceList = dateFrom + " - " + dateTo + "; ";
        for (EmploymentWorkplace employmentWorkplace : workplaces) {
            workplaceList += employmentWorkplace.getWorkplace().getName().substring(0, employmentWorkplace.getWorkplace().getName().indexOf("-")) + " - " + employmentWorkplace.getPlace().getItemName() + "; ";
        }

        return workplaceList;
    }
}
