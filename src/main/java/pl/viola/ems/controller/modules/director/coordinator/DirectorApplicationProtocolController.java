package pl.viola.ems.controller.modules.director.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.publicProcurement.ApplicationProtocolService;

@RestController
@RequestMapping("/api/director/coordinator/publicProcurement/protocol")
public class DirectorApplicationProtocolController {

    @Autowired
    ApplicationProtocolService applicationProtocolService;

    @PutMapping("/approveProtocol/{protocolId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4115')")
    public ApiResponse approveProtocol(@PathVariable Long protocolId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationProtocolService.approveProtocol(protocolId, "director"));
    }
}
