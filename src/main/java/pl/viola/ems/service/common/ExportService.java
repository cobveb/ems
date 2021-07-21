package pl.viola.ems.service.common;

import pl.viola.ems.payload.export.ExcelHeadRow;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

public interface ExportService {

    void exportToXlsx(ArrayList<ExcelHeadRow> head, ArrayList<Map<String, Object>> data, HttpServletResponse response) throws IOException;

    void exportToXls(ArrayList<ExcelHeadRow> head, ArrayList<Map<String, Object>> data, HttpServletResponse response) throws IOException;
}
