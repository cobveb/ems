package pl.viola.ems.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.common.ExportService;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;
import pl.viola.ems.service.modules.administrator.UserService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
}
