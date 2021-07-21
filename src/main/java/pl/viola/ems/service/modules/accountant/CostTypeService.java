package pl.viola.ems.service.modules.accountant;

import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.model.modules.accountant.CostYear;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.payload.modules.accountant.CostTypeResponse;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public interface CostTypeService {
    List<CostTypeResponse> findAll();

    List<CostTypeResponse> findByYearAndCoordinator(int year, String coordinator);

    Set<CostYear> findYearsByCostType(long costId);

    CostType saveCostType(CostType costType);

    String deleteCostType(Long costId);

    void exportCostTypesToExcel(ExportType exportType, ArrayList<ExcelHeadRow> headRow, HttpServletResponse response) throws IOException;

    void exportCostTypeYearsToExcel(ExportType exportType, ArrayList<ExcelHeadRow> headRow, long costId, HttpServletResponse response) throws IOException;

}
