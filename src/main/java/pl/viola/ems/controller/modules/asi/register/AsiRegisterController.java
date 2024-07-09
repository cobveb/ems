package pl.viola.ems.controller.modules.asi.register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.asi.register.AsiRegisterService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

import static pl.viola.ems.utils.Utils.generateExportResponse;

@RestController
@RequestMapping("/api/asi/register")
public class AsiRegisterController {
    @Autowired
    AsiRegisterService asiRegisterService;

    @PostMapping("/getRegistersPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1138')")
    public ApiResponse getAllDictionaryRegisters(@RequestBody @Valid SearchConditions conditions) {
        return new ApiResponse(HttpStatus.FOUND, asiRegisterService.getRegistersPositions(conditions, false));
    }

    @PutMapping("/export/{exportType}")
    public void exportRegistersToXlsx(@RequestBody ExportConditions exportConditions,
                                      @PathVariable ExportType exportType, HttpServletResponse response) throws IOException {
        asiRegisterService.exportRegistersToExcel(exportType, exportConditions, generateExportResponse(response, exportType));
    }
}
