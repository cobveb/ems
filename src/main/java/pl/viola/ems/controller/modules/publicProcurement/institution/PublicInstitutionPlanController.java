package pl.viola.ems.controller.modules.publicProcurement.institution;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.accountant.institution.InstitutionPlanService;

@RestController
@RequestMapping("/api/public/institution/plans")
public class PublicInstitutionPlanController {
    @Autowired
    InstitutionPlanService institutionPlanService;

    @GetMapping("/getPlans")
    //TODO: Doodać właściwe uprawnienie
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1013')")
    public ApiResponse getInstitutionPlans() {
        return new ApiResponse(HttpStatus.FOUND, institutionPlanService.getPlans("publicProcurement"));
    }
}
