package pl.viola.ems.controller.modules.accountant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.modules.accountant.CostTypeService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/accountant/costType")
public class CostTypeController {

    @Autowired
    CostTypeService costTypeService;

    @GetMapping("/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getCostTypeAll() {
        return new ApiResponse(HttpStatus.FOUND, costTypeService.findAll());
    }

    @GetMapping("/getByCoordinator/{year}/{coordinatorCode}")
    public ApiResponse getCostTypeByCoordinator(@PathVariable final int year, @PathVariable final String coordinatorCode) {
        return new ApiResponse(HttpStatus.FOUND, costTypeService.findByYearAndCoordinator(year, coordinatorCode));
    }

    @GetMapping("/getYears/{costId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getYearsByCostType(@PathVariable final long costId) {
        return new ApiResponse(HttpStatus.FOUND, costTypeService.findYearsByCostType(costId));
    }

    @PutMapping("/saveCostType")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2013')")
    public ApiResponse saveCostType(@RequestBody @Valid CostType costType) {
        return new ApiResponse(HttpStatus.CREATED, costTypeService.saveCostType(costType));
    }

    @DeleteMapping("/deleteCostType/{costId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3013')")
    public ApiResponse deleteCostType(@PathVariable Long costId) {
        return new ApiResponse(HttpStatus.ACCEPTED, costTypeService.deleteCostType(costId));
    }

    @PutMapping("/export/costTypes/{exportType}")
    public void exportCostTypesToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow,
                                      @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        costTypeService.exportCostTypesToExcel(exportType, headRow, generateExportResponse(response, exportType));
    }

    @PutMapping("/export/costTypeYears/{costId}/{exportType}")
    public void exportCostTypeYearsToXlsx(@RequestBody ArrayList<ExcelHeadRow> headRow, @PathVariable long costId,
                                          @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {

        costTypeService.exportCostTypeYearsToExcel(exportType, headRow, costId, generateExportResponse(response, exportType));
    }
}
