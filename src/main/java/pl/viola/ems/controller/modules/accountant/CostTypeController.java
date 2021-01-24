package pl.viola.ems.controller.modules.accountant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.accountant.CostType;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.accountant.CostTypeService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/accountant/costType")
public class CostTypeController {

    @Autowired
    CostTypeService costTypeService;

    @GetMapping("/getAll")
    //TODO: Dodać własciwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getCostTypeAll() {
        return new ApiResponse(HttpStatus.FOUND, costTypeService.findAll());
    }

    @GetMapping("/getByCoordinator/{year}/{coordinatorCode}")
    public ApiResponse getCostTypeByCoordinator(@PathVariable final int year, @PathVariable final String coordinatorCode) {
        return new ApiResponse(HttpStatus.FOUND, costTypeService.findByYearAndCoordinator(year, coordinatorCode));
    }


    @GetMapping("/getYears/{costId}")
    //TODO: Dodać własciwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getYearsByCostType(@PathVariable final long costId) {
        return new ApiResponse(HttpStatus.FOUND, costTypeService.findYearsByCostType(costId));
    }

    @PutMapping("/saveCostType")
    //TODO: Dodać własciwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2013')")
    public ApiResponse saveCostType(@RequestBody @Valid CostType costType) {
        return new ApiResponse(HttpStatus.CREATED, costTypeService.saveCostType(costType));
    }

    @DeleteMapping("/deleteCostType/{costId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3013')")
    public ApiResponse deleteCostType(@PathVariable Long costId) {
        return new ApiResponse(HttpStatus.ACCEPTED, costTypeService.deleteCostType(costId));
    }
}
