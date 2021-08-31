package pl.viola.ems.controller.modules.accountant.institution;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.accountant.institution.plans.InstitutionCoordinatorPlanPosition;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.accountant.institution.InstitutionPlanService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/accountant/institution/plans")
public class InstitutionPlanController {

    @Autowired
    InstitutionPlanService institutionPlanService;

    @GetMapping("/getPlans")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1034')")
    public ApiResponse getInstitutionPlans() {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getPlans());
    }

    @GetMapping("/getPlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1034')")
    public ApiResponse getInstitutionPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getPlan(planId));
    }

    @GetMapping("/getCoordinatorPlanPosition/{positionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1034')")
    public ApiResponse getCoordinatorPlanPosition(@PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getCoordinatorPlanPositions(positionId));
    }

    @PutMapping("/acceptPlanPositions/{planType}/{positionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2034')")
    public ApiResponse acceptPlanPositions(@RequestBody @Valid List<InstitutionCoordinatorPlanPosition> positions, @PathVariable String planType, @PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.CREATED, institutionPlanService.updatePlanPositions(positions, planType.equals("FIN") ? CoordinatorPlan.PlanType.FIN : CoordinatorPlan.PlanType.INW, positionId, "accept"));
    }

    @PutMapping("/correctPlanPositions/{planType}/{positionId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2034')")
    public ApiResponse correctPlanPositions(@RequestBody @Valid List<InstitutionCoordinatorPlanPosition> positions, @PathVariable String planType, @PathVariable Long positionId) {
        return new ApiResponse(HttpStatus.CREATED, institutionPlanService.updatePlanPositions(positions, planType.equals("FIN") ? CoordinatorPlan.PlanType.FIN : CoordinatorPlan.PlanType.INW, positionId, "correct"));
    }

    @PutMapping("/approvePlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('3034')")
    public ApiResponse approveAccountantPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, institutionPlanService.updatePlanStatus(planId, "approve"));
    }

    @PutMapping("/withdrawPlan/{planId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4034')")
    public ApiResponse withdrawAccountantPlan(@PathVariable Long planId) {
        return new ApiResponse(HttpStatus.ACCEPTED, institutionPlanService.updatePlanStatus(planId, "withdraw"));
    }
}
