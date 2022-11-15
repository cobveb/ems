package pl.viola.ems.controller.modules.publicProcurement.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.publicProcurement.ApplicationProtocolService;

@RestController
@RequestMapping({"/api/public/coordinator/publicProcurement/protocol"})
public class PublicApplicationProtocolController {
    @Autowired
    ApplicationProtocolService applicationProtocolService;

    @GetMapping("/getAllProtocols")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1124')")
    public ApiResponse getAllProtocols() {
        return new ApiResponse(HttpStatus.FOUND, applicationProtocolService.getProtocolsByAccessLevel("public"));
    }

    @PutMapping({"/approveProtocol/{protocolId}"})
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2113')")
    public ApiResponse approveProtocol(@PathVariable Long protocolId) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.applicationProtocolService.approveProtocol(protocolId, "public"));
    }

    @PutMapping({"/sendBackProtocol/{protocolId}"})
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('2113', '4115', '2124')")
    public ApiResponse sendBackProtocol(@PathVariable Long protocolId) {
        return new ApiResponse(HttpStatus.ACCEPTED, this.applicationProtocolService.sendBackProtocol(protocolId));
    }
}
