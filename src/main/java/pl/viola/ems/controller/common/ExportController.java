package pl.viola.ems.controller.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.common.ExportService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    @Autowired
    ExportService exportService;


    @PutMapping("/xlsx")
    public void exportToXlsx(@RequestBody ArrayList<ExcelHeadRow> head, HttpServletResponse response) throws IOException {

        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=export_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);

        exportService.exportToXlsx(head, null, response);
    }
}
