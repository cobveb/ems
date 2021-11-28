package pl.viola.ems.controller.modules.publicProcurement.institution;

import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.publicProcurement.plans.institution.PublicInstitutionPlanService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;
import static pl.viola.ems.utils.Utils.generateJasperResponse;

@RestController
@RequestMapping("/api/public/institution/plans")
public class PublicInstitutionPlanController {
    @Autowired
    PublicInstitutionPlanService publicInstitutionPlanService;

    @GetMapping("/getPlans")
    //TODO: Doodać właściwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getInstitutionPlans() {
        return new ApiResponse(HttpStatus.FOUND, publicInstitutionPlanService.getPlans("publicProcurement"));
    }

    @GetMapping("/{planId}/getPlanPositions")
    //TODO: Doodać właściwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getInstitutionPlansPositions(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, publicInstitutionPlanService.getPlanPositions(planId));
    }

    @GetMapping("/plan/{positionId}/getSubPositions")
    //TODO: Doodać właściwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getInstitutionPlanSubPositions(@PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.FOUND, publicInstitutionPlanService.getPlanSubPositions(positionId));
    }

    @GetMapping("/plan/print/{planId}/{type}")
    public void printInstitutionPlan(@PathVariable Long planId, @PathVariable String type, HttpServletResponse response) throws JRException, SQLException, IOException {
        publicInstitutionPlanService.exportPlanToJasper(planId, type, generateJasperResponse(response, JasperExportType.PDF));
    }

    @PutMapping("/export/planPositions/{planId}/{exportType}")
    public void exportPlanPositionsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                          @PathVariable ExportType exportType, @PathVariable Long planId, HttpServletResponse response) throws IOException {

        publicInstitutionPlanService.exportPlanPositionsToExcel(exportType, planId, headRow, generateExportResponse(response, exportType));
    }
}
