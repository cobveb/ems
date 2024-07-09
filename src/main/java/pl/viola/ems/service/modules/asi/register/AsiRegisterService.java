package pl.viola.ems.service.modules.asi.register;

import org.springframework.data.domain.Page;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.asi.register.AsiRegisterPosition;
import pl.viola.ems.payload.export.ExportConditions;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface AsiRegisterService {
    Page<AsiRegisterPosition> getRegistersPositions(SearchConditions conditions, boolean isExport);

    void exportRegistersToExcel(ExportType exportType, ExportConditions exportConditions, HttpServletResponse response) throws IOException;

}
