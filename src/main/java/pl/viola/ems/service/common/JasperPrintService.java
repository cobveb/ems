package pl.viola.ems.service.common;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperPrint;

import java.io.FileNotFoundException;
import java.sql.SQLException;

public interface JasperPrintService {
    JasperPrint exportPdf(Long mainId, String pathToReport) throws SQLException, FileNotFoundException, JRException;
}
