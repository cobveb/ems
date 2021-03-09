package pl.viola.ems.controller.modules.applicant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.modules.applicant.Application;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.modules.applicant.ApplicationService;
import pl.viola.ems.utils.Utils;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/application")
public class ApplicationController {
    @Autowired
    private ApplicationService applicationService;



    @GetMapping("/applicant/getApplications")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1001')")
    public ApiResponse getApplicationsByApplicant() {

        return new ApiResponse(HttpStatus.FOUND, applicationService.findByApplicant(Utils.getCurrentUser()));
    }

    @GetMapping("/coordinator/getApplications")
    //TODO: Dodać właściwe uprawnienie w module koordynator na etapie tworzenie modułu koordynator
    @PreAuthorize("hasGroup('admin') or hasPrivilege('1001')")
    public ApiResponse getApplicationsByCoordinator() {

        return new ApiResponse(HttpStatus.FOUND, applicationService.findByCoordinator(Utils.getCurrentUser()));
    }

    @PreAuthorize("hasGroup('admin') or hasPrivilege('1001')")
    @GetMapping("{application}/getPositions")
    public ApiResponse getApplicationPositions(@PathVariable Long application) {
        return new ApiResponse(HttpStatus.FOUND, applicationService.findPositionsByApplication(application));
    }

    @PutMapping("/{action}/saveApplication")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('2001')")
    public ApiResponse saveApplication(@RequestBody @Valid Application application, @PathVariable String action) {
        return new ApiResponse(HttpStatus.CREATED, applicationService.saveApplication(application, action, Utils.getCurrentUser()));
    }

    @PutMapping("/applicant/send/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('4001')")
    public ApiResponse sendApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationService.updateApplicationStatus(applicationId, "WY"));
    }

    @PutMapping("/applicant/withdraw/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5001')")
    public ApiResponse withdrawApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationService.updateApplicationStatus(applicationId, "ZP"));
    }

    @DeleteMapping("/applicant/deleteApplication/{applicationId}")
    @PreAuthorize("hasGroup('admin') or hasPrivilege('5001')")
    public ApiResponse deleteApplication(@PathVariable Long applicationId) {
        return new ApiResponse(HttpStatus.ACCEPTED, applicationService.deleteApplication(applicationId));
    }
}
