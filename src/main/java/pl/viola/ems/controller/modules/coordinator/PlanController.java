package pl.viola.ems.controller.modules.coordinator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.CoordinatorPlanPosition;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.coordinator.PlanService;
import pl.viola.ems.utils.Utils;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/coordinator")
public class PlanController {
    @Autowired
    PlanService planService;

    @GetMapping("/plans/getAll")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1022')")
    public ApiResponse getPlansByCoordinator() {
        return new ApiResponse(HttpStatus.FOUND, planService.findByCoordinator());
    }

    @GetMapping("/plan/{planId}/getPositions")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1022')")
    public ApiResponse getPositionsByPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, planService.findPositionsByPlan(planId));
    }

    @PutMapping("/plan/{action}/savePlan")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse savePlan(@RequestBody @Valid CoordinatorPlan plan, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, planService.savePlan(plan, action, Utils.getCurrentUser()));
    }

    @PutMapping("/plan/send/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4022')")
    public ApiResponse sendPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.updatePlanStatus(planId, CoordinatorPlan.PlanStatus.WY));
    }

    @PutMapping("/plan/withdraw/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5022')")
    public ApiResponse withdrawPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.updatePlanStatus(planId, CoordinatorPlan.PlanStatus.ZP));
    }

    @DeleteMapping("/plan/deletePlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deletePlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.deletePlan(planId));
    }

    @PutMapping("/plan/{planId}/{action}/savePlanPosition")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2022')")
    public ApiResponse savePlanPosition(@RequestBody CoordinatorPlanPosition position, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, planService.savePlanPosition(position, action, Utils.getCurrentUser()));
    }

    @DeleteMapping("/plan/{planId}/deletePlanPosition/{planPositionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3022')")
    public ApiResponse deletePlanPosition(@PathVariable Long planId, @PathVariable Long planPositionId) {
        return new ApiResponse(HttpStatus.ACCEPTED, planService.deletePlanPosition(planId, planPositionId));
    }
}
