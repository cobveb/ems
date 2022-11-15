package pl.viola.ems.service.common.impl;

import net.sf.jasperreports.engine.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.viola.ems.service.common.JasperPrintService;

import javax.sql.DataSource;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Service
public class JasperPrintServiceImpl implements JasperPrintService {
    @Autowired
    DataSource dataSource;

    @Override
    public JasperPrint exportPdf(final Long mainId, final String pathToReport) throws SQLException, FileNotFoundException, JRException {
        Connection connection = dataSource.getConnection();
        try {

            InputStream reportStream = getClass().getResourceAsStream(pathToReport);
            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("MAIN_ID", mainId);

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, connection);
            connection.close();
            return jasperPrint;
        } catch (Exception exception) {
            exception.printStackTrace();
            connection.close();
            return null;
        }
    }
}
