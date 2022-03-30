package pl.viola.ems.controller.modules.coordinator.publicProcurement;

import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.export.JasperExportType;
import pl.viola.ems.model.modules.coordinator.publicProcurement.ApplicationProtocol;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationProtocolPayload;
import pl.viola.ems.service.modules.coordinator.publicProcurement.ApplicationProtocolService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.sql.SQLException;

import static pl.viola.ems.utils.Utils.generateJasperResponse;

@RestController
@RequestMapping("/api/coordinator/publicProcurement/protocol")
public class ApplicationProtocolController {
    @Autowired
    ApplicationProtocolService applicationProtocolService;

    @GetMapping("/getProtocolByApplication/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1032')")
    public ApiResponse getProtocolByApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.FOUND, applicationProtocolService.getProtocolByApplication(applicationId));
    }

    @PutMapping("/save")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse saveApplicationProtocol(@RequestBody @Valid ApplicationProtocolPayload protocol) {
        return new ApiResponse(HttpStatus.CREATED, applicationProtocolService.saveProtocol(protocol));
    }

    @PutMapping("/saveByApplication/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse saveProtocolByApplication(@PathVariable Long applicationId, @RequestBody @Valid ApplicationProtocolPayload protocol) {
        return new ApiResponse(HttpStatus.CREATED, applicationProtocolService.saveProtocol(protocol, applicationId));
    }

    @DeleteMapping("/deleteProtocol/{protocolId}")
    /* At the moment, the functionality used by services, no GUI functionality. Needless to add, a privilege */
    public ApiResponse deleteApplicationProtocol(@PathVariable Long protocolId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationProtocolService.deleteApplicationProtocol(protocolId));
    }

    @DeleteMapping("{protocolId}/deleteProtocolPrice/{priceId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse deleteApplicationProtocolPrice(@PathVariable Long protocolId, @PathVariable Long priceId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationProtocolService.deleteApplicationProtocolPrice(protocolId, priceId));
    }

    @PutMapping("/sendProtocol/{protocolId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2032')")
    public ApiResponse sendProtocol(@PathVariable Long protocolId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationProtocolService.updateProtocolStatus(protocolId, ApplicationProtocol.ProtocolStatus.WY));
    }

    @GetMapping("/print/{protocolId}")
    public void generatePlan(@PathVariable Long protocolId, HttpServletResponse response) throws JRException, SQLException, IOException {
        applicationProtocolService.exportProtocolToJasper(protocolId, generateJasperResponse(response, JasperExportType.PDF));
    }
}
