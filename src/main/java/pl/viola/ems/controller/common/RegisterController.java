package pl.viola.ems.controller.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.register.Register;
import pl.viola.ems.model.common.register.RegisterPosition;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.common.RegisterService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/register")
public class RegisterController {

    @Autowired
    RegisterService registerService;

    @GetMapping("/getRegisters")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1117')")
    public ApiResponse getRegisters() {
        return new ApiResponse(HttpStatus.FOUND, registerService.getRegisters("iod"));
    }

    @GetMapping("/{code}/getPositions")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1117')")
    public ApiResponse getRegisterPositions(@PathVariable String code) {
        return new ApiResponse(HttpStatus.FOUND, registerService.getRegisterPositions(code));
    }

    @GetMapping("{code}/getActivePositions")
    public ApiResponse getRegisterActivePositions(@PathVariable String code) {
        return new ApiResponse(HttpStatus.FOUND, registerService.getActivePositionsByRegister(code));
    }

    @PutMapping("/saveRegister")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('2117')")
    public ApiResponse saveRegister(@RequestBody @Valid Register register) {
        return new ApiResponse(HttpStatus.ACCEPTED, registerService.saveRegister(register));
    }

    @PutMapping("/{registerCode}/saveRegisterPosition")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('2117')")
    public ApiResponse saveRegisterPosition(@PathVariable String registerCode, @RequestBody @Valid RegisterPosition registerPosition) {
        return new ApiResponse(HttpStatus.ACCEPTED, registerService.saveRegisterPosition(registerCode, registerPosition));
    }

    @DeleteMapping("/{registerCode}/deleteRegisterPosition/{registerPositionId}")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('3117')")
    public ApiResponse deleteRegisterPosition(@PathVariable String registerCode, @PathVariable Long registerPositionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, registerService.deleteRegisterPosition(registerCode, registerPositionId));
    }
}
