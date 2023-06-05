package pl.viola.ems.controller.modules.hr.employees;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.hr.employees.Employment;
import pl.viola.ems.model.modules.hr.employees.EmploymentAuthorization;
import pl.viola.ems.model.modules.hr.employees.EmploymentStatement;
import pl.viola.ems.model.modules.hr.employees.EmploymentWorkplace;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.hr.employees.EmploymentService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/hr/employees/employee/{employeeId}/employment")
public class EmploymentController {

    @Autowired
    EmploymentService employmentService;

    @GetMapping("/getEmployments")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1126')")
    public ApiResponse getEmployments(@PathVariable Long employeeId) {
        return new ApiResponse(HttpStatus.FOUND, employmentService.getEmploymentsByEmployee(employeeId));
    }

    @PutMapping("/saveEmployment")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2126')")
    public ApiResponse saveEmployment(@PathVariable Long employeeId, @RequestBody @Valid Employment employment) {
        return new ApiResponse(HttpStatus.CREATED, employmentService.saveEmployment(employeeId, employment));
    }

    @DeleteMapping("/{employmentId}/deleteEmployment")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3126')")
    public ApiResponse deleteEmployment(@PathVariable Long employeeId, @PathVariable Long employmentId) {
        return new ApiResponse(HttpStatus.ACCEPTED, employmentService.deleteEmployment(employeeId, employmentId));
    }

    @GetMapping("/{employmentId}/statement/getStatements")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1126')")
    public ApiResponse getEmploymentStatements(@PathVariable Long employeeId, @PathVariable Long employmentId) {
        return new ApiResponse(HttpStatus.FOUND, employmentService.getEmploymentStatements(employeeId, employmentId));
    }

    @PutMapping("/{employmentId}/statement/saveStatement")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2126')")
    public ApiResponse saveEmploymentStatement(@PathVariable Long employeeId, @PathVariable Long employmentId, @RequestBody @Valid EmploymentStatement statement) {
        return new ApiResponse(HttpStatus.CREATED, employmentService.saveEmploymentStatement(employeeId, employmentId, statement));
    }

    @DeleteMapping("/{employmentId}/statement/{statementId}/deleteStatement")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3126')")
    public ApiResponse deleteEmploymentStatement(@PathVariable Long employeeId, @PathVariable Long employmentId, @PathVariable Long statementId) {
        return new ApiResponse(HttpStatus.ACCEPTED, employmentService.deleteEmploymentStatement(employeeId, employmentId, statementId));
    }

    @GetMapping("/{employmentId}/authorization/getAuthorizations")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1126')")
    public ApiResponse getEmploymentAuthorizations(@PathVariable Long employeeId, @PathVariable Long employmentId) {
        return new ApiResponse(HttpStatus.FOUND, employmentService.getEmploymentAuthorizations(employeeId, employmentId));
    }

    @PutMapping("/{employmentId}/authorization/saveAuthorization")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2126')")
    public ApiResponse saveEmploymentAuthorization(@PathVariable Long employeeId, @PathVariable Long employmentId, @RequestBody @Valid EmploymentAuthorization authorization) {
        return new ApiResponse(HttpStatus.CREATED, employmentService.saveEmploymentAuthorization(employeeId, employmentId, authorization));
    }

    @DeleteMapping("/{employmentId}/authorization/{authorizationId}/deleteAuthorization")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3126')")
    public ApiResponse deleteEmploymentAuthorization(@PathVariable Long employeeId, @PathVariable Long employmentId, @PathVariable Long authorizationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, employmentService.deleteEmploymentAuthorization(employeeId, employmentId, authorizationId));
    }

    @GetMapping("/{employmentId}/workplace/getWorkplaces")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1126')")
    public ApiResponse getEmploymentWorkplaces(@PathVariable Long employeeId, @PathVariable Long employmentId) {
        return new ApiResponse(HttpStatus.FOUND, employmentService.getEmploymentWorkplaces(employeeId, employmentId));
    }

    @PutMapping("/{employmentId}/workplace/saveWorkplace")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2126')")
    public ApiResponse saveEmploymentWorkplace(@PathVariable Long employeeId, @PathVariable Long employmentId, @RequestBody @Valid EmploymentWorkplace workplace) {
        return new ApiResponse(HttpStatus.CREATED, employmentService.saveEmploymentWorkplace(employeeId, employmentId, workplace));
    }

    @DeleteMapping("/{employmentId}/workplace/{workplaceId}/deleteWorkplace")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3126')")
    public ApiResponse deleteEmploymentWorkplace(@PathVariable Long employeeId, @PathVariable Long employmentId, @PathVariable Long workplaceId) {
        return new ApiResponse(HttpStatus.ACCEPTED, employmentService.deleteEmploymentWorkplace(employeeId, employmentId, workplaceId));
    }
}
