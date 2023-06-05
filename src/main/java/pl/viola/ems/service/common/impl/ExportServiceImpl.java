package pl.viola.ems.service.common.impl;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import pl.viola.ems.payload.export.ExcelHeadRow;
import pl.viola.ems.service.common.ExportService;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

@Service
public class ExportServiceImpl implements ExportService {
    private XSSFSheet sheet;
    private XSSFWorkbook xlsxWorkbook;

    private void writeExcelHeaderLine(ArrayList<ExcelHeadRow> head) {
        sheet = xlsxWorkbook.createSheet("Dane");

        Row row = sheet.createRow(0);

        CellStyle style = xlsxWorkbook.createCellStyle();
        XSSFFont font = xlsxWorkbook.createFont();
        font.setBold(true);
        font.setFontHeight(12);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);

        createCell(row, 0, "Lp.", style, null, null);
        for (int counter = 0; counter < head.size(); counter++) {
            createCell(row, counter + 1, head.get(counter).getLabel(), style, null, null);
        }
    }

    private void writeDataLines(ArrayList<ExcelHeadRow> headRows, ArrayList<Map<String, Object>> dataRows) {
        int rowCount = 1;

        CellStyle style = xlsxWorkbook.createCellStyle();
        XSSFFont font = xlsxWorkbook.createFont();
        font.setFontHeight(12);
        style.setFont(font);

        for (Map<String, Object> dataRow : dataRows) {
            Row row = sheet.createRow(rowCount++);
            createCell(row, 0, rowCount - 1, style, "numeric", null);
            for (int counter = 0; counter < headRows.size(); counter++) {
                createCell(row, counter + 1, dataRow.get(headRows.get(counter).getId()), style, headRows.get(counter).getType(), headRows.get(counter).getDateFormat());
            }
        }
    }

    private void createCell(Row row, int columnCount, Object value, CellStyle style, String cellType, String dateFormat) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (cellType != null) {
            switch (cellType) {
                case "amount":
                    double amount;
                    CellStyle amountStyle = xlsxWorkbook.createCellStyle();
                    amountStyle.setDataFormat(xlsxWorkbook.createDataFormat().getFormat("0.00"));
                    DecimalFormatSymbols symbols = new DecimalFormatSymbols();
                    symbols.setDecimalSeparator('.');
                    symbols.setGroupingSeparator(' ');
                    String pattern = "#,##0.00";
                    DecimalFormat decimalFormat = new DecimalFormat(pattern, symbols);
                    decimalFormat.setParseBigDecimal(true);

                    try {
                        if (value != null) {
                            amount = decimalFormat.parse(value.toString()).doubleValue();
                            cell.setCellValue(amount);
                        } else {
                            cell.setCellValue((String) null);
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    cell.setCellStyle(amountStyle);
                    break;
                case "date":
                    CellStyle dateStyle = xlsxWorkbook.createCellStyle();
                    dateStyle.setDataFormat((short) 14);

                    SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);

                    String dateStr = null;

                    if (value instanceof Date) {
                        dateStr = formatter.format((Date) value);
                    } else {
                        try {
                            Date date = formatter.parse(value.toString());
                            dateStr = formatter.format(date);

                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                    }
                    cell.setCellStyle(dateStyle);
                    cell.setCellValue(dateStr);
                    break;
                case "numeric":
                    cell.setCellValue((Integer) value);
                    break;
                default:
                    if (value != null) {
                        cell.setCellValue(value.toString());
                    }
                    cell.setCellStyle(style);
                    break;
            }
        } else {
            cell.setCellValue((String) value);
            cell.setCellStyle(style);
        }
    }

    @Override
    public void exportToXlsx(ArrayList<ExcelHeadRow> headRow, ArrayList<Map<String, Object>> dataRows, HttpServletResponse response) throws IOException {
        xlsxWorkbook = new XSSFWorkbook();

        writeExcelHeaderLine(headRow);
        writeDataLines(headRow, dataRows);

        ServletOutputStream outputStream = response.getOutputStream();
        xlsxWorkbook.write(outputStream);
        xlsxWorkbook.close();

        outputStream.close();
    }

    //TODO: dodać eksport do xls
    @Override
    public void exportToXls(ArrayList<ExcelHeadRow> headRow, ArrayList<Map<String, Object>> dataRows, HttpServletResponse response) throws IOException {
        HSSFWorkbook xlsWorkbook = new HSSFWorkbook();

        writeExcelHeaderLine(headRow);
        writeDataLines(headRow, dataRows);

        ServletOutputStream outputStream = response.getOutputStream();
        xlsxWorkbook.write(outputStream);
        xlsxWorkbook.close();

        outputStream.close();

    }
}
