package pl.viola.ems.controller.modules.accountant.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.publicProcurement.ApplicationProtocolService;

@RestController
@RequestMapping("/api/accountant/coordinator/publicProcurement/protocol")
public class AccountantApplicationProtocolController {

    @Autowired
    ApplicationProtocolService applicationProtocolService;

    @GetMapping("/{year}/getAllProtocols")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1124', '1115')")
    public ApiResponse getAllProtocols(@PathVariable int year) {
        return new ApiResponse(HttpStatus.FOUND, applicationProtocolService.getProtocolsByAccessLevel(year, "accountant"));
    }

    @PutMapping("/approveProtocol/{protocolId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2124')")
    public ApiResponse approveProtocol(@PathVariable Long protocolId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationProtocolService.approveProtocol(protocolId, "accountant"));
    }

}
