package pl.viola.ems.controller.modules.hr.employees;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.hr.employees.EmployeeService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/hr/employees/employee")
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;

    @GetMapping("/getEmployees")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1126')")
    public ApiResponse getEmployees() {
        return new ApiResponse(HttpStatus.FOUND, employeeService.getEmployees());
    }

    @PutMapping("/saveEmployee")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2126')")
    public ApiResponse saveEmployee(@RequestBody @Valid Employee employee) {
        return new ApiResponse(HttpStatus.CREATED, employeeService.saveEmployee(employee));
    }

    @DeleteMapping("/{employeeId}/deleteEmployee")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3126')")
    public ApiResponse deleteEmployee(@PathVariable Long employeeId) {
        return new ApiResponse(HttpStatus.ACCEPTED, employeeService.deleteEmployee(employeeId));
    }
}
