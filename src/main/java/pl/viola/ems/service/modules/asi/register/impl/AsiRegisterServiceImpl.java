package pl.viola.ems.service.modules.asi.register.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.asi.employee.repository.EntitlementRepository;
import pl.viola.ems.model.modules.asi.register.AsiRegisterPosition;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.asi.register.AsiRegisterService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class AsiRegisterServiceImpl implements AsiRegisterService {
    @Autowired
    EntitlementRepository entitlementRepository;

    @Override
    public Page<AsiRegisterPosition> getRegistersPositions(final SearchConditions searchConditions, final boolean isExport) {

        return entitlementRepository.findRegistersPositionsPageable(searchConditions.getConditions(), PageRequest.of(
                searchConditions.getPage(),
                searchConditions.getRowsPerPage(),
                searchConditions.getSort().getOrderType() != null ? searchConditions.getSort().getOrderType().equals("desc") ?
                        Sort.by(searchConditions.getSort().getOrderBy()).descending() : Sort.by(searchConditions.getSort().getOrderBy()).ascending() : Sort.by("id")
        ), isExport);
    }

    @Override
    public void exportRegistersToExcel(final ExportType exportType, final ExportConditions exportConditions, final HttpServletResponse response) throws IOException {

        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        this.getRegistersPositions(exportConditions.getSearchConditions(), true).getContent().forEach(register -> {
            Map<String, Object> row = new HashMap<>();
            row.put("register", register.getRegister());
            row.put("employee", register.getEmployee());
            row.put("username", register.getUsername());
            row.put("entitlementSystem", register.getEntitlementSystem());
            row.put("entitlementSystemPermission", register.getEntitlementSystemPermission());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, exportConditions.getHeadRows(), rows, response);
    }
}
